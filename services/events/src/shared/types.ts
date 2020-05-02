/* eslint-disable functional/no-this-expression */
/* eslint-disable camelcase */
import { Request } from "express";

export const AuthorizationHeader = "authorization";
export const XHasuraAdminSecret = "x-hasura-admin-secret";
export const XHasuraRole = "x-hasura-role";
export const XHasuraUserID = "x-hasura-user-id";
export const ContentType = "Content-type";
export const ContentTypeJson = "application/json";

export const HASURA_ROLE_ADMIN = "admin";
export const HASURA_ROLE_USER = "user";
export const HASURA_ROLE_ANONYMOUS = "anonymous";
export const HASURA_ROLES = [
  HASURA_ROLE_ADMIN,
  HASURA_ROLE_USER,
  HASURA_ROLE_ANONYMOUS
];

export const GQL_ROLE_ADMIN = HASURA_ROLE_ADMIN.toUpperCase();
export const GQL_ROLE_USER = HASURA_ROLE_USER.toUpperCase();
export const GQL_ROLE_ANONYMOUS = HASURA_ROLE_ANONYMOUS.toUpperCase();

export const STATUS_INACTIVE = "inactive";
export const STATUS_ACTIVE = "active";
export const STATUS_DISABLED = "disabled";
export const STATUS_DELETED = "deleted";

export const STATUSES = [
  STATUS_ACTIVE,
  STATUS_INACTIVE,
  STATUS_DISABLED,
  STATUS_DELETED
];

export type Status
  = typeof STATUS_ACTIVE
  | typeof STATUS_INACTIVE
  | typeof STATUS_DISABLED
  | typeof STATUS_DELETED;

export type HasuraRole
  = typeof HASURA_ROLE_ADMIN
  | typeof HASURA_ROLE_USER
  | typeof HASURA_ROLE_ANONYMOUS;

export type GQLRole
  = typeof GQL_ROLE_ADMIN
  | typeof GQL_ROLE_USER
  | typeof GQL_ROLE_ANONYMOUS;

export type GraphQLContext = {
  readonly request: Request
};

// event trigger payload
// https://hasura.io/docs/1.0/graphql/manual/event-triggers/payload.html
export type StringObject = { readonly [key: string]: string };
export type AnyObject = { readonly [key: string]: any };
export type BaseSessionVariables = {
  readonly [XHasuraRole]: HasuraRole
};

export type AuthSessionVariables = BaseSessionVariables & {
  readonly [XHasuraUserID]: string
};

export type SessionVariables<T = BaseSessionVariables> = T | null;

export const INSERT = "INSERT";
export const UPDATE = "UPDATE";
export const DELETE = "DELETE";
export const MANUAL = "MANUAL";

export type HasuraEventTriggerOpName
  = typeof INSERT
  | typeof UPDATE
  | typeof DELETE
  | typeof MANUAL;

export type IHasuraEventTriggerEvent<
  OP extends HasuraEventTriggerOpName,
  O = AnyObject,
  N = AnyObject,
  S = SessionVariables> = {
    readonly session_variables: S
    readonly op: OP
    readonly data: {
      readonly old: O
      readonly new: N
    }
  };

export type HasuraEventTriggerEvent = IHasuraEventTriggerEvent<HasuraEventTriggerOpName>;

export type HasuraEventTriggerInsert<N = AnyObject> =
  IHasuraEventTriggerEvent<typeof INSERT, null, N>;

export type HasuraEventTriggerUpdate<N = AnyObject> =
  IHasuraEventTriggerEvent<typeof UPDATE, N, N>;

export type HasuraEventTriggerDelete<N = AnyObject> =
  IHasuraEventTriggerEvent<typeof DELETE, N, null>;

export type HasuraEventTriggerManual<N = AnyObject> =
  IHasuraEventTriggerEvent<typeof MANUAL, N, null>;

export type HasuraEventTriggerInfo<N = string> = {
  readonly name: N
};

export type HasuraEventTriggerTable = {
  readonly schema: string
  readonly name: string
};

export type HasuraEventTriggerPayload<
  E extends IHasuraEventTriggerEvent<HasuraEventTriggerOpName>,
  N = string> = {
    readonly event: E
    readonly created_at: string
    readonly id: string
    readonly trigger: HasuraEventTriggerInfo<N>
    readonly table: HasuraEventTriggerTable
  };

// action handler interface
// https://hasura.io/docs/1.0/graphql/manual/actions/action-handlers.html#action-handlers
export type HasuraActionPayload<A = string, T = AnyObject, S = SessionVariables> = {
  readonly action: {
    readonly name: A
  }
  readonly session_variables: S
  readonly input: T
};

export type HasuraActionErrorResponse = {
  readonly message: string
  readonly code?: string
};

// eslint-disable-next-line functional/no-class
export class HasuraActionError extends Error implements HasuraActionErrorResponse {

  public readonly code?: string;
  public readonly message: string;
  public readonly details?: any;

  constructor(
    { message, code, details }: HasuraActionErrorResponse & { readonly details?: any }) {
    super(message);
    this.message = message;
    this.code = code;
    this.details = details;
  }

}

export const HASURA_ACTION_SUCCESS_STATUS = 200;
export const HASURA_ACTION_ERROR_STATUS = 400;

export const HASURA_EVENT_TRIGGER_SUCCESS_STATUS = 200;
export const HASURA_EVENT_TRIGGER_ERROR_STATUS = 400;

export type RequestHeaders = {
  readonly [key: string]: string
};
