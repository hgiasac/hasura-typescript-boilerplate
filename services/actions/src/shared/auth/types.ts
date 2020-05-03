/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
