import { HasuraExpressContext } from "hasura-node-types";
import * as winston from "winston";

export type AppContext = HasuraExpressContext<winston.Logger>;
