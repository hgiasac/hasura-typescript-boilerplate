import { Request } from "express";
import { Logger } from "winston";
import { IAnyObject, IHasuraActionPayload } from "../shared/types";

export type ActionPayload = IHasuraActionPayload;

export interface IActionContext {
  request: Request;
  logger: Logger;
}

export type ActionHandler<P extends IHasuraActionPayload, R = IAnyObject> =
  (req: IActionContext, payload: P) => Promise<R>;

export interface IActionHandlerMap {
  [key: string]: ActionHandler<ActionPayload>;
}
