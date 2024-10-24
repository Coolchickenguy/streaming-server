import type * as express from "express";
import type { wsRouter } from "../wsRouter.js";

export default async function main(app:express.Express,ws:wsRouter):Promise<void>{
    ws.wss("/api/v1/websocket/echo",function(req,socket){
        socket.on("message",function(data,isBinary){
            socket.send(data,{binary:isBinary});
        });
    });
}

