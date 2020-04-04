import { Request } from "express";
import { HasuraEventTriggerEvent, HasuraEventTriggerManual, IAnyObject, IHasuraEventTriggerPayload } from "../shared/types";

export type EventTriggerPayload =
  IHasuraEventTriggerPayload<HasuraEventTriggerManual>;

export type EventTriggerHandler<P extends HasuraEventTriggerEvent, R = IAnyObject> =
  (req: Request, payload: IHasuraEventTriggerPayload<P>) => Promise<R>;

export interface IEventTriggerHandlerMap {
  [key: string]: EventTriggerHandler<HasuraEventTriggerEvent>;
}
