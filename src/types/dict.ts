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
      parsed[key] = parser.parse({
        [args.attrName]: {
          [key]: value[key]
        }
      }, {
        [args.attrName]: {
          type: "nested",
          nestedOptions: {
            options: {
              [key]: args.dictType
            },
            mode: "no_extra"
          }
        }
      }, "no_extra", args.name)[args.attrName][key];
    }
    return parsed;
  } else {
    return value;
  }
}
