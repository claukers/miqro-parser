import {ParserInterface, ParseValueArgs} from "../common";

export function parseDict(value: any, args: ParseValueArgs, parser: ParserInterface) {
  const isObject = typeof value === "object";
  if (!isObject) {
    return;
  }
  if (args.dictType !== undefined) {
    const keys = Object.keys(value);
    const parsed: any = {};
    for (const key of keys) {
      parsed[key] = parser.parse(value[key], args.dictType, "no_extra", key);
    }
    return parsed;
  } else {
    return value;
  }
}
