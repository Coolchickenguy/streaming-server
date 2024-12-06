import type * as express from "express";
import { Router } from "express";
import type { wsRouter } from "../../../wsRouter.js";
import {
  checkTemplate,
  events,
  template,
  transformTemplateToType,
} from "../../../utils.js";
import { init } from "../common/dbv1.js";
import { addBrodcasting } from "./broadcasting.js";
import { rateLimit } from "express-rate-limit";
import { urlencoded, json } from "express";
import accountMedia from "./accountMedia.js";
import admin from "./admin.js";
import { dbDirectory, init as getConfig } from "../../../../config.js";
import { rmSync } from "fs";
import { resolve } from "path";
const { config } = getConfig();
const db = init();
events.once("exit", () => db.destroy());
export type postFunction = express.Express["post"] extends (
  arg0: string,
  arg1: infer v
) => any
  ? v
  : never;
export type getFunction = express.Express["get"] extends (
  arg0: string,
  arg1: infer v
) => any
  ? v
  : never;
export function error400(
  reasons: string[],
  req: Parameters<postFunction>[0],
  res: Parameters<postFunction>[1],
  data: any = {}
) {
  res.status(400).send({
    code: 400,
    reasons,
    ...data,
  });
}
export function error429(
  reasons: string[],
  req: Parameters<postFunction>[0],
  res: Parameters<postFunction>[1]
) {
  res.status(429).send({
    code: 429,
    reasons,
  });
}
export function ok200(
  reasons: string[],
  req: Parameters<postFunction>[0],
  res: Parameters<postFunction>[1],
  data: any = {}
) {
  res.status(200).send({
    code: 200,
    reasons,
    ...data,
  });
}
export class noopClass {}
export function wrapForNoop<func extends [(...args: any[]) => any]>(
  func: func[0]
): func[0] {
  // @ts-ignore
  return function (...args: Parameters<func[0]>): ReturnType<func[0]> {
    try {
      const returned = func(...args);
      if (returned instanceof Promise) {
        // @ts-ignore
        return returned.catch((error) => {
          if (!(error instanceof noopClass)) {
            throw error;
          }
        });
      } else {
        return returned;
      }
    } catch (e) {
      if (!(e instanceof noopClass)) {
        throw e;
      }
    }
  };
}
export function check<
  data extends template,
  value extends [transformTemplateToType<data>]
