import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-express";
import { ContextType } from "./../types/ContextType";
import { REFRESH_COOKIE_NAME, ACCESS_COOKIE_NAME, ACCESS_SECRET, ACCESS_COOKIE_EXPIRES, __PROD__, REFRESH_SECRET } from "../Constants";
import { validateToken } from "./../utils/ValidateToken";
import { User } from "./../entities/User";
import { generateTokens } from "./../utils/GenerateTokens";

export const IsAuthenticated: MiddlewareFn<ContextType> = async ({ context }, next) => {
  const { req, res } = context;
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
  const accessToken = req.cookies[ACCESS_COOKIE_NAME];

  if (!accessToken && !refreshToken){
    throw new AuthenticationError("Authentication is required for this action.")
  };

  const decodedAccessToken = validateToken(accessToken, ACCESS_SECRET);
  // console.log("Decoded:", decodedAccessToken)
  if (decodedAccessToken && decodedAccessToken.user) {
    req.user = decodedAccessToken.user;
    console.log("REQ USER:", req.user);
    return next();
  }

  const decodedRefreshToken = validateToken(refreshToken, REFRESH_SECRET);
  if (decodedRefreshToken && decodedRefreshToken.user){
    const user = await User.findOne({ where: { id: decodedRefreshToken.user.id }})
    if(!user){
      res.clearCookie(ACCESS_COOKIE_NAME);
      res.clearCookie(REFRESH_COOKIE_NAME);
    }

    const tokens = generateTokens({id: user!.id, username: user!.username });
    req.user = decodedRefreshToken.user;
    res.cookie(ACCESS_COOKIE_NAME, tokens.accessToken, {maxAge: ACCESS_COOKIE_EXPIRES, httpOnly: true, sameSite: "lax", secure: __PROD__, domain: __PROD__ ? "domain" : undefined});
    return next();
  }

  return next();
}