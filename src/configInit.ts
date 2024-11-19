import { init, root } from "./config.js";
import { readFileSync } from "fs";
import { resolve } from "path";
const config = init(readFileSync(resolve(root, "./loc.txt")).toString()).config;
export default config;
