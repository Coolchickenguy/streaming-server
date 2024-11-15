import type * as express from "express";
import { wsRouter } from "../../../wsRouter.js";
import { wrapForNoop, check, noopClass, error400, ok200 } from "./index.js";
import { init } from "../common/dbv1.js";
import { resolve } from "path";
import { root } from "../../../../config.js";
type db = ReturnType<typeof init>;
export default function accountMedia(
  apiRouter: express.Router,
  ws: wsRouter,
  db: db
): void {
  apiRouter.post(
    "/account/setProfileImage",
    wrapForNoop(function (req, res) {
      const body = req.body;
      // Image is base64url
      check({ token: "string", image: "string" }, body, req, res);
      const tokenHash = db._hashToken(body.token);
      const tokenVailidity = db.validateToken(tokenHash);
      if (tokenVailidity === 0) {
        try {
          // Check if it is VALID base64url
          const size = Buffer.from(body.image, "base64url").length;
          const maxSize = 200 * 1000;
          if (size > maxSize) {
            error400(["Image too large (max 200 kb)"], req, res, {
              errorCause: "data",
              errorReason: 1,
              max: maxSize,
            });
            throw new noopClass();
          }
        } catch (e) {
          error400(["Invalid base64url"], req, res, {
            errorCause: "data",
            errorReason: 2,
          });
          throw new noopClass();
        }
        // Image is valid size (We are not checking if it is a VALID IMAGE because that is not our issue)
        db.setMedia(
          db._database.tokens[tokenHash].username,
          "public",
          body.image,
          ["profile", "image"]
        );
        ok200(["Profile image set"], req, res);
      } else {
        error400([`Token code ${tokenVailidity}`], req, res, {
          errorCause: "token",
          errorReason: tokenVailidity,
        });
      }
    })
  );
  apiRouter.get("/account/getProfileImage", function (req, res) {
    const body = req.query;
    function fail() {
      res.sendFile(resolve(root, "assets", "private", "nouser.png"));
    }
    function send(username: string) {
      const image = db.getMedia(username, "public", ["profile", "image"]);
      let imageBinary: Buffer;
      try {
        imageBinary = Buffer.from(image, "base64url");
      } catch (e) {
        fail();
        return;
      }
      res.status(200).setHeader("Content-Type", "image/png").send(imageBinary);
    }
    if (typeof body?.user === "string") {
      if (db.validateUser(body.user) === 0) {
        send(body.user);
      } else {
        fail();
      }
    } else {
      fail();
    }
  });
}
