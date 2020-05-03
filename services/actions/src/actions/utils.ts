import { HasuraActionPayload, XHasuraRole, XHasuraUserID } from "../shared/types";

export function getActionUserID(payload: HasuraActionPayload): string | null {
  return payload.session_variables
    ? payload.session_variables[XHasuraUserID]
    : null;
}

export function getActionUserRole(payload: HasuraActionPayload): string | null {
  return payload.session_variables
    ? payload.session_variables[XHasuraRole]
    : null;
}
