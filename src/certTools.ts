import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { resolve } from "path";
// @ts-expect-error
import greenlock from "@root/greenlock";
let config: { [key in string | number]: any };
export function init(configInst:typeof config){
  config = configInst;
}
const packageJsonPath = resolve(
  fileURLToPath(import.meta.url),
  "../../package.json"
);
let inst: any;
const root = resolve(fileURLToPath(import.meta.url), "../../");
export async function setup() {
  const { name, version }: { name: string; version: number } = JSON.parse(
    readFileSync(packageJsonPath).toString()
  );
  const { maintainerEmail } = config as { maintainerEmail: string };
  inst = greenlock.create({
    maintainerEmail,
    packageAgent: name + "/" + version,
    packageRoot: root,
  });
  await inst.manager.defaults({
    agreeToTerms: true,
    subscriberEmail: maintainerEmail,
    challenges: {
      "http-01": {
        module: fileURLToPath(import.meta.resolve("./http01auth.cjs")),
      },
    },
  });
}
// Wrapers arout greenlock's methods that mainly ADD TYPEINGS
export function addSite<
  const subject extends string,
  const altnames extends string[] = [subject]
>(
  subject: subject,
  altnames?: altnames
): Promise<{ subject: subject; altnames: altnames; renewAt: number }> {
  if (
    !Array.isArray(altnames) ||
    !(altnames.length > 0) ||
    altnames.findIndex((v) => typeof v !== "string") !== -1
  ) {
    altnames = [subject] as any;
  }
  const out = inst.add({ subject, altnames });
  return out;
}
export function removeSite(subject: string): Promise<void> {
  return inst.remove({ subject });
}
export function getCerts(subject: string): { key: Buffer; cert: Buffer } {
  const greenlockrcFile = resolve(root, ".greenlockrc");
  let certDir: string;
  if (existsSync(greenlockrcFile)) {
    certDir = resolve(root, "assets/defaultCerts");
  } else {
    const { configDir } = JSON.parse(readFileSync(greenlockrcFile).toString());
    certDir = resolve(configDir, "live", subject);
  }
  const certPaths = () => {
    return {
      cert: resolve(certDir, "fullchain.pem"),
      key: resolve(certDir, "privkey.pem"),
    };
  };
  const certValues = () =>
    Object.fromEntries(
      Object.entries(certPaths()).map(([key, value]): [string, Buffer] => [
        key,
        readFileSync(value),
      ])
    ) as { key: Buffer; cert: Buffer };
  return certValues();
}
