/**
 * Centralized API client for Growth Ka Digital Partner (GDP) platform.
 * Supports public submissions and protected admin session-cookie authentication with CSRF protection.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

let inMemoryCsrfToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setCsrfToken(token: string | null): void {
  inMemoryCsrfToken = token;
}

export function getCsrfToken(): string | null {
  return inMemoryCsrfToken;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  details?: Array<{ field: string; message: string }>;
  data?: T;
  applicationId?: string;
  inquiryId?: string;
  count?: number;
  csrfToken?: string;
  user?: AdminUser;
  stats?: AdminDashboardStats;
  episodes?: ApiEpisode[];
  episode?: ApiEpisode;
  guests?: ApiGuestApplication[];
  guest?: ApiGuestApplication;
  messages?: ApiContactInquiry[];
  contact?: ApiContactInquiry;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  profileImageUrl?: string | null;
}

export interface AdminDashboardStats {
  episodes: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  guestApplications: {
    new: number;
    total: number;
  };
  contactMessages: {
    new: number;
    total: number;
  };
  recentActivity?: Array<{
    id: string;
    action: string;
    entity: string;
    entityId?: string | null;
    details?: string | null;
    createdAt: string;
  }>;
}

export interface ApiEpisode {
  id: string;
  title: string;
  description?: string | null;
  youtubeVideoId: string;
  thumbnailUrl?: string | null;
  guestName?: string | null;
  guestRole?: string | null;
  category?: string | null;
  spotifyUrl?: string | null;
  applePodcastsUrl?: string | null;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEpisodePayload {
  title: string;
  description?: string | null;
  youtubeVideoId: string;
  thumbnailUrl?: string | null;
  guestName?: string | null;
  guestRole?: string | null;
  category?: string | null;
  spotifyUrl?: string | null;
  applePodcastsUrl?: string | null;
  isFeatured?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  displayOrder?: number;
}

export interface UpdateEpisodePayload extends Partial<CreateEpisodePayload> {}

export interface ApiGuestApplication {
  id: string;
  fullName: string;
  companyRole: string;
  email: string;
  phone?: string | null;
  expertiseArea: string;
  topicSummary: string;
  linkedinOrWebsite?: string | null;
  status: "NEW" | "CONTACTED" | "APPROVED" | "REJECTED";
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface GuestApplicationPayload {
  fullName: string;
  companyRole: string;
  email: string;
  phone?: string;
  expertiseArea: string;
  topicSummary: string;
  linkedinOrWebsite?: string;
  consent: boolean;
  _hp?: string;
}

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  _hp?: string;
}

export interface ApiReview {
  id: string;
  rating: number;
  title?: string | null;
  content: string;
  author: string;
  avatarUrl?: string | null;
  date: string;
}

export class ApiError extends Error {
  status: number;
  details?: Array<{ field: string; message: string }>;

  constructor(message: string, status: number, details?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// ============================================================================
// Core Fetch Wrapper
// ============================================================================

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = (options.method || "GET").toUpperCase();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Attach CSRF token on state-mutating requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && inMemoryCsrfToken) {
    headers["x-csrf-token"] = inMemoryCsrfToken;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Enforce cookie-based session persistence
    });

    const data = await response.json().catch(() => null);

    // If server issued/rotated a CSRF token in response, save in memory
    if (data?.csrfToken && typeof data.csrfToken === "string") {
      setCsrfToken(data.csrfToken);
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Clear in-memory token on unauthorized
        setCsrfToken(null);
        if (unauthorizedHandler && typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
          unauthorizedHandler();
        }
      }

      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.details);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || "Unable to communicate with GDP backend server. Please check your network connection.",
      0
    );
  }
}

// ============================================================================
// API Service Methods
// ============================================================================

export const api = {
  // Public APIs
  async submitGuestApplication(payload: GuestApplicationPayload): Promise<ApiResponse> {
    return request<ApiResponse>("/api/guests/apply", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async submitContactInquiry(payload: ContactInquiryPayload): Promise<ApiResponse> {
    return request<ApiResponse>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getEpisodes(params?: { category?: string; featured?: boolean }): Promise<ApiResponse<ApiEpisode[]>> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "All") {
      query.set("category", params.category);
    }
    if (typeof params?.featured === "boolean") {
      query.set("featured", String(params.featured));
    }
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return request<ApiResponse<ApiEpisode[]>>(`/api/episodes${queryString}`, {
      method: "GET",
    });
  },

  async getEpisodeById(id: string): Promise<ApiResponse<ApiEpisode>> {
    return request<ApiResponse<ApiEpisode>>(`/api/episodes/${encodeURIComponent(id)}`, {
      method: "GET",
    });
  },

  async getReviews(): Promise<ApiResponse<ApiReview[]>> {
    return request<ApiResponse<ApiReview[]>>("/api/reviews", {
      method: "GET",
    });
  },

  // Admin Auth APIs
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: AdminUser; csrfToken: string }>> {
    const res = await request<ApiResponse<{ user: AdminUser; csrfToken: string }>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.csrfToken) {
      setCsrfToken(res.csrfToken);
    }
    return res;
  },

  async logout(): Promise<ApiResponse> {
    try {
      const res = await request<ApiResponse>("/api/auth/logout", {
        method: "POST",
      });
      return res;
    } finally {
      setCsrfToken(null);
    }
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: AdminUser; csrfToken: string }>> {
    const res = await request<ApiResponse<{ user: AdminUser; csrfToken: string }>>("/api/auth/me", {
      method: "GET",
    });
    if (res.csrfToken) {
      setCsrfToken(res.csrfToken);
    }
    return res;
  },

  // Admin Dashboard & Management APIs
  async getDashboardStats(): Promise<ApiResponse<{ stats: AdminDashboardStats }>> {
    return request<ApiResponse<{ stats: AdminDashboardStats }>>("/api/admin/dashboard/stats", {
      method: "GET",
    });
  },

  // Episodes Admin
  async getAdminEpisodes(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<ApiEpisode[]>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<ApiResponse<ApiEpisode[]>>(`/api/admin/episodes${qs}`, {
      method: "GET",
    });
  },

  async getAdminEpisodeById(id: string): Promise<ApiResponse<ApiEpisode>> {
    return request<ApiResponse<ApiEpisode>>(`/api/admin/episodes/${encodeURIComponent(id)}`, {
      method: "GET",
    });
  },

  async createAdminEpisode(payload: CreateEpisodePayload): Promise<ApiResponse<ApiEpisode>> {
    return request<ApiResponse<ApiEpisode>>("/api/admin/episodes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateAdminEpisode(id: string, payload: UpdateEpisodePayload): Promise<ApiResponse<ApiEpisode>> {
    return request<ApiResponse<ApiEpisode>>(`/api/admin/episodes/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async archiveAdminEpisode(id: string): Promise<ApiResponse<ApiEpisode>> {
    return request<ApiResponse<ApiEpisode>>(`/api/admin/episodes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  // Guest Applications Admin
  async getAdminGuests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<ApiGuestApplication[]>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<ApiResponse<ApiGuestApplication[]>>(`/api/admin/guests${qs}`, {
      method: "GET",
    });
  },

  async getAdminGuestById(id: string): Promise<ApiResponse<ApiGuestApplication>> {
    return request<ApiResponse<ApiGuestApplication>>(`/api/admin/guests/${encodeURIComponent(id)}`, {
      method: "GET",
    });
  },

  async updateAdminGuestStatus(id: string, status: "NEW" | "CONTACTED" | "APPROVED" | "REJECTED"): Promise<ApiResponse<ApiGuestApplication>> {
    return request<ApiResponse<ApiGuestApplication>>(`/api/admin/guests/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async updateAdminGuestNotes(id: string, adminNotes: string): Promise<ApiResponse<ApiGuestApplication>> {
    return request<ApiResponse<ApiGuestApplication>>(`/api/admin/guests/${encodeURIComponent(id)}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ adminNotes }),
    });
  },

  // Contact Messages Admin
  async getAdminMessages(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<ApiContactInquiry[]>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<ApiResponse<ApiContactInquiry[]>>(`/api/admin/messages${qs}`, {
      method: "GET",
    });
  },

  async getAdminMessageById(id: string): Promise<ApiResponse<ApiContactInquiry>> {
    return request<ApiResponse<ApiContactInquiry>>(`/api/admin/messages/${encodeURIComponent(id)}`, {
      method: "GET",
    });
  },

  async updateAdminMessageStatus(id: string, status: "NEW" | "READ" | "REPLIED" | "ARCHIVED"): Promise<ApiResponse<ApiContactInquiry>> {
    return request<ApiResponse<ApiContactInquiry>>(`/api/admin/messages/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
