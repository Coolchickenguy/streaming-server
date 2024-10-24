// Thanks to https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
export function isEmpty(obj: { [key in any]: any } | {}): boolean {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}
