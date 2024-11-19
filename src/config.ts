import { resolve } from "path";
import { fileURLToPath } from "url";
import { existsSync, writeFileSync, readFileSync, mkdir, mkdirSync } from "fs";
export const root = resolve(resolve(fileURLToPath(import.meta.url), "../../"));
export let dbDirectory: string;
let initCalled = false;
let handle: {
  init: boolean;
  config: { [key in string]?: any };
};
export function init(dbDir?: string): {
  init: boolean;
  config: { [key in string]?: any };
} {
  if (!initCalled) {
    // @ts-ignore
    dbDirectory = dbDir;
    initCalled = true;
    // @ts-ignore
    const configPath = resolve(dbDir, "config.json");
    let config: { [key in string | number]: any } = {};
    const out = Object.defineProperties(
      {},
      {
        init: {
          value: false,
          enumerable: true,
          configurable: true,
          writable: true,
        },
        config: {
          set(newConfig) {
            writeFileSync(configPath, JSON.stringify(newConfig));
            config = newConfig;
          },
          get() {
            return config;
          },
          enumerable: true,
        },
      }
    ) as { init: boolean; config: { [key in string]?: any } };
    if (existsSync(configPath)) {
      out.config = JSON.parse(readFileSync(configPath).toString());
      out.init = true;
      handle = out;
    } else {
      mkdirSync(dbDir as string, { recursive: true });
      writeFileSync(configPath, "{}");
      out.init = false;
      handle = out;
    }
  }
  return handle;
}
