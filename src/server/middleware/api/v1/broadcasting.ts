import type * as express from "express";
import { static as static_ } from "express";
import type { init } from "../common/dbv1.js";
import { wsRouter, callbackFunction } from "../../../wsRouter.js";
import { noopClass, wrapForNoop } from "./index.js";
import { getConfig, root } from "../../../../config.js";
import { Readable } from "stream";
import { initHls } from "./initHls.js";
import { randomUUID } from "crypto";
import { resolve } from "path";
const config = getConfig();
if (!("subject" in config)) {
  throw new Error("Not configured for website");
}
type db = ReturnType<typeof init>;
/*
Server db structure: (per-user)
{
    // Last stream is active
    streams: {
        // As reported by Date.now
        startDate: number,
        viewers: number,
        activeViewers: number
        // Rest is stored in /assets/private/userMedia/streams/${username}/${index}
    }[]
}
*/
export function addBrodcasting(
  Router: express.Router,
  ws: wsRouter,
  database: db
) {
  ws.wss(
    // /api/websocket/v1/publishStream/token.format
    "/api/websocket/v1/publishStream/*",
    wrapForNoop(async function publish(req, socket) {
      const formatTokenSegment = req.url?.split("/").reverse()[0].split(".");
      if (formatTokenSegment?.length !== 2) {
        socket.close(
          1003,
          "Expected a url like /api/websocket/v1/publishStream/token.format"
        );
        throw new noopClass();
      }
      const [token, videoFormat] = formatTokenSegment;
      const videoStream = new Readable({ read() {} });
      socket.on("message", function onData(data) {
        videoStream.push(data, "utf8");
      });
      socket.once("close", () => videoStream.destroy());
      const output = await initHls(database, token, videoFormat, videoStream);
      if (output?.error === "token") {
        socket.close(1008, `Token error code ${output.code}`);
        return;
      } else if (output?.error === "ffprobe") {
        const traceUuid = randomUUID();
        console.error(
          `Ffprobe encountered error (trace ${traceUuid} \n${output.data}`
        );
        socket.close(1011, `Ffprobe encountered error (trace ${traceUuid})`);
      } else if (output?.error === "ffmpeg") {
        const traceUuid = randomUUID();
        console.error(
          `Ffmpeg encountered error (trace ${traceUuid}) ${output.ffmpegError} and message \n${output.ffmpegStderr}`
        );
        socket.close(1011, `Ffmpeg encountered error (trace ${traceUuid})`);
      }
    } as callbackFunction)
  );
  Router.post("/brodcast/active", function (req, res) {
    // Unlike most endpoints as it never can send a 400
    const { username } = req.body;
    if (database.validateUser(username) === 0) {
      const streams = database.getMedia(username, "public", ["streams"]);
      if (streams[streams.length - 1]?.active === true) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } else {
      res.status(200).send(false);
    }
  });
  Router.use(
    "/stream",
    static_(resolve(root, "assets", "private", "userMedia", "streams"), {
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
      },
    })
  );
  Router.use("/stream", (req, res) => {
    res.status(404).send("404");
  });
}
