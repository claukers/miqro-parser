import {
  ParseOptionsError,
  PARSE_OPTION_BASE,
  ParseOption,
  ParseOptionMap,
  ParseOptions,
  ParseOptionsBase,
  ParseOptionsMode,
  ParserInterface,
  ParseValueArgs,
  ParseValueValidator,
  ParseValueValidatorResponse,
} from "./common.js";
import {
  parseAny,
  parseArray,
  parseBoolean,
  parseDecodeHTML,
  parseDict,
  parseEmail,
  parseEncodeHTML,
  parseEnum,
  parseFunction,
  parseMultiple,
  parseNested,
  parseNumber,
  parseObject,
  parseRegex,
  parseString,
  parseURL
} from "./types/index.js";

const RESERVED = ["|", "!", "?"];

/**
 * # Parser
 *
 * ```typescript
 *import { Parser } from "@miqro/parser";
 *const parser = new Parser();
 *
 *const parsedValue = parser.parse("body", req.body, {
 *  name: "string",
 *  optional: {
 *    type: "string",
 *    required: false
 *  },
 *  mandatory: {
 *    type: "boolean",
 *    required: true
 *  }
 *}, "no_extra");
 *
 * ```
 */
export class Parser implements ParserInterface {
  protected parsers: { [name: string]: ParseValueValidator };

  constructor() {
    this.parsers = {};
    this.registerParser("any", parseAny)
    this.registerParser("array", parseArray);
    this.registerParser("dict", parseDict);
    this.registerParser("boolean", parseBoolean);
    this.registerParser("enum", parseEnum);
    this.registerParser("multiple", parseMultiple);
    this.registerParser("nested", parseNested);
    this.registerParser("number", parseNumber);
    this.registerParser("object", parseObject);
    this.registerParser("string", parseString);
    this.registerParser("regex", parseRegex);
    this.registerParser("url", parseURL);
    this.registerParser("function", parseFunction);
    this.registerParser("email", parseEmail);
    this.registerParser("encodeHTML", parseEncodeHTML);
    this.registerParser("decodeHTML", parseDecodeHTML);
    this.registerEnum("ParseOptionsMode", ["remove_extra", "add_extra", "no_extra"]);
    this.registerType("ParseOption", {
      ...PARSE_OPTION_BASE,
      name: "string"
    });
    this.registerType("ParseOptionsBase", PARSE_OPTION_BASE);
    this.registerDict("ParseOptionMap", "ParseOptionsBase|string");
    this.registerType("ParseOptions", {
      description: "string?",
      options: "ParseOptionMap|ParseOption[]",
      mode: "ParseOptionsMode?"
    });
    this.registerType("ParserInterface", {
      parse: "function"
    }, "add_extra");
    this.registerType("GroupPolicy", {
      group: "string[]",
      groupPolicy: {
        type: "enum",
        enumValues: ["at_least_one", "all"]
      }
    });
    this.registerType("SessionHandlerOptions", {
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
    });
    // aliases need the ParseOptionsBase type registered to work
    this.registerAlias("integer", {
      type: "number",
      numberMinDecimals: 0,
      numberMaxDecimals: 0
    });
    this.registerAlias("string1", {
      type: "string",
      stringMinLength: 1
    });
  }

  public registerDict(type: string, dictType: string, noList = false): void {
    return this.registerParser(type, (value, args, parser) => parseValue(value, {
      ...args,
      dictType,
      type: "dict",
    }, this.parsers, this), noList);
  }

  public registerEnum(type: string, enumValues: string[], noList = false): void {
    return this.registerParser(type, (value, args, parser) => parseValue(value, {
      ...args,
      enumValues,
      type: "enum",
    }, this.parsers, this), noList);
  }

  public registerType(type: string, options: ParseOption[] | ParseOptionMap, mode: ParseOptionsMode = "no_extra", noList = false): void {
    return this.registerParser(type, (value, args, parser) => parseValue(value, {
      ...args,
      nestedOptions: {
        options,
        mode
      },
      type: "nested",
    }, this.parsers, this), noList);
  }

