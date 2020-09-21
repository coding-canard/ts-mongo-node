import { Arg, Mutation, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';
import { User } from "../entities/User";

@Resolver()
export class UserResolver{

  @Query(() => [User]!)
  async users(): Promise<User[]>{
    const users = await User.find();
    return users;
  }

  @Mutation(() => User!)
  async createUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("username", () => String) username: string,
  ){
    const hashedPassword = await argon2.hash(password);
    const user = await User.create({email, password: hashedPassword, username}).save();
    return user;
  }
}