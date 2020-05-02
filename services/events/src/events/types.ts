import { Request } from "express";
import {
  HasuraEventTriggerEvent,
  HasuraEventTriggerManual,
  AnyObject,
  HasuraEventTriggerPayload
} from "../shared/types";

export type EventTriggerPayload =
  HasuraEventTriggerPayload<HasuraEventTriggerManual>;

export type EventTriggerHandler<P extends HasuraEventTriggerEvent, R = AnyObject> =
  (req: Request, payload: HasuraEventTriggerPayload<P>) => Promise<R>;

export type EventTriggerHandlerMap = {
  readonly [key: string]: EventTriggerHandler<HasuraEventTriggerEvent>
};
