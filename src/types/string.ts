import {ParseValueArgs} from "../common";
import {parseRegex} from "./regex";

export function parseString(args: ParseValueArgs) {
  if (typeof args.value !== "string") {
    return;
  }

  if (args.regex !== undefined) {
    return parseRegex(args)
  } else {
    if (args.stringMinLength !== undefined && args.value.length < args.stringMinLength) {
      return;
    }
    if (args.stringMaxLength !== undefined && args.value.length > args.stringMaxLength) {
      return;
    }
    return args.value;
  }
}


