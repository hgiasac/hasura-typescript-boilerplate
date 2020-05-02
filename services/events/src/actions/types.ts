import { Request } from "express";
import { AnyObject, HasuraActionPayload } from "../shared/types";

export type ActionPayload = HasuraActionPayload;

export type ActionHandler<P extends HasuraActionPayload, R = AnyObject> =
  (req: Request, payload: P) => Promise<R>;

export type ActionHandlerMap = {
  readonly [key: string]: ActionHandler<ActionPayload>
};
