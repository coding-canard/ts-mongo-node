import { Request, Response } from "express";
import { UserLoader } from "./../dataloaders/UserLoader";

export type ContextType = {
  req: Request;
  res: Response;
  userLoader: ReturnType<typeof UserLoader>
};