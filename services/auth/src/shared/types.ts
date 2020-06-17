/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable functional/no-this-expression */
/* eslint-disable camelcase */
/* eslint-disable functional/no-class */
import { Request } from "express";

export const AuthorizationHeader = "authorization";
export const AuthBearer = "Bearer";
export const XHasuraAdminSecret = "x-hasura-admin-secret";
export const XHasuraRole = "x-hasura-role";
export const XHasuraFirebaseID = "x-hasura-firebase-id";
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

export type GraphQLContext = {
  readonly request: Request
};

export type HasuraActionErrorResponse = {
  readonly message: string
  readonly code?: string
};

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
export type RequestHeaders = {
  readonly [key: string]: string
};
