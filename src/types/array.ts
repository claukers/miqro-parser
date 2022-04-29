import {ParserInterface, ParseValueArgs} from "../common.js";

export function parseArray(value: any, args: ParseValueArgs, parser: ParserInterface) {
  let parsedList: any[] = [];
  if (!(value instanceof Array)) {
    return;
  }
  if (args.arrayMaxLength !== undefined && value.length > args.arrayMaxLength) {
    return;
  }
  if (args.arrayMinLength !== undefined && value.length < args.arrayMinLength) {
    return;
  }
  if (args.arrayType === undefined) {
    parsedList = parsedList.concat(value);
  } else {
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const parsed = parser.parse({
        [i.toString()]: v
      }, {
        [i.toString()]: {
          ...args,
          parseJSON: false,
          forceArray: false,
          type: args.arrayType,
        }
      }, "no_extra", `${args.name}.${args.attrName}`);

      if (parsed[i] === undefined) {
        return;
      } else {
        parsedList.push(parsed[i]);
      }
    }
  }
  return parsedList;
}
