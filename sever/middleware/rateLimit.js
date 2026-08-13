import rateLimit from "express-rate-limit";

export const RegisterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes

  max: 5, // only 5 requests

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many registration attempts. Please try again after 15 minutes.",
  },
});

export const LoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts",
  },
});

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many OTP verification attempts",
  },
});

export const Ratelimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
