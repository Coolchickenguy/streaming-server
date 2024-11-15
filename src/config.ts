import { resolve } from "path";
import { fileURLToPath } from "url";
import { existsSync, writeFileSync, readFileSync } from "fs";
export const root = resolve(resolve(fileURLToPath(import.meta.url), "../../"));
const configPath = resolve(root,"config.json");
let config: { [key in string]?: any };
if (!existsSync(configPath)) {
  config = {};
  writeFileSync(configPath, "{}");
} else {
  config = JSON.parse(readFileSync(configPath).toString());
}
export function getConfig(): { [key in string]?: any } {
  return config;
}
export function setConfig(newConfig: { [key in string]?: any }): void {
  config = newConfig;
  writeFileSync(configPath,JSON.stringify(config));
}
