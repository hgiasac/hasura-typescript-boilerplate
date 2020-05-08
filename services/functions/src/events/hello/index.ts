import { withExpress } from "hasura-node-types";
import { logger } from "../../shared/logger";
import { DEBUG } from "../../shared/env";

const triggerMap = {
  hello: () => Promise.resolve({})
};

export default withExpress({
  debug: DEBUG,
  logger
}).useEvents(triggerMap);
