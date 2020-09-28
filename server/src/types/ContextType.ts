import { Request, Response } from "express";
import { IUser } from "./TokenUser";

export interface AuthUserInfoRequest extends Request {
  user: IUser
}

export type ContextType = {
  req: AuthUserInfoRequest;
  res: Response;
};