import "reflect-metadata";
import * as dotenv from 'dotenv';
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cookieParser from "cookie-parser";
// import cors from 'cors';
// import { corsConfig } from './configs/corsConfig';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from "./resolvers/UserResolver";
import { ContextType } from "./types/ContextType";
import { PublisherResolver } from "./resolvers/PublisherResolver";

dotenv.config();

const main = async() => {
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, PublisherResolver],
      validate: false,
    }),
    context: ({req, res}: ContextType) => ({
      req, res, //redis
    }),
  });

  const app = express();

  // app.use(cors(corsConfig));

  app.use(cookieParser());

  apolloServer.applyMiddleware({ app });

  app.listen(process.env.SERVER_PORT, () => console.log(`Listening on port ${process.env.SERVER_PORT}`));
}

main().catch((err) => console.log(err));