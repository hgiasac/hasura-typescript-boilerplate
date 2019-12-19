import { json } from "body-parser";
import * as express from "express";
import { newRouter } from "./handler";

export const newServer = async (): Promise<express.Express> =>
  express()
    .use(json())
    .use(newRouter());
