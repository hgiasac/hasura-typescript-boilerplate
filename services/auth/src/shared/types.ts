import { Request } from "express";

export const AuthorizationHeader = "Authorization";
export const AuthBearer = "Bearer";
export const XHasuraAdminSecret = "X-Hasura-Admin-Secret";
export const XHasuraRole = "X-Hasura-Role";
export const XHasuraUserID = "X-Hasura-User-Id";
export const ContentType = "Content-type";
export const ContentTypeJson = "application/json";

export const STATUS_INACTIVE = "inactive";
export const STATUS_ACTIVE = "active";
export const STATUS_DISABLED = "disabled";
export const STATUS_DELETED = "deleted";

export const HASURA_ROLE_ADMIN = "admin";
export const HASURA_ROLE_USER = "user";
export const HASURA_ROLE_ANONYMOUS = "anonymous";

export type Status
  = typeof STATUS_ACTIVE
  | typeof STATUS_INACTIVE
  | typeof STATUS_DISABLED
  | typeof STATUS_DELETED;

export type HasuraRole
  = typeof HASURA_ROLE_ADMIN
  | typeof HASURA_ROLE_USER
  | typeof HASURA_ROLE_ANONYMOUS;

export interface IGraphQLContext {
  request: Request;
}
