import * as express from "express";
import { newApolloServer } from "./graphql";
import { newRouter } from "./handler";

export const newServer = async (): Promise<express.Express> => {
  const app = express()
    .use(newRouter());

  newApolloServer().applyMiddleware({ app });

  return app;
};
