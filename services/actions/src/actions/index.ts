import { HasuraActionExpressHandlerMap } from "hasura-node-types";
import userActions from "./user";

export default {
  ...userActions
} as HasuraActionExpressHandlerMap;
