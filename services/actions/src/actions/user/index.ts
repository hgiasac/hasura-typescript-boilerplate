
import { HasuraActionExpressHandlerMap } from "hasura-node-types";
import { changeProfilePasswordHandler, changeUserPasswordHandler, createUserHandler, loginHandler } from "./handler";
import { CHANGE_PROFILE_PASSWORD_ACTION, CHANGE_USER_PASSWORD_ACTION, CREATE_USER_ACTION, LOGIN_ACTION } from "./types";

export default {
  [LOGIN_ACTION]: loginHandler,
  [CREATE_USER_ACTION]: createUserHandler,
  [CHANGE_USER_PASSWORD_ACTION]: changeUserPasswordHandler,
  [CHANGE_PROFILE_PASSWORD_ACTION]: changeProfilePasswordHandler
} as HasuraActionExpressHandlerMap;
