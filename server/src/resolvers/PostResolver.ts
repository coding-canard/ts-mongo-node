import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {

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

  @Query(() => [Post]!, {nullable: true})
  async authoredBy(
    @Arg("author", () => String) author: string
  ): Promise<Post[]>{
    const posts = await Post.find( { author });
    return posts;
  }

  @Query(() => [Post]!, {nullable: true})
  async publishedBy(
    @Arg("publisher", () => String) publisher: string
  ): Promise<Post[]>{
    const posts = await Post.find( { publisher });
    return posts;
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
    @Arg("author", () => String) author: string,
    @Arg("publisher", () => String, {nullable: true}) publisher?: string,
  ): Promise<Post>{
    const post = await Post.create({ title, text, author, publisher }).save();
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id", () => ID) _id: string,
    @Arg("title", () => String, {nullable: true}) title?: string,
    @Arg("text", () => String, {nullable: true}) text?: string,
    @Arg("publisher", () => String, {nullable: true}) publisher?: string
  ): Promise<Post | undefined>{
    const post = await Post.findOne( _id );
    if(!post){
      return undefined;
    }
    if(!(typeof title === "undefined" )){
      post.title = title;
    }
    if(!(typeof text === "undefined" )){
      post.text = text;
    }
    if(!(typeof publisher === "undefined" )){
      post.publisher = publisher;
    }
    await post.save();
    return post;
  }

  @Mutation(() => Boolean)
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