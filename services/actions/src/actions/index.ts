import { HasuraActionPayload } from "../shared/types";
import { ActionHandler, ActionHandlerMap } from "./types";

// example action
const helloHandler: ActionHandler<HasuraActionPayload<"hello", { readonly hello: string }>> =
  (_, { input }) =>
    Promise.resolve({ hello: `Hello ${input.hello}` });

export default {
  hello: helloHandler
} as ActionHandlerMap;
