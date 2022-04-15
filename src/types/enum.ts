import {ParseOptionsError} from "../error";
import {ParserInterface, ParseValueArgs} from "../common";
import {parseArray} from "./array";

export function parseEnum(value: any, args: ParseValueArgs, parser: ParserInterface) {
  const enumValues = parseArray(args.enumValues, {
    name: `${args.name}.${args.attrName}`,
    attrName: `enumList`,
    forceArray: false,
    type: "array",
    arrayType: "string"
  }, parser);
  if (enumValues === undefined) {
    throw new ParseOptionsError(`options.enumValues not a string array`);
  }
  if (enumValues.indexOf(value) === -1) {
    return;
  }
  return value;
}


