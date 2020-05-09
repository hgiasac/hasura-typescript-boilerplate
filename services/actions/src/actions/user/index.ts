import { changeUserPassword, createUserHandler, helloHandler } from "./handler";
import { CHANGE_USER_PASSWORD_ACTION, CREATE_USER_ACTION, HELLO_ACTION } from "./types";
import { HasuraActionExpressHandlerMap } from "hasura-node-types";

export default {
  [HELLO_ACTION]: helloHandler,
  [CREATE_USER_ACTION]: createUserHandler,
  [CHANGE_USER_PASSWORD_ACTION]: changeUserPassword
} as HasuraActionExpressHandlerMap;
