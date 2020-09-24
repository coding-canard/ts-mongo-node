import argon2 from 'argon2';
import {v4 as uuid} from 'uuid';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { User } from './../entities/User';
import { Post } from './../entities/Post';
import { PostsLoader } from './../dataloaders/PostsLoader';

@Resolver(User)
export class UserResolver{

  @FieldResolver(() => Post)
  async posts(
    @Root() user: User
  ){
    return PostsLoader.load(user.id as any);
  }

  @Query(() => [User]!)
  async users(): Promise<User[]>{
    const posts = await User.find({});
    return posts;
  }

  @Mutation(() => User!)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("username", () => String) username: string
  ){
    const hashedPassword = await argon2.hash(password);
    const user = await User.create({id: uuid(), email, password: hashedPassword, username}).save();
    return user;
  }

  @Mutation(() => User, {nullable: true})
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password", () => String) password: string,
    @Ctx() ctx : any
  ): Promise<User | null>{
    if(ctx.req.session.userId){
      throw new Error("An user is already logged in");
    }

    const user = await User.findOne( usernameOrEmail.indexOf('@') > -1 ? { where: { email: usernameOrEmail } } : { where: { username: usernameOrEmail } })
    if(!user){
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await argon2.verify(user.password, password);
    if(!passwordMatch){
      throw new Error("Invalid credentials");
    }

    ctx.req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: any): Promise<boolean>{
    return new Promise((resolve) => 
      req.session.destroy((err: any) => {
        res.clearCookie(process.env.COOKIE_NAME);
        if(err){
          resolve(false);
          return;
        }
        resolve(true);
      })
    )
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id", () => String) id: string
  ): Promise<boolean>{
    const user = await User.findOne({where: { id }});
    if(!user){
      return false;
    }
    await User.delete({ id });
    return true;
  }
}