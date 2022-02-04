import {ParseValueArgs, ParseValueValidator} from "../common";

export const parseAny: ParseValueValidator = (args: ParseValueArgs) => {
  return args.value;
}
