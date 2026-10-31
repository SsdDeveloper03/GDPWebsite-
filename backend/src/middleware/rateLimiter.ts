import rateLimit from "express-rate-limit";

// Rate limiter for form submissions (Guest application & Contact inquiries)
export const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 submissions per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too Many Requests",
    message: "You have submitted multiple requests recently. Please wait a few minutes before trying again.",
  },
});

// Rate limiter for general public read APIs (Episodes, Reviews)
export const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Max 200 requests per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too Many Requests",
    message: "Rate limit exceeded. Please try again shortly.",
  },
});

// Rate limiter for authentication attempts (Login)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too Many Requests",
    message: "Too many login attempts. Please wait 15 minutes before trying again.",
  },
});
