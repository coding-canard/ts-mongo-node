import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import {v4 as uuid} from 'uuid';
import { IsAuthenticated } from "../middlewares/IsAuthenticated";
import { ContextType } from './../types/ContextType';
import { Publisher } from "./../entities/Publisher";
import { User } from "./../entities/User";
import { Post } from "./../entities/Post";
import { PostsLoaderByPublisher } from "./../dataloaders/PostsLoader";

@Resolver(Publisher)
export class PublisherResolver {

  @FieldResolver(() => User)
  async creator(
    @Root() publisher: Publisher
  ){
    return await User.findOne({where: {id: publisher.createdBy}});
  }

  @FieldResolver(() => User)
  async updator(
    @Root() publisher: Publisher
  ){
    return await User.findOne({where: {id: publisher.updatedBy}});
  }

  @FieldResolver(() => Post)
  async posts(
    @Root() publisher: Publisher
  ){
    return PostsLoaderByPublisher.load(publisher.id as any);
  }

  @Query(() => [Publisher]!)
  async publishers(
  ): Promise<Publisher[]>{
    const publishers = await (await Publisher.find({}));
    return publishers;
  }

  @Query(() => Publisher, {nullable: true})
  async publisher(
    @Arg("id", () => String) id: string
  ): Promise<Publisher | undefined>{
    const publisher = await Publisher.findOne({where: { id }});
    return publisher;
  }

  @Mutation(() => Publisher)
  @UseMiddleware(IsAuthenticated())
  async createPublisher(
    @Ctx() { req, res }: ContextType,
    @Arg("name", () => String) name: string
  ): Promise<Publisher>{
    const publisher = await Publisher.create({id: uuid(), name, createdBy: req.user.id, updatedBy: req.user.id }).save();
    res.status(201);
    return publisher;
  }

  @Mutation(() => Publisher, {nullable: true})
  @UseMiddleware(IsAuthenticated())
  async updatePublisher(
    @Ctx() { req, res }: ContextType,
    @Arg("id", () => String) id: string,
    @Arg("name", () => String) name: string
  ): Promise<Publisher | null>{

    const publisher = await Publisher.findOne({where: { id }});

    if(!publisher){
      res.status(404);
      return null;
    }

    publisher.name = name;
    publisher.updatedBy = req.user.id;

    await publisher.save();
    res.status(202);
    return publisher;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuthenticated())
  async deletePublisher(
    @Ctx() { req, res }: ContextType,
    @Arg("id", () => String) id: string
  ): Promise<boolean>{
    const publisher = await Publisher.findOne({where: { id }});
    res.status(202);
    
    if(!publisher){
      return false;
    }

    if(req.session!.userId !== publisher.createdBy){
      throw new Error("Unauthorized - Only owners can delete their publication.");
    }

    await Publisher.delete( id );
    return true;
  }

}