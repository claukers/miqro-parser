import {ParseValueArgs} from "../common";

export function parseObject(value: any, args: ParseValueArgs) {
  return typeof value === 'object' ? value : undefined;
}
