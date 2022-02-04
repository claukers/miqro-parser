import {parse, Parser} from "./parser";
import {ParseOptionsBase} from "./common";

/*
usage const name = get(obj, "user.info.name", defaultValue, {type: "string"}, parser);
*/
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const get = (obj: any, attrPath: string, defaultValue?: any, option?: ParseOptionsBase, parser?: Parser): any | undefined => {
  if (defaultValue && option && option.defaultValue) {
    throw new Error(`cannot send defaultValue and options.defaultValue`);
  }
  defaultValue = defaultValue ? defaultValue : (option ? option.defaultValue : undefined);
  if (!obj || typeof obj !== "object") {
    return defaultValue !== undefined ? defaultValue : undefined
  }
  if (typeof attrPath !== "string") {
    throw new Error(`attrPath must be typeof string`);
  }
  const path = attrPath.split(".").reverse();
  let value = obj;
  while (path.length > 0) {
    const p = path.pop() as string;
    if (value[p] === undefined) {
      return defaultValue !== undefined ? defaultValue : undefined;
    }
    value = value[p];
  }
  if (!option) {
    return value;
  }
  return (parser ? parser : {parse}).parse(attrPath, {value}, {value: option}, "no_extra").value;
}
