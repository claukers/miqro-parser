import {ParseValueArgs} from "../common";
import {parseString} from "./string";

const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function parseEmail(value: any, args: ParseValueArgs) {
  const str = parseString(value, args);

  if (!regex.test(String(value).toLowerCase())) {
    return;
  }
  return value;
}
