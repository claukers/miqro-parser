import {ParseValueArgs} from "../common";

export function parseFunction(args: ParseValueArgs) {
  return typeof args.value === "function" ? args.value : undefined;
}
