import type * as express from "express";
import {resolve} from "path";
import type { wsRouter } from "../wsRouter.js";

export default async function main(app:express.Express,ws:wsRouter):Promise<void>{
    const pathOf404Html = resolve("assets/private/404.html");
    app.use(function(req,res){
        res.status(404);
        if(req.accepts("html")){
            res.sendFile(pathOf404Html);
        }else if(req.accepts("json")){
            res.send(JSON.stringify({status:404,path:req.path,time:new Date().toString()}));
        }else{
            res.send("404");
        }
    });
}
