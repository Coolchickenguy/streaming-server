import "./beQuietPunycode.js";
// @ts-ignore
import tester from "acme-challenge-test";
import { create, giveServer } from "./http01auth.cjs";
import { setup, getCerts, init } from "./certTools.js";
import listen from "./https.js";
import config from "./configInit.js";
init(config);
const record = ["http://miss.pelling.com", "https://bock.org"];
await setup();
const server = await listen(
  (req, res) => {
    res.writeHead(404);
    res.end("Page not found");
    // Don't provide a subject as by default, it uses a self-signed cert and it is only going to be used for http anyway
  },
  getCerts(""),
  80
);
server.unref();
giveServer(server);
tester
  .testRecord("http-01", record, create())
  .then(function () {
    record.forEach((record) => console.info("PASS " + record));
  })
  .catch(function (e: Error) {
    console.error(e.message);
    console.error(e.stack);
  });
