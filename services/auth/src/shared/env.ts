function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Env '${key}' does not exist`);
  }

  return value;
}

export const DATA_URL = `${getEnv("DATA_HOST")}/v1/graphql`;
export const HASURA_GRAPHQL_ADMIN_SECRET = getEnv("HASURA_GRAPHQL_ADMIN_SECRET");
