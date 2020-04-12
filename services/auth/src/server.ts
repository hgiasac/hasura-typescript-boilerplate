import * as express from "express";
import { newRouter } from "./handler";

export const newServer = async (): Promise<express.Express> =>
  express()
    .use(newRouter());
