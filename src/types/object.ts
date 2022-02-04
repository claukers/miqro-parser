import {ParseValueArgs} from "../common";

export function parseObject(args: ParseValueArgs) {
  return typeof args.value === 'object' ? args.value : undefined;
}
