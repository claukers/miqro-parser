import {ParseValueArgs} from "../common";

export function parseBoolean(value: any, args: ParseValueArgs) {
  return value === "true" || value === true ? true : (value === "false" || value === false ? false : undefined);
}


