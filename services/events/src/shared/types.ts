import { Request } from "express";

export enum Role {
  Admin = "ADMIN",
  Anonymous = "ANONYMOUS",
}

export const AuthenticationHeader = "authentication";
export const XHasuraRole = "X-Hasura-Role";
export const XHasuraUserID = "X-Hasura-User-Id";

export interface IGraphQLContext {
  request: Request;
}
