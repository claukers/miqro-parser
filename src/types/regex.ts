import {ParseOptionsError} from "../error";
import {ParseValueArgs} from "../common";

export function parseRegex(args: ParseValueArgs) {
  if (args.regex === undefined || typeof args.regex !== "string") {
    throw new ParseOptionsError(`unsupported type ${args.type} without regex as string`);
  }
  const regExp = new RegExp(args.regex);
  return regExp.test(args.value) ? args.value : undefined;
}
