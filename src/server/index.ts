import type * as express from "express";
import { static as expressStatic } from "express";
import type { wsRouter } from "./wsRouter.js";
import add404 from "./middleware/404.js";
import addWs from "./middleware/websockets.js";
import apiv1 from "./middleware/api/v1/index.js";
import { addStreaming } from "./streaming.js";

export default async function configure(
  app: express.Express,
  ws: wsRouter
): Promise<void> {
  addStreaming(app, ws);
  app.use(expressStatic("./assets/public"));
  addWs(app, ws);
  apiv1(app, ws);
  add404(app, ws);
}
