import {ParserInterface, ParseValueArgs} from "../common.js";

export function parseArray(value: any, args: ParseValueArgs, parser: ParserInterface) {
  const {
    arrayType,
    name,
    attrName,
    numberMin,
    options,
    numberMax,
    allowNull,
    multipleOptions,
    stringMinLength,
    numberMaxDecimals,
    numberMinDecimals,
    stringMaxLength,
    nestedOptions,
    usage,
    enumValues,
    //options,
    regex,
    arrayMaxLength,
    arrayMinLength
  } = args;
  let parsedList: any[] = [];
  if (!(value instanceof Array)) {
    return;
  }
  if (arrayMaxLength !== undefined && value.length > arrayMaxLength) {
    return;
  }
  if (arrayMinLength !== undefined && value.length < arrayMinLength) {
    return;
  }
  if (arrayType === undefined) {
    parsedList = parsedList.concat(value);
  } else {
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const parsed = parser.parse({
        [i.toString()]: v
      }, {
        [i.toString()]: {
          type: arrayType,
          regex,
          forceArray: false,
          numberMin,
          numberMax,
          usage,
          options,
          numberMaxDecimals,
          numberMinDecimals,
          allowNull,
          multipleOptions,
          stringMinLength,
          stringMaxLength,
          nestedOptions,
          enumValues,
          arrayMaxLength,
          arrayMinLength,
        }
      }, "no_extra", `${name}.${attrName}`);

      if (parsed[i] === undefined) {
        return;
      } else {
        parsedList.push(parsed[i]);
      }
    }
  }
  return parsedList;
}
