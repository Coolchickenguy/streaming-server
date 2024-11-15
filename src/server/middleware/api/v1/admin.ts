import type * as express from "express";
import { wsRouter } from "../../../wsRouter.js";
import { wrapForNoop, check, error400, ok200 } from "./index.js";
import { init } from "../common/dbv1.js";
type db = ReturnType<typeof init>;
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
}
