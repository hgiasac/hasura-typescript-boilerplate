import { Request } from "express";
import {
  HasuraEventTriggerEvent,
  HasuraEventTriggerManual,
  AnyObject,
  HasuraEventTriggerPayload
} from "../shared/types";
import { Logger } from "winston";

export type EventContext = {
  readonly request: Request
  readonly logger: Logger
};

export type EventTriggerPayload =
  HasuraEventTriggerPayload<HasuraEventTriggerManual>;

export type EventTriggerHandler<P extends HasuraEventTriggerEvent, R = AnyObject> =
  (ctx: EventContext, payload: HasuraEventTriggerPayload<P>) => Promise<R>;

export type EventTriggerHandlerMap = {
  readonly [key: string]: EventTriggerHandler<HasuraEventTriggerEvent>
};
