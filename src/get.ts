import {parse, Parser} from "./parser.js";
import {ParseOptionsBase} from "./common.js";

/*
usage const name = get(obj, "user.info.name", defaultValue, {type: "string"}, parser);
*/
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const get = (obj: any, attrPath: string | string[], defaultValue?: any, option?: ParseOptionsBase | string, parser?: Parser): any | undefined => {
  if (typeof option === "string") {
    option = {
      type: option
    };
  }
  if (defaultValue && option && option.defaultValue) {
    throw new Error(`cannot send defaultValue and options.defaultValue`);
  }
  defaultValue = defaultValue !== undefined ? defaultValue : (option ? option.defaultValue : undefined);
  if (!obj || typeof obj !== "object") {
    return defaultValue !== undefined ? defaultValue : undefined
  }
  if (typeof attrPath !== "string" && !(attrPath instanceof Array)) {
    throw new Error(`attrPath must be typeof string or string[]`);
  }
  const path = (attrPath instanceof Array ? attrPath : attrPath.split(".")).reverse();
  if (path.filter(p => p === "__prototype__" || p === "__proto__").length > 0) {
    throw new Error(`invalid attrPath`);
  }
  let value = obj;
  while (path.length > 0) {
    const p = path.pop() as string;
    if (!value.hasOwnProperty(p)) {
      return defaultValue !== undefined ? defaultValue : undefined;
    }
    value = value[p];
  }
  if (!option) {
    return value;
  }
  return (parser ? parser : {parse}).parse({value}, {value: option}, "no_extra", (attrPath instanceof Array ? attrPath.join(".") : attrPath)).value;
}
