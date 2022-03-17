import {ParseOptionsError} from "../error";
import {ParseValueArgs} from "../common";
import {parseString} from "./string";

export function parseRegex(args: ParseValueArgs) {
  if (args.regex === undefined || typeof args.regex !== "string") {
    throw new ParseOptionsError(`unsupported type ${args.type} without regex as string`);
  }
  const regExp = new RegExp(args.regex);

  if (typeof args.value !== "string") {
    return;
  }
  if (args.stringMinLength !== undefined && args.value.length < args.stringMinLength) {
    return;
  }
  if (args.stringMaxLength !== undefined && args.value.length > args.stringMaxLength) {
    return;
  }
  if (args.value === undefined) {
    return undefined;
  } else {
    return regExp.test(args.value) ? args.value : undefined;
  }
}
