import { HasuraExpressContext, HasuraActionHandler, HasuraActionPayload, AnyRecord } from "hasura-node-types";
import * as winston from "winston";

export type AppContext = HasuraExpressContext<winston.Logger>;
export type ActionHandler<P extends HasuraActionPayload, R extends AnyRecord>
  = HasuraActionHandler<P, R, AppContext>;
