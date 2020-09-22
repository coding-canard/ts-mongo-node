import { MiddlewareFn } from "type-graphql";
import { ContextType } from "./../types/ContextType";

export const IsAuthenticated: MiddlewareFn<ContextType> = ({ context }, next) => {
  if(!context.req!.session!.userId){
    throw new Error("Unauthenticated");
  }
  return next();
}