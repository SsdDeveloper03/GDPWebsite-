export interface ReviewReply {
  id: string;
  userName: string;
  userAvatar?: string;
  role?: string;
  content: string;
  date: string;
  helpfulCount?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  companyName?: string;
  role?: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  dislikesCount?: number;
  replies?: ReviewReply[];
  creatorHeart?: boolean;
}

export interface RatingSummary {
  average: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  publishedDate: string;
  views?: string;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  tag: string;
  iconName: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  profession?: string;
  budget?: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  tag: string;
}

export interface AudienceItem {
  id: string;
  title: string;
  roleDescription: string;
  podcastFocus: string;
  iconName: string;
}

export interface ProcessStep {
  step: string;
  phase: 'Before' | 'During' | 'After';
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  iconName: string;
}

export interface FounderBio {
  name: string;
  title: string;
  company?: string;
  portfolioUrl?: string;
  location: string;
  tagline: string;
  story: string[];
  philosophy: string;
  vision: string;
  mission: string;
  socials: {
    linkedin: string;
    instagram: string;
    youtube: string;
    whatsapp: string;
    portfolio?: string;
  };
}

export interface CredibilityConfig {
  showUnverifiedStats: boolean;
  unverifiedStats: Array<{
    value: string;
    label: string;
    note: string;
  }>;
  verifiedPillars: Array<{
    title: string;
    description: string;
    iconName: string;
  }>;
}

