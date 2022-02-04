import {ParserInterface, ParseValueArgs} from "../common";

export function parseDict(args: ParseValueArgs, parser: ParserInterface) {
  const isObject = typeof args.value === "object";
  if (!isObject) {
    return;
  }
  if (args.dictType !== undefined) {
    const keys = Object.keys(args.value);
    const parsed: any = {};
    for (const key of keys) {
      parsed[key] = parser.parse(args.name, {
        [args.attrName]: {
          [key]: args.value[key]
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
      }, "no_extra")[args.attrName][key];
    }
    return parsed;
  } else {
    return args.value;
  }
}
