import _exports from "@ffmpeg-installer/ffmpeg";
import { PassThrough, Readable, Writable } from "stream";
import EventEmitter from "events";
import { readdirSync, realpathSync, statSync } from "fs";
import { join } from "path";
// Thanks to https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
export function isEmpty(obj: { [key in any]: any } | {}): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}
type tt =
  | "any"
  | "string"
  | "number"
  | "boolean"
  | "undefined"
  | `@${string}`
  | number
  | boolean;
export type template =
  | tt
  | {
      [key in string]: tt | template;
    }
  | (tt | template)[];
export function getRecusive(
  object: any,
  keys: string[]
): [any, "object" | "array" | "", string?] {
  let ref = object;
  let undefinedKey: string | undefined = undefined;
  let lastType: "object" | "array" | "" = "";
  const lastKey = keys.pop();
  for (const key of keys) {
    if (!(key in ref)) {
      undefinedKey = key;
      break;
    }
    ref = ref[key];
  }
  if (lastKey) {
    if (!(lastKey in ref)) {
      undefinedKey = lastKey;
    } else {
      lastType =
        typeof object === "object"
          ? Array.isArray(object)
            ? "array"
            : "object"
          : "";
      ref = ref[lastKey];
    }
  }

  return [ref, lastType, undefinedKey];
}
export function all(
  object: any,
  callback: (
    value: any,
    keys: string[],
    parentType: "object" | "array" | ""
  ) => void,
  keys: string[] = [],
  parentType: "object" | "array" | "" = ""
): void {
  if (typeof object === "object") {
    const objectKeys = Object.keys(object);
    for (const key of objectKeys) {
      all(
        object[key],
        callback,
        [...keys, key],
        Array.isArray(object) ? "array" : "object"
      );
    }
  } else {
    callback(object, keys, parentType);
  }
}
export function checkTemplate(template: template, check: any): string[] {
  const errors: string[] = [];
  all(
    template,
    function callback(value: string | number, keysToGetHere, parentType) {
      const [valueToCheck, checkType, undefinedKey] = getRecusive(
        check,
        keysToGetHere
      );
      if (typeof undefinedKey !== "undefined") {
        errors.push(
          `Expected ${JSON.stringify(
            valueToCheck
          )} to contain key ${undefinedKey}. (In required key path ${JSON.stringify(
            keysToGetHere
          )})`
        );
        return;
      }
      if (parentType !== checkType) {
        errors.push(
          `Expected ${JSON.stringify(
            valueToCheck
          )}'s parent to be of type ${parentType} but got ${checkType}. (In key path ${JSON.stringify(
            keysToGetHere
          )})`
        );
      }
      if (value === "any") {
      } else if (typeof value === "number") {
        if (value !== valueToCheck) {
          errors.push(
            `Expected ${JSON.stringify(
              valueToCheck
            )} to be a number and be equal to ${JSON.stringify(
              value
            )}. (In key path ${JSON.stringify(keysToGetHere)})`
          );
        }
      } else if (typeof value === "boolean") {
        if (value !== valueToCheck) {
          errors.push(
            `Expected ${JSON.stringify(
              valueToCheck
            )} to be a boolean and be equal to ${JSON.stringify(
              value
            )}. (In key path ${JSON.stringify(keysToGetHere)})`
          );
        }
      } else if (value.startsWith("@")) {
        value = value.slice(1);
        if (value !== valueToCheck) {
          errors.push(
            `Expected ${JSON.stringify(
              valueToCheck
            )} to be a string and be equal to ${JSON.stringify(
              value
            )}. (In key path ${JSON.stringify(keysToGetHere)})`
          );
        }
      } else {
        if (value !== typeof valueToCheck) {
          errors.push(
            `Expected ${JSON.stringify(
              valueToCheck
            )} to be a ${value} and be equal to ${JSON.stringify(
              value
            )}. (In key path ${JSON.stringify(keysToGetHere)})`
          );
        }
      }
    }
  );
  // @ts-ignore
  return errors;
} // "string" | "number" | "boolean" | "undefined" | number
export type transformTemplateToType<T extends template> =
  T extends `@${infer str}`
    ? str
    : T extends number
    ? T
    : T extends "string"
    ? string
    : T extends "number"
    ? number
    : T extends "boolean"
    ? boolean
    : T extends "undefined"
    ? undefined | null
    : T extends any[]
    ? Omit<T, number> & {
        [key in Extract<keyof T, number>]: transformTemplateToType<T[key]>;
      }
    : {
        // @ts-ignore
        [key in keyof T]: transformTemplateToType<T[key]>;
      };

// Tee a stream like it never happened
export function teeStream(input: Readable, outputs: Readable[]) {
  // Copy all events
  function emitAll(event: string): [string, (...args: any[]) => void] {
    return [
      event,
      (...data: any[]) => {
        for (const output of outputs) {
          output.emit(event, ...data);
        }
      },
    ];
  }
  input.once(...emitAll("close"));
  input.once(...emitAll("end"));
  input.once(...emitAll("error"));
  input.on("pause", () => {
    for (const output of outputs) {
      if (!output.isPaused()) {
        output.pause();
      }
    }
  });
  input.on("resume", () => {
    for (const output of outputs) {
      if (output.isPaused()) {
        output.pause();
      }
    }
  });
  for (const output of outputs) {
    function onEnd() {
      outputs = outputs.filter((stream) => stream !== output);
    }
    output.once("close", onEnd);
    output.once("end", onEnd);
  }
  input.on("data", function (data) {
    for (const output of outputs) {
      output.push(data);
    }
  });
}
export function closestNumber(findClosest: number, inArray: number[]): number {
  return inArray.reduce((prev, test) => {
    return Math.abs(findClosest - prev) < Math.abs(findClosest - test)
      ? prev
      : test;
  });
}
export const events = new EventEmitter();
function onExit() {
  events.emit("exit");
  process.exit(0);
}
process.on("exit", onExit);
process.on("SIGINT", onExit);
process.on("SIGUSR1", onExit);
process.on("SIGUSR2", onExit);
process.on("uncaughtException", onExit);

type output = { [key in string]: output } | number;
export function dirSize(path: string): output {
  function recurse(path: string): output {
    const stat = statSync(path);
    if (stat.isDirectory()) {
      return Object.fromEntries(
        readdirSync(path).map((item) => [item, recurse(join(path, item))])
      );
    } else {
      return stat.size;
    }
  }
  return recurse(path);
}
