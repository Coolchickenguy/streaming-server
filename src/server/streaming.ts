import { wsRouter } from "./wsRouter.js";
import type * as express from "express";
import { resolve } from "path";
import { root } from "../config.js";
export function addStreaming(app: express.Express, ws: wsRouter) {
  app.get("/stream/*", function (req, res) {
    res.sendFile(resolve(root, "assets", "private", "stream.html"));
  });
}
