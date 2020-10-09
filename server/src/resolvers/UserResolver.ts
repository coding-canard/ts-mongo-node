import argon2 from 'argon2';
import {v4 as uuid} from 'uuid';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { User } from './../entities/User';
import { Post } from './../entities/Post';
import { PostsLoaderByAuthor } from './../dataloaders/PostsLoader';
import { ContextType } from './../types/ContextType';
import { generateTokens } from './../utils/GenerateTokens';
// import { generateCookies } from './../utils/generateCookies';
import { ACCESS_COOKIE_EXPIRES, ACCESS_COOKIE_NAME, REFRESH_COOKIE_EXPIRES, REFRESH_COOKIE_NAME, __PROD__ } from '../Constants';
import { IsAuthenticated } from './../middlewares/IsAuthenticated';
// import { IsOwner } from '../middlewares/IsOwner';
import { InvalidCredentialsError } from './../errors/InvalidCredentialsError';

@Resolver(User)
export class UserResolver{

  @FieldResolver(() => Post)
  async posts(
    @Root() user: User
  ){
    return PostsLoaderByAuthor.load(user.id as any);
  }

  @Query(() => [User]!)
  async users(): Promise<User[]>{
    const users = await User.find({});
    return users;
  }

  @Mutation(() => String!)
  async register(
    @Ctx() { res } : ContextType,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("username", () => String) username: string
  ): Promise<String>{
    const hashedPassword = await argon2.hash(password);
    const user = await User.create({id: uuid(), email, password: hashedPassword, username}).save();
    res.status(201);
    return user.id;
  }

  @Mutation(() => User, {nullable: true})
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res } : ContextType
  ): Promise<User | null>{
    const user = await User.findOne( usernameOrEmail.indexOf('@') > -1 ? { where: { email: usernameOrEmail } } : { where: { username: usernameOrEmail } })
    if(!user){
      throw new InvalidCredentialsError("Invalid credentials");
    }

    const passwordMatch = await argon2.verify(user.password, password);
    if(!passwordMatch){
      throw new InvalidCredentialsError("Invalid credentials");
    }

    const tokens = generateTokens({id: user.id, username: user.username });
    // const cookies = generateCookies(tokens);
    res.status(202);
    res.cookie(ACCESS_COOKIE_NAME, tokens.accessToken, {maxAge: ACCESS_COOKIE_EXPIRES, httpOnly: true, sameSite: "lax", secure: __PROD__, domain: __PROD__ ? "domain" : undefined});
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {maxAge: REFRESH_COOKIE_EXPIRES, httpOnly: true, sameSite: "lax", secure: __PROD__, domain: __PROD__ ? "domain" : undefined});
 
    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: ContextType): Promise<boolean>{
    return new Promise((resolve) => {
      res.status(202);
      res.clearCookie(ACCESS_COOKIE_NAME);
      res.clearCookie(REFRESH_COOKIE_NAME);
      resolve(true);
    })
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuthenticated())
  async deleteUser(
    @Ctx() { req, res }: ContextType,
    @Arg("id", () => String) id: string
  ): Promise<boolean>{
    const user = await User.findOne({where: { id }});
    res.status(202);
    if(!user){
      return true;
    }
    await User.delete({ id });
    if(id === req.user.id){
      res.clearCookie(ACCESS_COOKIE_NAME);
      res.clearCookie(REFRESH_COOKIE_NAME);
    }
    return true;
  }
}