import {ParseValueArgs} from "../common";

export function parseBoolean(args: ParseValueArgs) {
  return args.value === "true" || args.value === true ? true : (args.value === "false" || args.value === false ? false : undefined);
}


