export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const USER_STATUSES = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DEACTIVATED: "DEACTIVATED",
} as const;
export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export const REVIEW_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  HIDDEN: "HIDDEN",
} as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];

export const VIDEO_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type VideoStatus = (typeof VIDEO_STATUSES)[keyof typeof VIDEO_STATUSES];

export const INQUIRY_STATUSES = {
  NEW: "NEW",
  READ: "READ",
  REPLIED: "REPLIED",
  ARCHIVED: "ARCHIVED",
} as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[keyof typeof INQUIRY_STATUSES];
