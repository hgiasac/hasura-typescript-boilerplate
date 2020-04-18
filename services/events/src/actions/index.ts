import { IActionHandlerMap } from "./types";
import { createUserHandler } from "./user";
import { CREATE_USER_ACTION } from "./user/types";

export default {
  [CREATE_USER_ACTION]: createUserHandler,
} as IActionHandlerMap;
