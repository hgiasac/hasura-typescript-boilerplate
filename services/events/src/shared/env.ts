function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Env '${key}' does not exist`);
  }

  return value;
}

export const DATA_URL = `${getEnv("DATA_HOST")}/v1/graphql`;
export const HASURA_GRAPHQL_ADMIN_SECRET = getEnv("HASURA_GRAPHQL_ADMIN_SECRET");
export const SESSION_KEY = getEnv("SESSION_KEY");
export const SESSION_EXPIRY = getEnv("SESSION_EXPIRY");
export const PASSWORD_SALT = process.env.PASSWORD_SALT ? parseInt(process.env.PASSWORD_SALT, 10) : 10;

export const DEBUG = !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV === "development";
export const DATABASE_URL = process.env.DATABASE_URL;
export const LOG_LEVEL = DEBUG ? "debug" : (process.env.LOG_LEVEL || "info");
