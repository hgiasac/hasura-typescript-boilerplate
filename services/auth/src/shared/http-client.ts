/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable functional/no-this-expression */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable functional/no-class */
import Axios from "axios";
import { DATA_URL, HASURA_GRAPHQL_ADMIN_SECRET } from "./env";
import { ContentType, ContentTypeJson, XHasuraAdminSecret, HasuraActionError } from "./types";

export type MutationResponse<T> = {
  readonly affected_rows: number
  readonly returning: T
};

export type HasuraGraphQLResponse<T> = {
  readonly data?: T
  readonly errors?: T
};

// common gql error

export class GQLError extends Error {

  public readonly path: string;
  public readonly error: string;
  public readonly code: string;

  constructor(err: {
    readonly path: string
    readonly error: string
    readonly code: string
    readonly message: string
  }) {
    super(err.error);
    this.name = "GQLError";
    this.path = err.path;
    this.error = err.error;
    this.code = err.code;
  }
}

// http client helpers
export const adminHttpHeader = () => ({
  [ContentType]: ContentTypeJson,
  [XHasuraAdminSecret]: HASURA_GRAPHQL_ADMIN_SECRET
});

export const adminClient = () => Axios.create({
  headers: adminHttpHeader(),
  timeout: 30
});

const httpClient = () => Axios.create({
  timeout: 30,
  headers: {
    [ContentType]: ContentTypeJson
  }
});

// GQL client
export type GQLRequestOptions = {
  readonly url?: string
  readonly query: string
  readonly variables: { readonly [key: string]: any }
  readonly isAdmin?: boolean
  readonly headers?: { readonly [key: string]: string }
};

export const requestGQL = <T extends Record<string, any> = Record<string, any>>(
  options: GQLRequestOptions
): Promise<T> => {
  const client = options.isAdmin ? adminClient() : httpClient();
  const url = options.url || DATA_URL;

  return client.post<HasuraGraphQLResponse<T>>(url, {
    query: options.query,
    variables: options.variables,
    headers: options.headers
  }).then((resp) => {
    if (resp.status !== 200) {
      throw new HasuraActionError({
        message: resp.statusText,
        details: resp.data
      });
    }

    if (resp.data.errors) {
      throw new HasuraActionError({
        code: resp.data.errors[0].code,
        message: resp.data.errors[0].message,
        details: resp.data.errors[0].extensions
      });
    }

    return resp.data.data;
  });
};
