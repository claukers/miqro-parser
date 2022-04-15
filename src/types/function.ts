import {ParseValueArgs} from "../common";

export function parseFunction(value: any, args: ParseValueArgs) {
  return typeof value === "function" ? value : undefined;
}
