import readline from "readline/promises";
import chalk from "chalk";
import { addSite, removeSite, getCerts, setup } from "./certTools.js";
import * as configTools from "./config.js";
import { giveServer } from "./http01auth.cjs";
import listen from "./https.js";
import EventEmitter from "events";
import { init } from "./server/middleware/api/common/dbv1.js";
// @ts-expect-error
import U from "@root/greenlock/utils.js";
const { _validMx } = U;
const config = configTools.getConfig();
const oldConfig = { ...configTools.getConfig() };
Object.freeze(oldConfig);
// Use stderr because a setup is NOT an output
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stderr
);
// Use nextTick to avoid
const log = (value: string) => readlineInterface.write(value + "\n");
log(`[${chalk.green("Server config")}]${chalk.redBright(":")}`);
async function safeAsk(
  question: string,
  key: string,
  validator: (value: string) => Promise<void> | void
): Promise<void> {
  const responce: string = await readlineInterface.question(question);
  if (responce !== "") {
    let invalid;
    try {
      invalid = validator(responce);
      if (invalid instanceof Promise) {
        invalid = await invalid;
      }
    } catch (e) {
      invalid = e;
    }
    if (invalid) {
      log(invalid.toString());
      return await new Promise((resolve) =>
        process.nextTick(() => resolve(safeAsk(question, key, validator)))
      );
    }
    config[key] = responce;
  } else if (!config[key]) {
    log(chalk.red("Please provide a value"));
    // Run on next tick to avoid stack overflow
    return await new Promise((resolve) =>
      process.nextTick(() => resolve(safeAsk(question, key, validator)))
    );
  }
}
await safeAsk(
  `${chalk.red(
    "Insecure port port (Leave blank to not disable all security and yada yada)"
  )}`,
  "insecurePort",
  () => {}
);
await safeAsk(
  `${chalk.red("Enter video storage size limit")}`,
  "maxVideoStorage",
  (value) =>
    // THAT IS NOT HOW THIS FUNCTION WORKS
    // @ts-ignore
    isNaN(value)
      ? (() => {
          throw new Error("Enter a number");
        })()
      : undefined
);
await safeAsk(
  `${chalk.red("Enter maintainer email")}${chalk.green.dim(
    " (Used by cert library)"
  )}`,
  "maintainerEmail",
  (value) =>
    new Promise((resolve, reject) =>
      _validMx(value)
        .catch(() => reject(new TypeError("Invalid email")))
        .then(() => resolve())
    )
);
// TODO: Add domain name checking
await safeAsk(chalk.red("Enter site name"), "subject", () => {});
await safeAsk(chalk.red("Do you want a letsencript cert?"), "doCert", (v) => {
  if (!["true", "false"].includes(v.toLocaleLowerCase())) {
    throw "Must be true || false";
  }
});
config.doCert = config.doCert == "true" || config.doCert == true;
readlineInterface.close();
configTools.setConfig(config);
if (config.doCert) {
  console.log("Seting up domain");
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
  if (oldConfig.subject) {
    removeSite(oldConfig.subject);
  }
  await addSite(config.subject);
}
const db = init();
db.addUser("admin", "admin");
db.setMedia("admin", "public", true, ["premissions", "abilities", "admin"]);
db.destroy();
console.log(
  "Database created. The admin username is admin and password is admin. Change this as soon as possible."
);
console.log("Done!");
