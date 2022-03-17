import {ParseValueArgs} from "../common";
import {parseString} from "./string";

const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function parseEmail(args: ParseValueArgs) {
  const str = parseString(args);

  if (!regex.test(String(args.value).toLowerCase())) {
    return;
  }
  return args.value;
}
