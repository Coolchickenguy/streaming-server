import * as express from "express";
import type { wsRouter } from "./wsRouter.js";
import add404 from "./middleware/404.js";
import addWs from "./middleware/websockets.js";

export default async function configure(app:express.Express,ws:wsRouter):Promise<void>{
    app.use(express.static("./assets/public"));
    add404(app,ws);
    addWs(app,ws);
}