import { ActionHandlerMap } from "./types";
import userActions from "./user";

export default {
  ...userActions
} as ActionHandlerMap;