>(
  template: data,
  value: any,
  req: Parameters<postFunction>[0],
  res: Parameters<postFunction>[1]
): asserts value is value[0] {
  const possibleErrors = checkTemplate(template, value);
  if (possibleErrors.length !== 0) {
    error400(possibleErrors, req, res);
    throw new noopClass();
  }
}
export function tooManyRequests(
  req: Parameters<postFunction>[0],
  res: Parameters<postFunction>[1]
) {
  error429(["Too many requests"], req, res);
}
/*
Error 400 reason list:
-1: None of your beeswax
errorCause:user
  -1: See above (Bad practice to say if the password or username is inccorect)
errorCause:token
  1: Does not exsist
  2: Expired
  3: Account deleted.
errorCause:data
  1: Data too large
  2: Invalid data
  3: Referenced data does not exsist
*/
export default function apiv1(app: express.Express, ws: wsRouter): void {
  const apiRouter = Router();
  // Max of 200 kb
  apiRouter.use(json({ limit: 200000 }));
  apiRouter.use(urlencoded({ extended: false }));
  addBrodcasting(apiRouter, ws, db);
  accountMedia(apiRouter, ws, db);
  admin(apiRouter, ws, db);
  const accountActionsRateLimit = rateLimit({
    // Four requests per DAY
    windowMs: 24 * 60 * 60 * 1000,
    limit: 4,
    handler: tooManyRequests,
    validate: { xForwardedForHeader: !config.insecurePort },
  });
  const tokenActionsRateLimit = rateLimit({
    // One request per 5 secs
    windowMs: 12 * 5 * 1000,
    limit: 12 * 1,
    handler: tooManyRequests,
    validate: { xForwardedForHeader: !config.insecurePort },
  });
  apiRouter.post("/createAccount", accountActionsRateLimit);
  apiRouter.post(
    "/createAccount",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ username: "string", password: "string" }, body, req, res);
      if (!db.addUser(body.username, body.password)) {
        error400(["User already exsists"], req, res, {
          errorCause: "user",
          errorReason: -1,
        });
      } else {
        ok200(["Account created"], req, res);
      }
    })
  );
  apiRouter.post("/deleteAccount", accountActionsRateLimit);
  apiRouter.post(
    "/deleteAccount",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ username: "string", password: "string" }, body, req, res);
      if (db.validateUser(body.username, body.password) === 0) {
        db.deleteUser(body.username);
        rmSync(resolve(dbDirectory, "streams", body.username), {
          force: true,
          recursive: true,
        });
        ok200(["Account deleted"], req, res);
      } else {
        error400(["Invalid username or password"], req, res, {
          errorCause: "user",
          errorReason: -1,
        });
      }
    })
  );
  apiRouter.post("/changePassword", accountActionsRateLimit);
  apiRouter.post(
    "/changePassword",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check(
        { username: "string", password: "string", newPassword: "string" },
        body,
        req,
        res
      );
      if (db.validateUser(body.username, body.password) === 0) {
        db.changePassword(body.username, body.newPassword);
        ok200(["Password changed"], req, res);
      } else {
        error400(["Invalid username or password"], req, res, {
          errorCause: "user",
          errorReason: -1,
        });
      }
    })
  );
  apiRouter.post("/createToken", tokenActionsRateLimit);
  apiRouter.post(
    "/createToken",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ username: "string", password: "string" }, body, req, res);
      const token = db.createToken(body.username, body.password);
      if (typeof token === "string") {
        ok200(["Token created"], req, res, { token: token });
      } else {
        error400(["Invalid username or password"], req, res, {
          errorCause: "user",
          errorReason: -1,
        });
      }
    })
  );
  apiRouter.post("/deleteToken", tokenActionsRateLimit);
  apiRouter.post(
    "/deleteToken",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ token: "string" }, body, req, res);
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        db.deleteToken(tokenHash);
        ok200(["Deleted successfully"], req, res);
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.post(
    "/validateToken",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ token: "string" }, body, req, res);
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      ok200(["Token validated"], req, res, { tokenVailidity });
    })
  );
  apiRouter.post(
    "/media/public/get",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ username: "string", path: "string" }, body, req, res);
      const path = body.path.split(".");
      const isUserValid = db.validateUser(body.username) === 0;
      if (isUserValid) {
        ok200(["Found successfully"], req, res, {
          value: db.getMedia(body.username, "public", path),
        });
      } else {
        error400([`Invalid user`], req, res, {
          errorCause: "user",
          errorReason: -1,
        });
      }
    })
  );
  apiRouter.post(
    "/media/private/get",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ token: "string", path: "string" }, body, req, res);
      const path = body.path.split(".");
      const tokenVailidity = db.validateToken(db._hashToken(body.token));
      if (tokenVailidity === 0) {
        const value = db.getMedia(body.token, "private", path);
        ok200(["Found successfully"], req, res, { value });
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.post(
    "/validateUsername",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ username: "string" }, body, req, res);
      const isUserValid = db.validateUser(body.username) === 0;
      if (isUserValid) {
        ok200(["Valid username"], req, res, {
          value: true,
        });
      } else {
        ok200(["Invalid username"], req, res, {
          value: false,
        });
      }
    })
  );
  apiRouter.use(function (req, res) {
    error400(
      [
        `No api v1 endpoint matched request with path ${req.url} and method ${req.method}.`,
      ],
      req,
      res
    );
  });
  app.use("/api/rest/v1", apiRouter);
}
