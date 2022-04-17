import {ParseValueArgs} from "../common.js";

export function parseFunction(value: any, args: ParseValueArgs) {
  return typeof value === "function" ? value : undefined;
}
