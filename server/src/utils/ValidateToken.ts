import { verify } from "jsonwebtoken";
import { TokenUser, TokenUserType } from "./../types/TokenUser";

export const validateToken: TokenUserType = (token: any, secret: string) => {
  try {
    return verify(token, secret) as TokenUser;
  } catch {
    return null;
  }
}