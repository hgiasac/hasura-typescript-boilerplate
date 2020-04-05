import { IHasuraActionPayload, XHasuraRole, XHasuraUserID } from "../shared/types";

export function getActionUserID(payload: IHasuraActionPayload): string | null {
  return payload.session_variables
    ? payload.session_variables[XHasuraUserID]
    : null;
}

export function getActionUserRole(payload: IHasuraActionPayload): string | null {
  return payload.session_variables
    ? payload.session_variables[XHasuraRole]
    : null;
}
