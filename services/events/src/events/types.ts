import { HasuraExpressContext, HasuraEventHandler, HasuraEvent, AnyRecord } from "hasura-node-types";
import * as winston from "winston";

export type AppContext = HasuraExpressContext<winston.Logger>;
export type EventHandler<EV extends HasuraEvent = HasuraEvent, R = AnyRecord>
  = HasuraEventHandler<EV, R, string, AppContext>;
