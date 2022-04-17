import {newURL, NativeURL} from "./helpers.js";
import {ParseValueArgs} from "../common.js";
import {parseString} from "./string.js";

export function parseURL(value: any, args: ParseValueArgs) {
  const isURL = value instanceof NativeURL;
  if (!isURL && typeof value !== "string") {
    return;
  }
  const parsedValue = isURL ? value.toString() : value;

  if (args.stringMinLength !== undefined && parsedValue.length < args.stringMinLength) {
    return;
  }
  if (args.stringMaxLength !== undefined && parsedValue.length > args.stringMaxLength) {
    return;
  }

  const str = parseString(value, args);
  if (str === undefined) {
    return undefined;
  } else {
    try {
      return isURL ? value : newURL(str);
    } catch (e) {
      return undefined;
    }
  }


}
