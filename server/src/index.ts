import "reflect-metadata";
import * as dotenv from 'dotenv';
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer, AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cookieParser from "cookie-parser";
// import cors from 'cors';
// import { corsConfig } from './configs/corsConfig';
import { PostResolver } from './resolvers/PostResolver';
import { UserResolver } from "./resolvers/UserResolver";
import { ContextType } from "./types/ContextType";
import { PublisherResolver } from "./resolvers/PublisherResolver";
import { GraphQLRequestContext, GraphQLRequestListener } from "apollo-server-plugin-base";
import { UnauthorizedError } from "./errors/UnauthorizedError";

dotenv.config();

const ErrorRaisingPlugin: any = {
  requestDidStart(): GraphQLRequestListener | void {
    return {
      willSendResponse({context, errors}: GraphQLRequestContext) {
        if(errors && errors.length > 0){
          if(errors[0].originalError instanceof ForbiddenError){
            context.res.statusCode = 403;
          }
          else if(errors[0].originalError instanceof AuthenticationError){
            context.res.statusCode = 401;
          } else if(errors[0].originalError instanceof UnauthorizedError){
            context.res.statusCode = 401;
          } else {
            context.res.statusCode = 500;
          }
        }
      },
    };
  },
};

const main = async() => {
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, PublisherResolver],
      validate: false,
    }),
    context: ({req, res}: ContextType) => ({
      req, res,
    }),
    formatError: err => {
      if(err.originalError instanceof ForbiddenError )
        return ({message: err.message, statusCode: 403})
      else if(err.originalError instanceof AuthenticationError )
        return ({message: err.message, statusCode: 401})
      else if(err.originalError instanceof UnauthorizedError )
        return ({message: err.message, statusCode: 401})
      
      return ({message: "Internal server error", statusCode: 500})
    },
    plugins: [ErrorRaisingPlugin]
  });

  const app = express();

  // app.use(cors(corsConfig));

  app.use(cookieParser());

  apolloServer.applyMiddleware({ app });

  app.listen(process.env.SERVER_PORT, () => console.log(`Listening on port ${process.env.SERVER_PORT}`));
}

main().catch((err) => console.log(err));