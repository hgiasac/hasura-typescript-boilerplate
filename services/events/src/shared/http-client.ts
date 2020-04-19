import { UserInputError } from "apollo-server-core";
import Axios from "axios";
import { DATA_URL, HASURA_GRAPHQL_ADMIN_SECRET } from "./env";
import { ContentType, ContentTypeJson, XHasuraAdminSecret } from "./types";

export interface IMutationResponse<T> {
  affected_rows: number;
  returning: T;
}

// common gql error

export class GQLError extends Error {

  public path: string;
  public error: string;
  public code: string;

  constructor(err: {
    path: string,
    error: string,
    code: string,
    message: string,
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
  [XHasuraAdminSecret]: HASURA_GRAPHQL_ADMIN_SECRET,
});

export const adminClient = () => Axios.create({
  headers: adminHttpHeader(),
  timeout: 30,
});

const httpClient = () => Axios.create({
  timeout: 30,
  headers: {
    [ContentType]: ContentTypeJson,
  }
});

// GQL client
export interface IGQLRequestOptions {
  url?: string;
  query: string;
  variables: { [key: string]: any };
  isAdmin?: boolean;
  headers?: { [key: string]: string };
}

export const requestGQL = <T = any>(options: IGQLRequestOptions): Promise<T> => {
  const client = options.isAdmin ? adminClient() : httpClient();
  const url = options.url || DATA_URL;

  return client.post(url, {
    query: options.query,
    variables: options.variables,
    headers: options.headers
  }).then((resp) => {
    if (resp.status !== 200) {
      throw new UserInputError(resp.statusText, resp.data);
    }

    if (resp.data.errors) {
      throw new UserInputError(resp.data.errors[0].message, resp.data.errors[0].extensions);
    }

    return resp.data.data;
  });
};
