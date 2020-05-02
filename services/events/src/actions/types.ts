import { Request } from "express";
import { Logger } from "winston";
import { AnyObject, HasuraActionPayload } from "../shared/types";

export type ActionPayload = HasuraActionPayload;

export type ActionContext = {
  readonly request: Request
  readonly logger: Logger
};

export type ActionHandler<P extends HasuraActionPayload, R = AnyObject> =
  (ctx: ActionContext, payload: P) => Promise<R>;

export type ActionHandlerMap = {
  readonly [key: string]: ActionHandler<ActionPayload>
};
