export interface ParseOptions {
  description?: string;
  options: ParseOption[] | ParseOptionMap;
  mode?: ParseOptionsMode;
}

export interface Dict<T> {
  [key: string]: T;
}

export type ParseOptionsMode = "remove_extra" | "add_extra" | "no_extra";
export type ParseOptionTypeWithOutOptions = "string" | "boolean" | "number" | "object" | "any" | "array" | string;
export type ParseOptionType = "regex" | "nested" | "enum" | "multiple" | ParseOptionTypeWithOutOptions;

export type ParseOptionMap = Dict<ParseOptionsBase | ParseOptionTypeWithOutOptions>;

export interface ParseOptionsBase {
  type: ParseOptionType;
  dictType?: ParseOptionType;
  regex?: string;
  multipleOptions?: ParseOptionsBase[];
  forceArray?: boolean;
  allowNull?: boolean;
  arrayType?: ParseOptionType;
  arrayMinLength?: number;
  arrayMaxLength?: number;
  numberMax?: number;
  numberMaxDecimals?: number;
  numberMinDecimals?: number;
  numberMin?: number;
  stringMaxLength?: number;
  stringMinLength?: number;
  nestedOptions?: {
    options: ParseOption[] | ParseOptionMap;
    mode?: ParseOptionsMode;
  };
  enumValues?: string[];
  parseJSON?: boolean;
  description?: string;
  required?: boolean;
  defaultValue?: any;
}

export interface ParseOption extends ParseOptionsBase {
  name: string;
}

export interface ParseValueArgs extends ParseOptionsBase {
  name: string;
  attrName: string;
  value: any;
}

export type ParseValueValidatorResponse<T = any> = T | undefined;

export type ParseValueValidator = (args: ParseValueArgs, parser: ParserInterface) => ParseValueValidatorResponse;

export interface ParserInterface {
  parse(
    arg: any,
    options: ParseOption[] | ParseOptionMap | string,
    mode?: ParseOptionsMode,
    name?: string): any
}