  public registerAlias(type: string, options: ParseOptionsBase, noList = false): void {
    const baseOptions = this.parse(options, "ParseOptionsBase") as ParseOptionsBase;
    if (options.type === type) {
      throw new Error("cannot register parser. type cannot be the same as options.type.");
    }
    if (typeof options.type !== "string") {
      throw new Error("cannot register parser. options.type must be a string.");
    }
    const parser = ((value, args: ParseValueArgs, parser: ParserInterface): ParseValueValidatorResponse => parseValue(value, {
      ...args,
      ...baseOptions
    }, this.parsers, this)) as ParseValueValidator;
    return this.registerParser(type, parser, noList);
  }

  public registerParser(type: string, parser: ParseValueValidator, noList = false): void {
    if (typeof type !== "string") {
      throw new Error("type must be a string");
    }

    if (typeof parser !== "function") {
      throw new Error("options must be a function");
    }
    for (const reserved of RESERVED) {
      if (type.indexOf(reserved) !== -1) {
        throw new Error(`cannot use type name with ${RESERVED.join(",")} in the type name`);
      }
    }
    if (this.parsers[type]) {
      throw new Error("already registered!");
    }
    this.parsers[type] = parser;

    if (!noList) {
      this.parsers[`${type}[]`] = (value, args, parser) => parseValue(value, {
        ...args,
        type: "array",
        arrayType: type
      }, this.parsers, this);
      this.parsers[`${type}[]!`] = (value, args, parser) => parseValue(value, {
        ...args,
        type: "array",
        arrayType: type,
        forceArray: true
      }, this.parsers, this);
    }
  }

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  public parse(
    arg: any,
    options: ParseOption[] | ParseOptionMap | string,
    mode: ParseOptionsMode = "no_extra",
    name: string = "arg"): any {
    const ret: { [name: string]: any } = {};
    const optionsAsStringFlag = typeof options === "string";
    const optionsAsStringAttr = name;
    if (arg === undefined || arg === null || (typeof arg !== "object" && !optionsAsStringFlag)) {
      throw new ParseOptionsError(`invalid ${name}`, name);
    }
    if (optionsAsStringFlag && mode !== "no_extra") {
      throw new ParseOptionsError("cannot use options as string and send mode");
    }

    if (optionsAsStringFlag) {
      name = "";

      options = [{name: optionsAsStringAttr, type: options as string}];

      arg = {
        [optionsAsStringAttr]: arg
      };
    } else if (!(options instanceof Array)) {
      options = parseOptionMap2ParseOptionList(options as ParseOptionMap);
    }

    for (const baseOption of options) {
      if (typeof baseOption.type !== "string") {
        throw new ParseOptionsError(`invalid type ${baseOption.type}`, name);
      }
      const argValue = arg[baseOption.name];
      if (argValue === undefined && baseOption.defaultValue !== undefined) {
        ret[baseOption.name] = baseOption.defaultValue;
        continue;
      }

      // type split type="string|number"
      const typeSplit = baseOption.type.split("|").map(s => s.trim()).filter(s => s);
      for (let i = 0; i < typeSplit.length; i++) {
        const option = {
          ...baseOption,
          type: typeSplit[i]
        };

        const isOptionalType = option.type.charAt(option.type.length - 1) === "?";
        if (isOptionalType) {
          option.required = false;
          option.type = option.type.substring(0, option.type.length - 1);
        }

        if (argValue === undefined && option.required === false && option.defaultValue === undefined) {
          continue;
        }
        try {

          const value = parseValue(argValue, {
            name,
            options: option.options,
            attrName: option.name,
            type: option.type,
            regex: option.regex,
            required: option.required,
            defaultValue: option.defaultValue,
            dictType: option.dictType,
            numberMaxDecimals: option.numberMaxDecimals,
            numberMinDecimals: option.numberMinDecimals,
            numberMin: option.numberMin,
            numberMax: option.numberMax,
            allowNull: option.allowNull,
            multipleOptions: option.multipleOptions,
            stringMinLength: option.stringMinLength,
            stringMaxLength: option.stringMaxLength,
            arrayType: option.arrayType,
            nestedOptions: option.nestedOptions,
            enumValues: option.enumValues,
            parseJSON: option.parseJSON,
            usage: option.usage,
            arrayMaxLength: option.arrayMaxLength,
            arrayMinLength: option.arrayMinLength,
            forceArray: option.forceArray
          }, this.parsers, this);
          if (value === undefined && typeSplit.length - 1 === i) {
            throw new ParseOptionsError(
              option.usage ? String(option.usage) : `${name ? `${name}.` : ""}${option.name} not ${option.type}` +
                `${option.type === "number" && option.numberMin !== undefined ? `${option.numberMin}:` : ""}${option.type === "number" && option.numberMax !== undefined ? `:${option.numberMax}` : ""}${option.numberMinDecimals !== undefined ? ` min decimals[${option.numberMinDecimals}]` : ""}${option.numberMaxDecimals !== undefined ? ` max decimals[${option.numberMaxDecimals}]` : ""}` +
                `${option.type === "string" && option.stringMinLength !== undefined ? `${option.stringMinLength}:` : ""}${option.type === "string" && option.stringMaxLength !== undefined ? `:${option.stringMaxLength}` : ""}` +
                `${option.type === "array" && option.arrayMinLength !== undefined ? `${option.arrayMinLength}:` : ""}${option.type === "array" && option.arrayMaxLength !== undefined ? `:${option.arrayMaxLength}` : ""}` +
                `${option.type === "array" && option.arrayType ? (option.arrayType !== "enum" ? ` of ${option.arrayType}` : ` of ${option.arrayType} as defined. valid values [${option.enumValues}]`) : ""}` +
                `${option.type === "nested" ? ` as defined!` : ""}` +
                `${option.type === "enum" ? ` as defined. valid values [${option.enumValues}]` : ""}` +
                `${option.type === "multiple" ? ` as defined.` : ""}`,
              `${name ? `${name}.` : ""}${option.name}`
            );
          } else if (value !== undefined) {
            ret[option.name] = value;
            break;
          }
        } catch (e) {
          if (typeSplit.length - 1 === i) {
            throw e;
          }
        }
      }
    }
    if (optionsAsStringFlag) {
      return ret[optionsAsStringAttr];
    }
    switch (mode) {
      case "no_extra":
        const argKeys = Object.keys(arg);
        for (const argKey of argKeys) {
          if (!ret.hasOwnProperty(argKey) && arg[argKey] !== undefined) {
            throw new ParseOptionsError(`${name}.${argKey} option not valid [${argKey}]`, `${name}.${argKey}`);
          }
        }
        return ret;
      case "add_extra":
        return {
          ...arg,
          ...ret
        };
      case "remove_extra":
        return ret;
      default:
        throw new ParseOptionsError(`unsupported mode ${mode}`);
    }
  }
}

