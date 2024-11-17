import type * as express from "express";
import { wsRouter } from "../../../wsRouter.js";
import { wrapForNoop, check, error400, ok200 } from "./index.js";
import { init } from "../common/dbv1.js";
import { getConfig, root } from "../../../../config.js";
import { resolve } from "path";
import { rmSync, readdirSync, statSync } from "fs";
import { dirSize } from "../../../utils.js";
type db = ReturnType<typeof init>;
const config = getConfig();
export default function admin(
  apiRouter: express.Router,
  ws: wsRouter,
  db: db
): void {
  apiRouter.post(
    "/admin/severInfo",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ token: "string" }, body, req, res);
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        if (
          (
            db.getMedia(db._database.tokens[tokenHash].username, "public", [
              "premissions",
              "abilities",
            ]) ?? []
          )?.admin === true
        ) {
          ok200(["Got serverInfo"], req, res, {
            info: {
              accounts: Object.fromEntries(
                Object.keys(db._database.users).map((username) => [
                  username,
                  {
                    createdAt: db._database.users[username].data.createdAt,
                    premissions: db.getMedia(username, "public", [
                      "premissions",
                    ]),
                  },
                ])
              ),
            },
          });
        } else {
          error400(["Token code 4"], req, res, {
            errorCause: "token",
            errorReason: 4,
          });
        }
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.post(
    "/admin/deleteAccount",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check({ token: "string", user: "string" }, body, req, res);
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        if (
          (
            db.getMedia(db._database.tokens[tokenHash].username, "public", [
              "premissions",
              "abilities",
            ]) ?? []
          )?.admin === true
        ) {
          if (db.validateUser(body.user) === 0) {
            db.deleteUser(body.user);
            ok200(["Deleted account"], req, res);
          } else {
            error400(["Invalid username"], req, res, {
              errorCause: "user",
              errorReason: -1,
            });
          }
        } else {
          error400(["Token code 4"], req, res, {
            errorCause: "token",
            errorReason: 4,
          });
        }
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.post(
    "/admin/setPremissions",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check(
        {
          token: "string",
          user: "string",
          premissionsPath: "string",
          value: "string",
        },
        body,
        req,
        res
      );
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        if (
          (
            db.getMedia(db._database.tokens[tokenHash].username, "public", [
              "premissions",
              "abilities",
            ]) ?? []
          )?.admin === true
        ) {
          let value;
          try {
            value = JSON.parse(body.value);
          } catch (e) {
            error400(["Invalid json"], req, res, {
              errorCause: "data",
              errorReason: 2,
            });
            return;
          }
          const premissionsPath = body.premissionsPath.split(".");
          db.setMedia(body.user, "public", value, [
            "premissions",
            ...premissionsPath,
          ]);
          ok200(["Gave successfully"], req, res);
        } else {
          error400(["Token code 4"], req, res, {
            errorCause: "token",
            errorReason: 4,
          });
        }
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.post(
    "/admin/deleteProfileImage",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check(
        {
          token: "string",
          user: "string",
        },
        body,
        req,
        res
      );
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        if (
          (
            db.getMedia(db._database.tokens[tokenHash].username, "public", [
              "premissions",
              "abilities",
            ]) ?? []
          )?.admin === true
        ) {
          if (db.validateUser(body.user) === 0) {
            ok200(["Deleted picture"], req, res);
            db.setMedia(body.user, "public", null, ["profile", "image"]);
          } else {
            error400(["Invalid username"], req, res, {
              errorCause: "user",
              errorReason: -1,
            });
          }
        } else {
          error400(["Token code 4"], req, res, {
            errorCause: "token",
            errorReason: 4,
          });
        }
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.post(
    "/admin/deleteBrodcast",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check(
        {
          token: "string",
          user: "string",
          id: "number",
        },
        body,
        req,
        res
      );
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        if (
          (
            db.getMedia(db._database.tokens[tokenHash].username, "public", [
              "premissions",
              "abilities",
            ]) ?? []
          )?.admin === true
        ) {
          if (db.validateUser(body.user) === 0) {
            // Real code
            const id = (body.id - 1).toString();
            const brodcast = db.getMedia(body.user, "public", ["streams", id]);
            if (typeof brodcast === "undefined" || brodcast.deleted) {
              error400([`Data does not exsist`], req, res, {
                errorCause: "data",
                errorReason: 3,
              });
            } else {
              rmSync(
                resolve(
                  root,
                  "assets",
                  "private",
                  "userMedia",
                  "streams",
                  body.user,
                  body.id.toString()
                ),
                { recursive: true }
              );
              brodcast.deleted = true;
              db.setMedia(body.user, "public", brodcast, ["streams", id]);
              ok200(["Deleted successfully"], req, res);
            }
          } else {
            error400(["Invalid username"], req, res, {
              errorCause: "user",
              errorReason: -1,
            });
          }
        } else {
          error400(["Token code 4"], req, res, {
            errorCause: "token",
            errorReason: 4,
          });
        }
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.post(
    "/admin/storageSize",
    wrapForNoop(function (req, res) {
      const body = req.body;
      check(
        {
          token: "string",
        },
        body,
        req,
        res
      );
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        if (
          (
            db.getMedia(db._database.tokens[tokenHash].username, "public", [
              "premissions",
              "abilities",
            ]) ?? []
          )?.admin === true
        ) {
          ok200(["Size found"], req, res, {
            storageUse: dirSize(
              resolve(root, "assets", "private", "userMedia")
            ),
            maxStorage: isNaN(config.maxVideoStorage)
              ? 0
              : Number(config.maxVideoStorage as string),
          });
        } else {
          error400(["Token code 4"], req, res, {
            errorCause: "token",
            errorReason: 4,
          });
        }
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
}
