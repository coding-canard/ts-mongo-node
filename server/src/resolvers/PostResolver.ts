import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Post } from "./../entities/Post";
import { IsAuthenticated } from "../middlewares/IsAuthenticated";
import { ContextType } from './../types/ContextType';
import { User } from "./../entities/User";
import DataLoader from "dataloader";

@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => User)
  author(
    @Root() post: Post,
    // @Ctx() { userLoader }: ContextType,
   ){
    const UserLoader = () => new DataLoader<number, User>(async (userIds) => {
      const users = await User.findByIds(userIds as any[]);
      const userIdToUser: Record<string, User> = {};
      users.forEach((u) => {
        userIdToUser[u._id as any] = u;
      });
    
      const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
      return sortedUsers;
    });
    return UserLoader.load(post.authorId as any);
  }

  @Query(() => [Post]!)
  async posts(): Promise<Post[]>{
    const posts = await Post.find({});
    return posts;
  }

  @Query(() => Post, {nullable: true})
  async post(
    @Arg("id", () => ID) _id: string
  ): Promise<Post | undefined>{
    const posts = await Post.findOne( _id );
    return posts;
  }

  // @Query(() => [Post]!, {nullable: true})
  // async authoredBy(
  //   @Arg("author", () => String) author: string
  // ): Promise<Post[]>{
  //   const posts = await Post.find( { author });
  //   return posts;
  // }

  // @Query(() => [Post]!, {nullable: true})
  // async publishedBy(
  //   @Arg("publisher", () => String) publisher: string
  // ): Promise<Post[]>{
  //   const posts = await Post.find( { publisher });
  //   return posts;
  // }

  @Mutation(() => Post)
  @UseMiddleware(IsAuthenticated)
  async createPost(
    @Ctx() { req }: ContextType,
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
    @Arg("publisher", () => String, {nullable: true}) publisher?: string,    
  ): Promise<Post>{
    const post = await Post.create({ title, text, authorId: req!.session!.userId, publisher }).save();
    return post;
  }

  @Mutation(() => Post, {nullable: true})
  @UseMiddleware(IsAuthenticated)
  async updatePost(
    @Ctx() ctx: ContextType,
    @Arg("id", () => ID) _id: string,
    @Arg("title", () => String, {nullable: true}) title?: string,
    @Arg("text", () => String, {nullable: true}) text?: string,
    @Arg("publisher", () => String, {nullable: true}) publisher?: string
  ): Promise<Post | null>{

    const post = await Post.findOne( _id );
    if(!post){
      return null;
    }

    if(ctx.req.session!.userId !== post.authorId){
      throw new Error("Unauthorized - Only authors can edit");
    }

    if(typeof title !== "undefined"){
      post.title = title;
    }
    if(typeof text !== "undefined"){
      post.text = text;
    }
    if(typeof publisher !== "undefined"){
      post.publisher = publisher;
    }
    await post.save();
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuthenticated)
  async deletePost(
    @Arg("id", () => ID) _id: string
  ): Promise<boolean>{
    const post = await Post.findOne( _id );
    if(!post){
      return false;
    }
    await Post.delete( _id );
    return true;
  }

}