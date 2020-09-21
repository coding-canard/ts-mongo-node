import argon2 from 'argon2';
import { Arg, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class UserResolver{

  @Mutation(() => User!)
  async registerUser(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("username", () => String) username: string
  ){
    const hashedPassword = await argon2.hash(password);
    const user = await User.create({email, password: hashedPassword, username}).save();
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

    ctx.req.session.userId = user._id;

    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: any){
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
    @Arg("id", () => ID) _id: string
  ): Promise<boolean>{
    const user = await User.findOne( _id );
    if(!user){
      return false;
    }
    await User.delete( _id );
    return true;
  }
}