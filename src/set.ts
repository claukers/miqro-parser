export function set<S>(obj: S, attrPath: string, value: any): S {
  if (!obj || typeof obj !== "object") {
    throw new Error(`obj must be and object`);
  }
  if (typeof attrPath !== "string") {
    throw new Error(`attrPath must be typeof string`);
  }
  const path = attrPath.split(".").reverse();
  if (path.filter(p => p === "__prototype" || p === "__proto__").length > 0) {
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
