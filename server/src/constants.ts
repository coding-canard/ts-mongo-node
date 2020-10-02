export const __PROD__ = process.env.NODE_ENV === "production";
export const ACCESS_COOKIE_NAME = "x-access-cookie";
export const REFRESH_COOKIE_NAME = "x-refresh-cookie";
export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES = "1d";
export const ACCESS_COOKIE_EXPIRES = 1000 * 60 * 15 // 15 minutes
export const REFRESH_COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 1 // 1 days