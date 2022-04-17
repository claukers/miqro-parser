import {ParserInterface, ParseValueArgs, ParseOptionsError} from "../common.js";

export function parseMultiple(value: any, args: ParseValueArgs, parser: ParserInterface) {
  if (!args.multipleOptions) {
    throw new ParseOptionsError(`unsupported type ${args.type} without multipleOptions`);
  }
  for (let i = 0; i < args.multipleOptions.length; i++) {
    const basicOption = args.multipleOptions[i];
    try {
      const aiType = parser.parse({[args.attrName]: value}, {
        [args.attrName]: {
          ...basicOption,
          forceArray: args.forceArray
        },
      }, "no_extra", args.name)[args.attrName];
      if (aiType !== undefined) {
        return aiType;
      }
    } catch (e) {

    }
  }
  return undefined;
}
