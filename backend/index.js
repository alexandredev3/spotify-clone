import server from "./server.js";
import { logger } from "./util.js";
import config from "./config.js";

const { port } = config;

server
  .listen(port)
  .on("listening", () => logger.info(`server is running at ${port}`));
