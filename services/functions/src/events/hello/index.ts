import { withEventTrigger, EventTriggerHandlerMap } from "../../shared/hasura/event-wrapper";

const triggerMap = {
  hello: () => Promise.resolve({})
} as EventTriggerHandlerMap;

export default withEventTrigger(triggerMap);
