import * as lockfile from "proper-lockfile";
import { dbDir } from "../../../../config.js";
import { resolve } from "path";
import bcrypt from "bcryptjs";
const { hashSync, compareSync } = bcrypt;
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { randomBytes, hash } from "crypto";
let held = false;
export function init() {
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
  if (!held) {
    // Lock ENTIRE database
    if (lockfile.checkSync(dbDir)) {
      throw new Error("Database is locked");
    }
    lockfile.lockSync(dbDir);
    held = true;
  }
  return new basicDatabase(dbDir);
}
// Server media is media that should ONLY be able to be modifyed by the server (server private should only be VISABLE to the server)
type userDataType = {
  createdAt: number;
  media: { public: any; private: any; serverPrivate: any };
};
type databaseType = {
  users: { [key in string]: { passwordHash: string; data: userDataType } };
  tokens: {
    [key in string]: {
      username: string;
      expires: number;
    };
  };
};
const defaultDatabase: databaseType = {
  users: {},
  tokens: {},
};
class basicDatabase {
  databaseDir: string;
  bcyptRounds: number;
  databaseFilePath: string;
  tokenLength: number;
  _saveInterval: NodeJS.Timeout;
  _database: databaseType;
  constructor(
    databaseDir: string,
    databaseSaveInterval: number = 10,
    bcyptRounds: number = 12,
    // 10 days
    tokenLength: number = 1000 * 60 * 60 * 24 * 10
  ) {
    this.databaseDir = databaseDir;
    this.bcyptRounds = bcyptRounds;
    this.databaseFilePath = resolve(this.databaseDir, "db.json");
    if (!existsSync(this.databaseFilePath)) {
      writeFileSync(this.databaseFilePath, JSON.stringify(defaultDatabase));
    }
    this._database = JSON.parse(
      readFileSync(this.databaseFilePath).toString()
    ) as databaseType;
    this._saveInterval = setInterval(() => {
      writeFileSync(this.databaseFilePath, JSON.stringify(this._database));
    }, databaseSaveInterval);
    this.tokenLength = tokenLength;
  }
  _hash(value: string): string {
    return hashSync(value, this.bcyptRounds);
  }
  addUser(username: string, password: string): boolean {
    if (username in this._database.users) {
      return false;
    }
    const passwordHash = this._hash(password);
    const data: userDataType = {
      createdAt: Date.now(),
      media: { public: {}, private: {}, serverPrivate: {} },
    };
    this._database.users[username] = { passwordHash, data };
    return true;
  }
  deleteUser(username: string): void {
    delete this._database.users[username];
  }
  changePassword(username: string, newPassword: string): void {
    this._database.users[username].passwordHash = this._hash(newPassword);
  }
  /**
   * Validate a user
   * @param username The username
   * @param password The password
   * @returns If the user is valid or not. 0=yes 1=user does not exsist 2=invalid password
   */
  validateUser(username: string, password?: string): 0 | 1 | 2 {
    if (username in this._database.users) {
      if (
        typeof password === "undefined" ||
        compareSync(password, this._database.users[username].passwordHash)
      ) {
        return 0;
      } else {
        return 2;
      }
    } else {
      return 1;
    }
  }
  _hashToken(token: Buffer | string): string {
    // @ts-ignore
    return hash("sha512", Buffer.from(token, "base64url"), "base64url");
  }
  createToken(
    username: string,
    password: string,
    expires: number = Date.now() + this.tokenLength
  ) {
    const userVailidity = this.validateUser(username, password);
    if (userVailidity === 0) {
      let token: Buffer;
      let tokenHash: string;
      do {
        token = randomBytes(64);
        tokenHash = this._hashToken(token);
      } while (tokenHash in this._database.tokens);
      this._database.tokens[tokenHash] = {
        username,
        expires,
      };
      return token.toString("base64url");
    } else {
      return userVailidity;
    }
  }
  deleteToken(tokenHash: string): boolean {
    return delete this._database.tokens[tokenHash];
  }
  /**
   * Validate a token
   * @param tokenHash
   * @returns 0 for valid. 1 for not exsisting. 2 for expired. 3 for account deleted.
   */
  validateToken(tokenHash: string): 0 | 1 | 2 | 3;
  /**
   * Validate a token
   * @param tokenHash
   * @returns 0 for valid. 1 for not exsisting. 2 for expired. 3 for account deleted.
   */
  validateToken(tokenHash: string): 0 | 1 | 2 | 3;
  validateToken(tokenHash: string): 0 | 1 | 2 | 3 {
    if (tokenHash in this._database.tokens) {
      const token = this._database.tokens[tokenHash];
      // 0 means that the token never expires
      if (token.expires === 0 || token.expires > Date.now()) {
        if (token.username in this._database.users) {
          return 0;
        } else {
          delete this._database.tokens[tokenHash];
          return 3;
        }
      } else {
        delete this._database.tokens[tokenHash];
        return 2;
      }
    } else {
      return 1;
    }
  }
  cleanUpTokens(): void {
    for (const tokenName of Object.keys(this._database.tokens)) {
      const tokenVailidity = this.validateToken(tokenName);
      if (tokenVailidity !== 0) {
        delete this._database.tokens[tokenName];
      }
    }
  }
  getMedia(
    username: string,
    type: keyof userDataType["media"],
    path: string[] = []
  ): any {
    const media = this._database.users[username].data.media[type];
    let ref = media;
    for (const segment of path) {
      if (typeof ref === "undefined") {
        return undefined;
      }
      ref = ref[segment];
    }
    return ref;
  }
  setMedia(
    username: string,
    type: keyof userDataType["media"],
    newValue: any,
    path: string[] = []
  ) {
    const media = this._database.users[username].data.media;
    path.unshift(type);
    const lastSegment = path.pop() as string;
    let ref = media;
    for (const segment of path) {
      if (!(segment in ref)) {
        // @ts-ignore
        ref[segment] = {};
      }
      // @ts-ignore
      ref = ref[segment];
    }
    // @ts-ignore
    ref[lastSegment] = newValue;
  }
  /**
   * Destroy the class. Clears the save interval and deletes all propertys, also unlocks the database.
   */
  destroy() {
    console.log("---- DESTROYING DATABASE ----");
    writeFileSync(this.databaseFilePath, JSON.stringify(this._database));
    clearInterval(this._saveInterval);
    for (const attribute in Object.keys(
      Object.getOwnPropertyDescriptors(this)
    )) {
      // @ts-ignore
      delete this[attribute];
    }
    lockfile.unlockSync(dbDir);
    held = false;
  }
}
