import {ParseValueArgs} from "../common.js";

export function parseBoolean(value: any, args: ParseValueArgs) {
  return value === "true" || value === true ? true : (value === "false" || value === false ? false : undefined);
}


