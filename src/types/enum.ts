import {ParseOptionsError} from "../error";
import {ParserInterface, ParseValueArgs} from "../common";
import {parseArray} from "./array";

export function parseEnum(args: ParseValueArgs, parser: ParserInterface) {
  const enumValues = parseArray({
    name: `${args.name}.${args.attrName}`,
    attrName: `enumList`,
    forceArray: false,
    type: "array",
    value: args.enumValues,
    arrayType: "string"
  }, parser);
  if (enumValues === undefined) {
    throw new ParseOptionsError(`options.enumValues not a string array`);
  }
  if (enumValues.indexOf(args.value) === -1) {
    return;
  }
  return args.value;
}


