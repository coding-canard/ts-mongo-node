import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import {v4 as uuid} from 'uuid';
import { Post } from "./../entities/Post";
import { IsAuthenticated } from "../middlewares/IsAuthenticated";
import { ContextType } from './../types/ContextType';
import { User } from "./../entities/User";
import { UsersLoader } from "./../dataloaders/UsersLoader";

@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => User)
  async author(
    @Root() post: Post
   ){
      return UsersLoader.load(post.authorId as any);
   }

  @Query(() => [Post]!)
  async posts(): Promise<Post[]>{
    const posts = await Post.find({});
    return posts;
  }

  @Query(() => Post, {nullable: true})
  async post(
    @Arg("id", () => String) id: string
  ): Promise<Post | undefined>{
    const posts = await Post.findOne({where: { id }});
    return posts;
  }

  // @Query(() => [Post]!, {nullable: true})
  // async authoredBy(
  //   @Arg("author", () => String) authorId: string
  // ): Promise<Post[]>{
  //   const posts = await Post.find({where: { authorId }});;
  //   return posts;
  // }

  // @Query(() => [Post]!, {nullable: true})
  // async publishedBy(
  //   @Arg("publisher", () => String) publisherId: string
  // ): Promise<Post[]>{
  //   const posts = await Post.findOne({where: { publisherId }});;
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
    const post = await Post.create({id: uuid(), title, text, authorId: req!.session!.userId, publisher }).save();
    return post;
  }

  @Mutation(() => Post, {nullable: true})
  @UseMiddleware(IsAuthenticated)
  async updatePost(
    @Ctx() ctx: ContextType,
    @Arg("id", () => String) id: string,
    @Arg("title", () => String, {nullable: true}) title?: string,
    @Arg("text", () => String, {nullable: true}) text?: string,
    @Arg("publisher", () => String, {nullable: true}) publisher?: string
  ): Promise<Post | null>{

    const post = await Post.findOne({where: { id }});
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
    @Arg("id", () => String) id: string
  ): Promise<boolean>{
    const post = await Post.findOne({where: { id }});
    if(!post){
      return false;
    }
    await Post.delete( id );
    return true;
  }

}