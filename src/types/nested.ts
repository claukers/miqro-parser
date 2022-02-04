import {ParseOptionsError} from "../error";
import {ParserInterface, ParseValueArgs} from "../common";

export function parseNested(args: ParseValueArgs, parser: ParserInterface) {
  if (!args.nestedOptions) {
    throw new ParseOptionsError(`unsupported type ${args.type} without nestedOptions`);
  }
  return parser.parse(`${args.name}.${args.attrName}`, args.value, args.nestedOptions.options, args.nestedOptions.mode);
}
