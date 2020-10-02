import { __PROD__ } from "../Constants";

export const generateCookies = (tokens: any) => {
  const cookieOptions = {
    httpOnly: true,
      sameSite: "lax",
      secure: __PROD__,
      domain: __PROD__ ? "domain" : undefined,
  };

  return {
    access: [process.env.ACCESS_COOKIE_NAME, tokens.accessToken, cookieOptions],
    refresh: [process.env.REFRESH_COOKIE_NAME, tokens.refreshToken, cookieOptions]
  };
}