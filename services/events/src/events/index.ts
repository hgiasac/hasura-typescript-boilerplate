import { HasuraEventExpressHandlerMap } from "hasura-node-types";
import { EventHandler } from "./types";

const helloEvent: EventHandler = () => Promise.resolve({
  hello: "world"
});

export default {
  hello: helloEvent
} as HasuraEventExpressHandlerMap;
