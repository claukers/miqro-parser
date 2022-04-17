import {ParseValueArgs} from "../common.js";

export function parseNumber(value: any, args: ParseValueArgs) {
  if (!(value === null ? false : !isNaN(value))) {
    return;
  }
  const parsedValue = parseFloat(value);
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


