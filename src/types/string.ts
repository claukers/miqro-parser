import {ParseValueArgs} from "../common";

export function parseString(args: ParseValueArgs) {
  if (typeof args.value !== "string") {
    return;
  }
  if (args.stringMinLength !== undefined && args.value.length < args.stringMinLength) {
    return;
  }
  if (args.stringMaxLength !== undefined && args.value.length > args.stringMaxLength) {
    return;
  }
  return args.value;
}


