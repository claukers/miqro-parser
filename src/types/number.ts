import {ParseValueArgs} from "../common";

export function parseNumber(args: ParseValueArgs) {
  if (!(args.value === null ? false : !isNaN(args.value))) {
    return;
  }
  const parsedValue = parseFloat(args.value);
  if (args.numberMin !== undefined && parsedValue < args.numberMin) {
    return;
  }
  if (args.numberMax !== undefined && parsedValue > args.numberMax) {
    return;
  }
  if ((args.numberMaxDecimals !== undefined || args.numberMinDecimals !== undefined)) {
    const decimalString = String(parsedValue).split(".")[1];
    const decimalLength: number = decimalString !== undefined ? decimalString.length : 0;
    if (args.numberMinDecimals !== undefined && decimalLength < args.numberMinDecimals) {
      return;
    }
    if (args.numberMaxDecimals !== undefined && decimalLength > args.numberMaxDecimals) {
      return
    }
  }
  return parsedValue;
}


