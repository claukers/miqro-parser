export function set<S>(obj: S, attrPath: string | string[], value: any): S {
  if (!obj || typeof obj !== "object") {
    throw new Error(`obj must be and object`);
  }
  if (typeof attrPath !== "string" && !(attrPath instanceof Array)) {
    throw new Error(`attrPath must be typeof string or string[]`);
  }
  const path = ((attrPath instanceof Array) ? attrPath : attrPath.split(".")).reverse();
  if (path.filter(p => p === "__prototype__" || p === "__proto__").length > 0) {
    throw new Error(`invalid attrPath`);
  }
  let objRef: any = obj;
  while (path.length > 0) {
    const p = path.pop() as string;
    if (path.length === 0) {
      objRef[p] = value; // do set
    } else {
      if (!objRef.hasOwnProperty(p)) {
        objRef[p] = {};
      }
      objRef = objRef[p];
    }
  }
  return obj;
}
