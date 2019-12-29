import { Request } from "express";

export enum Role {
  Admin = "ADMIN",
  User = "USER",
  Anonymous = "ANONYMOUS",
}

export enum Status {
  Inactive = "inactive",
  Active = "active",
  Deleted = "deleted",
}

export const AuthenticationHeader = "authentication";
export const XHasuraAdminSecret = "X-Hasura-Admin-Secret";
export const XHasuraRole = "X-Hasura-Role";
export const XHasuraUserID = "X-Hasura-User-Id";
export const ContentType = "Content-type";
export const ContentTypeJson = "application/json";

export interface IGraphQLContext {
  request: Request;
}
