import {ParseOptionMap, ParseOptions, ParserInterface, ParseValueArgs} from "../common";

const PARSE_OPTION_BASE: ParseOptionMap = {
  type: "string",
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
  required: "boolean?",
  defaultValue: "any?"
};

export const parseSessionHandlerOptions = {
  options: {
    tokenLocation: {
      type: "enum",
      enumValues: ["header", "query", "cookie"]
    },
    tokenLocationName: "string|function",
    setCookieOptions: {
      type: "nested?",
      nestedOptions: {
        options: {
          httpOnly: "boolean",
          secure: "boolean",
          path: "string|function",
          sameSite: {
            type: "enum",
            enumValues: ["lax", "strict", "none"]
          }
        },
        mode: "no_extra"
      }
    }
  },
  mode: "no_extra"
} as ParseOptions;

export const parseGroupPolicy = {
  options: {
    group: "string[]",
    groupPolicy: {
      type: "enum",
      enumValues: ["at_least_one", "all"]
    }
  },
  mode: "no_extra"
} as ParseOptions;

export const parseParserInterface = {
  options: {
    parse: "function"
  },
  mode: "add_extra"
} as ParseOptions;

export function parseOptionMap(args: ParseValueArgs, parser: ParserInterface) {
  return parser.parse(args.name, {
    [args.attrName]: args.value
  }, {
    [args.attrName]: {
      type: "dict",
      dictType: "ParseOptionsBase|string"
    }
  })[args.attrName];
}

export const parseOptionsBase = {
  options: PARSE_OPTION_BASE,
  mode: "no_extra"
} as ParseOptions;

export const parseOption = {
  options: {
    ...PARSE_OPTION_BASE,
    name: "string"
  },
  mode: "no_extra"
} as ParseOptions;

export function parseOptionsMode(args: ParseValueArgs, parser: ParserInterface) {
  return parser.parse(args.name, {
    [args.attrName]: args.value
  }, {
    [args.attrName]: {
      type: "enum",
      enumValues: ["remove_extra", "add_extra", "no_extra"]
    }
  })[args.attrName];
}

export const parseOptions = {
  options: {
    description: "string?",
    options: "ParseOptionMap|ParseOption[]",
    mode: "ParseOptionsMode?"
  },
  mode: "no_extra"
} as ParseOptions;
