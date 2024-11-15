// Make "(node:38971) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead." be QUIET I INSTALLED PUNYCODE ITS OKAY
const oldWarning = process.emitWarning;
process.emitWarning = function (...args) {
  if (!(args[2] === "DEP0040")) {
    // @ts-ignore
    oldWarning(...args);
  }
} as typeof oldWarning;