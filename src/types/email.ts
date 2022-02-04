import {ParseValueArgs} from "../common";

const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function parseEmail(args: ParseValueArgs) {
  if (typeof args.value !== "string") {
    return;
  }
  if (args.stringMinLength !== undefined && args.value.length < args.stringMinLength) {
    return;
  }
  if (args.stringMaxLength !== undefined && args.value.length > args.stringMaxLength) {
    return;
  }
  if (!regex.test(String(args.value).toLowerCase())) {
    return;
  }
  return args.value;
}
