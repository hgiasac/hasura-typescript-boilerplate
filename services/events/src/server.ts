import { json } from "body-parser";
import * as express from "express";
// import { newApolloServer } from "./graphql";
import { newRouter } from "./handler";

export const newServer = (): Promise<express.Express> =>
  Promise.resolve(
    express()
      .use(json())
      .use(newRouter())
  );
  // from graphql engine 1.2.0, action can replace remote schema
  // therefore graphql server is optional 
  // newApolloServer().applyMiddleware({ app });
