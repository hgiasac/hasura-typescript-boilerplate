import * as functions from "firebase-functions";

export type Config = {
  readonly secret: {
    readonly dataUrl: string
    readonly adminSecret: string
  }
  readonly runtime: {
    readonly regions: string
  }
};

export const defaultRegion = "us-central1";
export const getConfig = (): Config =>
  functions.config() as Config;

export const getRegions = (): readonly typeof functions.SUPPORTED_REGIONS[number][] => {
  const runtime = getConfig().runtime;

  return runtime && runtime.regions
    ? runtime.regions.split(",")
      .map((s) => s.trim() as typeof functions.SUPPORTED_REGIONS[number])
    : [defaultRegion];
};
