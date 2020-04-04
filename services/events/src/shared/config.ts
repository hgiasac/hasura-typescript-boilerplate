export default {
  debug: !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV === "development"
};
