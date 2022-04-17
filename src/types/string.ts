import {ParseValueArgs} from "../common.js";
import {parseRegex} from "./regex.js";

export function parseString(value: any, args: ParseValueArgs) {
  if (typeof value !== "string") {
    return;
  }

  if (args.regex !== undefined) {
    return parseRegex(value, args)
  } else {
    if (args.stringMinLength !== undefined && value.length < args.stringMinLength) {
      return;
    }
    if (args.stringMaxLength !== undefined && value.length > args.stringMaxLength) {
      return;
    }
    return value;
  }
}


