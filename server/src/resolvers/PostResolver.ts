import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import {v4 as uuid} from 'uuid';
import { AuthenticationError } from "apollo-server-express";
import { Post } from "./../entities/Post";
import { IsAuthenticated } from "../middlewares/IsAuthenticated";
import { ContextType } from './../types/ContextType';
import { User } from "./../entities/User";
import { UsersLoader } from "./../dataloaders/UsersLoader";
import { Publisher } from "./../entities/Publisher";
import { PublishersLoader } from "./../dataloaders/PublishersLoader";

@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => User)
  async author(
    @Root() post: Post
   ){
      return await UsersLoader.load(post.authorId as any);
   }

   @FieldResolver(() => Publisher)
  async publisher(
    @Root() post: Post
   ){
     if(typeof post.publisherId !== 'undefined'){
       return await PublishersLoader.load(post.publisherId as any); 
     } else {
       return null;
     }
   }

  @Query(() => [Post]!)
  async posts(): Promise<Post[]>{
    const posts = await (await Post.find({})).sort((p1, p2) => p1.createdAt < p2.createdAt ? 1 : -1);
    return posts;
  }

  @Query(() => Post, {nullable: true})
  async post(
    @Arg("id", () => String) id: string
  ): Promise<Post | undefined>{
    const post = await Post.findOne({where: { id }});
    return post;
  }

  @Query(() => [Post]!, {nullable: true})
  async authoredBy(
    @Arg("authorId", () => String) authorId: string
  ): Promise<Post[]>{
    const posts = await Post.find({where: { authorId }});;
    return posts;
  }

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
    @Arg("publisherId", () => String, {nullable: true}) publisherId?: string,    
  ): Promise<Post>{
    const post = await Post.create({id: uuid(), title, text, authorId: req.user.id, publisherId }).save();
    return post;
  }

  @Mutation(() => Post, {nullable: true})
  @UseMiddleware(IsAuthenticated)
  async updatePost(
    @Ctx() { req }: ContextType,
    @Arg("id", () => String) id: string,
    @Arg("title", () => String, {nullable: true}) title?: string,
    @Arg("text", () => String, {nullable: true}) text?: string,
    @Arg("publisherId", () => String, {nullable: true}) publisherId?: string
  ): Promise<Post | null>{

    const post = await Post.findOne({where: { id }});
    if(!post){
      return null;
    }
    
    if(req.user.id !== post.authorId){
      throw new AuthenticationError("Unauthorized - Only authors can edit their post");
    }
    if(typeof title !== "undefined"){
      post.title = title;
    }
    if(typeof text !== "undefined"){
      post.text = text;
    }
    if(typeof publisherId !== "undefined"){
      post.publisherId = publisherId;
    }
    await post.save();
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuthenticated)
  async deletePost(
    @Ctx() { req }: ContextType,
    @Arg("id", () => String) id: string
  ): Promise<boolean>{
    const post = await Post.findOne({where: { id }});
    if(!post){
      return false;
    }

    if(req.session!.userId !== post.authorId){
      throw new Error("Unauthorized - Only authors can delete their posts");
    }

    await Post.delete( id );
    return true;
  }

}