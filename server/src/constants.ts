export const __PROD__ = process.env.NODE_ENV === "production";
export const ACCESS_COOKIE_NAME = "x-access-cookie";
export const REFRESH_COOKIE_NAME = "x-refresh-cookie";
export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES = "7d";
// export const ACCESS_TOKEN_EXPIRES = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
// export const REFRESH_TOKEN_EXPIRES = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
export const ACCESS_COOKIE_EXPIRES = 1000 * 60 * 15 // 15 minutes
export const REFRESH_COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 7 // 7 days