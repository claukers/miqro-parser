export interface ParseOptions {
  description?: string;
  options: ParseOption[] | ParseOptionMap;
  mode?: ParseOptionsMode;
}

interface Dict<T> {
  [key: string]: T;
}

export type ParseOptionsMode = "remove_extra" | "add_extra" | "no_extra";
export type ParseOptionTypeWithOutOptions = "string" | "boolean" | "number" | "object" | "any" | "array" | string;
export type ParseOptionType = "regex" | "nested" | "enum" | "multiple" | ParseOptionTypeWithOutOptions;

export type ParseOptionMap = Dict<ParseOptionsBase | ParseOptionTypeWithOutOptions>;

export const PARSE_OPTION_BASE: ParseOptionMap = {
  type: {
    type: "string",
    stringMinLength: 1
  },
  dictType: {
    type: "string?",
    stringMinLength: 1
  },
  options: "any?",
  regex: "string?",
  multipleOptions: "ParseOptionsBase[]!?",
  forceArray: "boolean?",
  allowNull: "boolean?",
  arrayType: "string?",
  arrayMinLength: "number?",
  arrayMaxLength: "number?",
  numberMaxDecimals: "number?",
  numberMinDecimals: "number?",
  numberMin: "number?",
  numberMax: "number?",
  stringMaxLength: "number?",
  stringMinLength: "number?",
  nestedOptions: {
    type: "nested?",
    nestedOptions: {
      options: {
        options: "ParseOption[]!|ParseOptionMap",
        mode: "ParseOptionsMode?"
      },
      mode: "no_extra"
    }
  },
  enumValues: "string[]?",
  parseJSON: "boolean?",
  description: "string?",
  usage: "string?",
  required: "boolean?",
  defaultValue: "any?"
};

export interface ParseOptionsBase {
  type: ParseOptionType;
  options?: any; // for custom options
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
  usage?: string;
  required?: boolean;
  defaultValue?: any;
}

export interface ParseOption extends ParseOptionsBase {
  name: string;
}

export interface ParseValueArgs extends ParseOptionsBase {
  name: string;
  attrName: string;
}

export type ParseValueValidatorResponse<T = any> = T | undefined;

export type ParseValueValidator = (value: any, args: ParseValueArgs, parser: ParserInterface) => ParseValueValidatorResponse;

export interface ParserInterface {
  parse(
    arg: any,
    options: ParseOption[] | ParseOptionMap | string,
    mode?: ParseOptionsMode,
    name?: string): any
}

export class ParseOptionsError extends Error {
  constructor(message = "BAD REQUEST", public argAttr?: string) {
    super(message);
    this.name = "ParseOptionsError";
  }
}
