import {ParseOptionsError} from "../error";
import {ParseValueArgs} from "../common";

export function parseRegex(value: any, args: ParseValueArgs) {
  if (args.regex === undefined || typeof args.regex !== "string") {
    throw new ParseOptionsError(`unsupported type ${args.type} without regex as string`);
  }
  const regExp = new RegExp(args.regex);

  if (typeof value !== "string") {
    return;
  }
  if (args.stringMinLength !== undefined && value.length < args.stringMinLength) {
    return;
  }
  if (args.stringMaxLength !== undefined && value.length > args.stringMaxLength) {
    return;
  }
  if (value === undefined) {
    return undefined;
  } else {
    return regExp.test(value) ? value : undefined;
  }
}