const defaultParser = new Parser();

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
export const parse = (
  arg: any,
  options: ParseOption[] | ParseOptionMap | string,
  mode: ParseOptionsMode = "no_extra",
  name: string = "arg"
): any => defaultParser.parse(arg, options, mode, name);

function parseValue(value: any, args: ParseValueArgs, parsers: { [name: string]: ParseValueValidator }, p: ParserInterface): ParseValueValidatorResponse {
  const {
    type,
    forceArray,
    parseJSON,
    defaultValue,
    required,
    name,
    attrName,
    allowNull
  } = args;

  // check parsers
  const parser: ParseValueValidator = parsers[type];
  if (parser === undefined) {
    throw new ParseOptionsError(`unsupported type ${type}`);
  }
  if (value === undefined && (required === true || required === undefined)) {
    throw new ParseOptionsError(`${name}.${attrName} not defined`, `${name}.${attrName}`);
  } else if (value === undefined && defaultValue === undefined) {
    return undefined;
  } else if (value === undefined && defaultValue !== undefined) {
    return defaultValue;
  }

  // prepare args
  if (parseJSON) {
    if (typeof value !== "string") {
      throw new ParseOptionsError(`parseJSON not available to non string value`);
    }
    try {
      value = JSON.parse(value);
    } catch (e) {
      throw new ParseOptionsError(`value not json!`);
    }
  }

  if (allowNull && value === null) {
    return null;
  } else {
    if (forceArray && !(value instanceof Array)) {
      value = [value];
    }
  }
  // run parser
  return parser(value, args, p);
}

function parseOptionMap2ParseOptionList(map: ParseOptionMap): ParseOption[] {
  if (typeof map !== "object") {
    throw new Error("options not object")
  }
  return Object.keys(map).map(name => {
    const val = map[name];
    return typeof val !== "object" ? {
      name,
      required: true,
      type: val
    } : val.required === undefined ? {
      ...val,
      required: true,
      name
    } : {
      ...val,
      name
    };
  });
}
