import {ParseValueArgs} from "../common.js";

export function parseObject(value: any, args: ParseValueArgs) {
  return typeof value === 'object' ? value : undefined;
}
