import jwt from 'jsonwebtoken';
import { ACCESS_SECRET, REFRESH_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from './../constants';
import { User } from './../entities/User';

export const generateTokens: any = (user: User) => {
  const accessToken = jwt.sign({user: user}, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
  const refreshToken = jwt.sign({user: user}, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
  return {accessToken, refreshToken};
}