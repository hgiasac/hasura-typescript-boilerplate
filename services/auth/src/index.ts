import { newServer } from "./server";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 9000;
const HOST = process.env.HOST || "0.0.0.0";
const ENV = process.env.NODE_ENV || "development";

void newServer()
  .then((app) => {
    app.listen(PORT, HOST, () => {
      console.log("Express server listening on %d, in %s mode", PORT, ENV);
    });
  });
