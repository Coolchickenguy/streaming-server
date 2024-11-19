import config from "./configInit.js";
import "./beQuietPunycode.js";
import express from "express";
import listen from "./https.js";
import { getCerts, setup, init } from "./certTools.js";
import { giveServer } from "./http01auth.cjs";
import configure from "./server/index.js";
import { wsRouter } from "./server/wsRouter.js";
import { createServer } from "http";
import http from "http";
init(config);
if (config.doCert) {
  await setup();
}
const app = express();
app.disable("x-powered-by");
const wsRouterInstance = new wsRouter();
configure(app, wsRouterInstance);
if (config.insecurePort) {
  http
    .createServer(app)
    .listen(config.insecurePort)
    .on(
      "upgrade",
      wsRouterInstance.upgradeHandler.bind(wsRouterInstance, "all")
    );
} else {
  let cert: ReturnType<typeof getCerts>;
  let servers: Awaited<ReturnType<typeof listen>>[];
  async function refreshCerts(): Promise<void> {
    cert = getCerts(config.subject);
    if (servers) {
      servers.forEach((value) => {
        value.refresh(cert);
      });
    } else {
      servers = [await listen(app, cert, 443), await listen(app, cert, 80)];
      const port80RedirectServer = createServer(function (req, res) {
        res.writeHead(302, {
          location: `https://${
            (req.headers.host?.replace(/:\d+$/gm, "") || "localhost") + req.url
          }`,
        });
        res.end();
      });
      servers[1].insecureServer = port80RedirectServer;
      servers[1].secureServer = port80RedirectServer;
      // Handle websockets
      servers[0].secureServer.on(
        "upgrade",
        wsRouterInstance.upgradeHandler.bind(wsRouterInstance, true)
      );
      servers[1].insecureServer.on(
        "upgrade",
        wsRouterInstance.upgradeHandler.bind(wsRouterInstance, false)
      );
      // Give port 80
      giveServer(servers[1]);
    }
  }
  await refreshCerts();
}
