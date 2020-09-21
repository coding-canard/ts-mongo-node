import "reflect-metadata";
import * as dotenv from 'dotenv';
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
// import Redis from "ioredis";
// import session from "express-session";
// import connectRedis from "connect-redis";
// import cors from "cors";
import { __PROD__ } from './constants';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from "./resolvers/UserResolver";

dotenv.config();

// console.log("SECRET\n", process.env.SECRET)

const main = async() => {
  await createConnection();

  const app = express();

  // const RedisStore = connectRedis(session);
  // const redis = new Redis(process.env.REDIS_URL);

  // app.set("trust proxy", 1);

  // app.use(session({
  //   name: process.env.COOKIE_NAME,
  //   store: new RedisStore({
  //     client: redis,
  //     disableTouch: true,
  //   }),
  //   cookie: {
  //     maxAge: 1000 * 60 * 60 * 24 * 8,
  //     httpOnly: true,
  //     sameSite: "lax",
  //     secure: __PROD__,
  //     domain: __PROD__ ? "domain" : undefined,
  //   },
  //   saveUninitialized: false,
  //   secret: SECRET,
  //   resave: false
  // }))

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
}

main().catch((err) => console.log(err));