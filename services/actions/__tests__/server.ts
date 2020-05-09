import "./common";
import { newServer } from "../src/server-test";

describe("Server test", () => {
  it("Initialize server Successfully", async () => {
    const app = await newServer();
    expect(app).toBeTruthy();
  });

});
