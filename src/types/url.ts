import {newURL, NativeURL} from "../helpers";
import {ParseValueArgs} from "../common";

export function parseURL(args: ParseValueArgs) {
  const isURL = args.value instanceof NativeURL;
  if (!isURL && typeof args.value !== "string") {
    return;
  }
  const parsedValue = isURL ? args.value.toString() : args.value;

  if (args.stringMinLength !== undefined && parsedValue.length < args.stringMinLength) {
    return;
  }
  if (args.stringMaxLength !== undefined && parsedValue.length > args.stringMaxLength) {
    return;
  }
  try {
    return isURL ? args.value : newURL(args.value);
  } catch (e) {
    return undefined;
  }
}
