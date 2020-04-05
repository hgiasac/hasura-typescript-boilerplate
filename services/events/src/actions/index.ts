import { IActionHandlerMap } from "./types";
import { createUserHandler, loginHandler } from "./user";
import { CREATE_USER_ACTION, LOGIN_ACTION } from "./user/types";

export default {
  [LOGIN_ACTION]: loginHandler,
  [CREATE_USER_ACTION]: createUserHandler,
} as IActionHandlerMap;
