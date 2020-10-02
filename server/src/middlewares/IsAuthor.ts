import { MiddlewareFn, NextFn, ResolverData } from "type-graphql";
import { Post } from "../entities/Post";
import { ContextType } from "../types/ContextType";

export const IsAuthor = (message?: string): MiddlewareFn<ContextType> => async ({ context, args }: ResolverData<ContextType>, next: NextFn) => {

  const count = await Post.count({ id: args.id, authorId: context.req.user.id});

  if(count !== 1){
    throw new Error(message ? message : "Unauthorized - You cannot perform this action.");
  }
  return next();
};
