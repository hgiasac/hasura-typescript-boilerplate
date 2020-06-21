import * as functions from "firebase-functions";

export type Config = {
  readonly hasura: {
    readonly url: string
    readonly admin_secret: string
  }
};

export const defaultRegion = "us-central1";
export const getConfig = (): Config =>
  functions.config() as Config;

export const getRegions = (): readonly typeof functions.SUPPORTED_REGIONS[number][] => {
  const regions = process.env.GCP_REGION;

  return regions
    ? regions.split(",")
      .map((s) => s.trim() as typeof functions.SUPPORTED_REGIONS[number])
    : [defaultRegion];
};
