export default {
  debug: !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV === "development",
  databaseURL: process.env.DATABASE_URL,
  dataHost: process.env.DATA_HOST,
};
