// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const PARSE_OPTION_BASE = {
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
class ParseOptionsError extends Error {
    constructor(message = "BAD REQUEST", argAttr){
        super(message);
        this.argAttr = argAttr;
        this.name = "ParseOptionsError";
    }
}
export { PARSE_OPTION_BASE as PARSE_OPTION_BASE };
export { ParseOptionsError as ParseOptionsError };
const parseAny = (value)=>value;
function parseArray(value, args, parser) {
    let parsedList = [];
    if (!(value instanceof Array)) {
        return;
    }
    if (args.arrayMaxLength !== undefined && value.length > args.arrayMaxLength) {
        return;
    }
    if (args.arrayMinLength !== undefined && value.length < args.arrayMinLength) {
        return;
    }
    if (args.arrayType === undefined) {
        parsedList = parsedList.concat(value);
    } else {
        for(let i = 0; i < value.length; i++){
            const v = value[i];
            const parsed = parser.parse({
                [i.toString()]: v
            }, {
                [i.toString()]: {
                    ...args,
                    parseJSON: false,
                    forceArray: false,
                    type: args.arrayType
                }
            }, "no_extra", `${args.name}.${args.attrName}`);
            if (parsed[i] === undefined) {
                return;
            } else {
                parsedList.push(parsed[i]);
            }
        }
    }
    return parsedList;
}
function parseBoolean(value, args) {
    return value === "true" || value === true ? true : value === "false" || value === false ? false : undefined;
}
function parseRegex(value, args) {
    if (args.regex === undefined || typeof args.regex !== "string") {
        throw new ParseOptionsError(`unsupported type ${args.type} without regex as string`);
    }
    const regExp = new RegExp(args.regex);
    if (typeof value !== "string") {
        return;
    }
    if (args.stringMinLength !== undefined && value.length < args.stringMinLength) {
        return;
    }
    if (args.stringMaxLength !== undefined && value.length > args.stringMaxLength) {
        return;
    }
    if (value === undefined) {
        return undefined;
    } else {
        return regExp.test(value) ? value : undefined;
    }
}
function parseString(value, args) {
    if (typeof value !== "string") {
        return;
    }
    if (args.regex !== undefined) {
        return parseRegex(value, args);
    } else {
        if (args.stringMinLength !== undefined && value.length < args.stringMinLength) {
            return;
        }
        if (args.stringMaxLength !== undefined && value.length > args.stringMaxLength) {
            return;
        }
        return value;
    }
}
const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function parseEmail(value, args) {
    parseString(value, args);
    if (!regex.test(String(value).toLowerCase())) {
        return;
    }
    return value;
}
function parseEnum(value, args, parser) {
    const enumValues = parseArray(args.enumValues, {
        name: `${args.name}.${args.attrName}`,
        attrName: `enumList`,
        forceArray: false,
        type: "array",
        arrayType: "string"
    }, parser);
    if (enumValues === undefined) {
        throw new ParseOptionsError(`options.enumValues not a string array`);
    }
    if (enumValues.indexOf(value) === -1) {
        return;
    }
    return value;
}
function parseMultiple(value, args, parser) {
    if (!args.multipleOptions) {
        throw new ParseOptionsError(`unsupported type ${args.type} without multipleOptions`);
    }
    for(let i = 0; i < args.multipleOptions.length; i++){
        try {
            const aiType = parser.parse({
                [args.attrName]: value
            }, {
                [args.attrName]: args.multipleOptions[i]
            }, "no_extra", args.name)[args.attrName];
            if (aiType !== undefined) {
                return aiType;
            }
        } catch (e) {}
    }
    return undefined;
}
function parseNested(value, args, parser) {
    if (!args.nestedOptions) {
        throw new ParseOptionsError(`unsupported type ${args.type} without nestedOptions`);
    }
    return parser.parse(value, args.nestedOptions.options, args.nestedOptions.mode, `${args.name}.${args.attrName}`);
}
function parseNumber(value, args) {
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
    if (args.numberMaxDecimals !== undefined || args.numberMinDecimals !== undefined) {
        const decimalString = String(parsedValue).split(".")[1];
        const decimalLength = decimalString !== undefined ? decimalString.length : 0;
        if (args.numberMinDecimals !== undefined && decimalLength < args.numberMinDecimals) {
            return;
        }
        if (args.numberMaxDecimals !== undefined && decimalLength > args.numberMaxDecimals) {
            return;
        }
    }
    return parsedValue;
}
function parseFunction(value, args) {
    return typeof value === "function" ? value : undefined;
}
function parseObject(value, args) {
    return typeof value === 'object' ? value : undefined;
}
function parseDict(value, args, parser) {
    const isObject = typeof value === "object";
    if (!isObject) {
        return;
    }
    if (args.dictType !== undefined) {
        const keys = Object.keys(value);
        const parsed = {};
        for (const key of keys){
            parsed[key] = parser.parse(value[key], args.dictType, "no_extra", key);
        }
        return parsed;
    } else {
        return value;
    }
}
const newURL = (input, base)=>{
    return new URL(input, base);
};
const NativeURL = URL;
function parseURL(value, args) {
    const isURL = value instanceof NativeURL;
    if (!isURL && typeof value !== "string") {
        return;
    }
    const parsedValue = isURL ? value.toString() : value;
    if (args.stringMinLength !== undefined && parsedValue.length < args.stringMinLength) {
        return;
    }
    if (args.stringMaxLength !== undefined && parsedValue.length > args.stringMaxLength) {
        return;
    }
    const str = parseString(value, args);
    if (str === undefined) {
        return undefined;
    } else {
        try {
            return isURL ? value : newURL(str);
        } catch (e) {
            return undefined;
        }
    }
}
function decodeHTML(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}
function encodeHTML(str) {
    const buf = [];
    for(let i = str.length - 1; i >= 0; i--){
        buf.unshift([
            '&#',
            str[i].charCodeAt(0),
            ';'
        ].join(''));
    }
    return buf.join('');
}
function parseEncodeHTML(value, args) {
    const str = parseString(value, args);
    if (str === undefined) {
        return undefined;
    } else {
        return encodeHTML(str);
    }
}
function parseDecodeHTML(value, args) {
    const str = parseString(value, args);
    if (str === undefined) {
        return undefined;
    } else {
        return decodeHTML(str);
    }
}
const RESERVED = [
    "|",
    "!",
    "?"
];
class Parser {
    constructor(){
        this.parsers = new Map();
        this.registerParser("any", parseAny);
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
        this.registerEnum("ParseOptionsMode", [
            "remove_extra",
            "add_extra",
            "no_extra"
        ]);
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
            groups: {
                type: "array",
                arrayType: "string|string[]"
            },
            groupPolicy: {
                type: "enum",
                enumValues: [
                    "at_least_one",
                    "all"
                ]
            }
        });
        this.registerType("SessionHandlerOptions", {
            tokenLocation: {
                type: "enum",
                enumValues: [
                    "header",
                    "query",
                    "cookie"
                ]
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
                            enumValues: [
                                "lax",
                                "strict",
                                "none"
                            ]
                        }
                    },
                    mode: "no_extra"
                }
            }
        });
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
    registerDict(type, dictType, noList = false) {
        return this.registerParser(type, (value, args, parser)=>parseValue(value, {
                ...args,
                dictType,
                type: "dict"
            }, this.parsers, this), noList);
    }
    registerEnum(type, enumValues, noList = false) {
        return this.registerParser(type, (value, args, parser)=>parseValue(value, {
                ...args,
                enumValues,
                type: "enum"
            }, this.parsers, this), noList);
    }
    registerType(type, options, mode = "no_extra", noList = false) {
        return this.registerParser(type, (value, args, parser)=>parseValue(value, {
                ...args,
                nestedOptions: {
                    options,
                    mode
                },
                type: "nested"
            }, this.parsers, this), noList);
    }
    registerAlias(type, options, noList = false) {
        const baseOptions = this.parse(options, "ParseOptionsBase");
        if (options.type === type) {
            throw new Error("cannot register parser. type cannot be the same as options.type.");
        }
        if (typeof options.type !== "string") {
            throw new Error("cannot register parser. options.type must be a string.");
        }
        const parser = (value, args, parser)=>parseValue(value, {
                ...args,
                ...baseOptions
            }, this.parsers, this);
        return this.registerParser(type, parser, noList);
    }
    registerParser(type, parser, noList = false) {
        if (typeof type !== "string") {
            throw new Error("type must be a string");
        }
        if (typeof parser !== "function") {
            throw new Error("options must be a function");
        }
        for (const reserved of RESERVED){
            if (type.indexOf(reserved) !== -1) {
                throw new Error(`cannot use type name with ${RESERVED.join(",")} in the type name [${type}]`);
            }
        }
        if (this.parsers.has(type)) {
            throw new Error("already registered!");
        }
        this.parsers.set(type, parser);
        if (!noList) {
            this.parsers.set(`${type}[]`, (value, args, parser)=>parseValue(value, {
                    ...args,
                    type: "array",
                    arrayType: type
                }, this.parsers, this));
            this.parsers.set(`${type}[]!`, (value, args, parser)=>parseValue(value, {
                    ...args,
                    type: "array",
                    arrayType: type,
                    forceArray: true
                }, this.parsers, this));
        }
    }
    parse(arg, options, mode = "no_extra", name = "arg") {
        const ret = Object.create(null);
        const optionsAsStringFlag = typeof options === "string";
        const optionsAsStringAttr = name;
        if (arg === undefined || arg === null || typeof arg !== "object" && !optionsAsStringFlag) {
            throw new ParseOptionsError(`invalid ${name}`, name);
        }
        if (optionsAsStringFlag && mode !== "no_extra") {
            throw new ParseOptionsError("cannot use options as string and send mode");
        }
        if (optionsAsStringFlag) {
            name = "";
            options = [
                {
                    name: optionsAsStringAttr,
                    type: options
                }
            ];
            const oldArg = arg;
            arg = Object.create(null);
            arg[optionsAsStringAttr] = oldArg;
        } else if (!(options instanceof Array)) {
            options = parseOptionMap2ParseOptionList(options);
        }
        for (const baseOption of options){
            if (baseOption.name === "__proto__" || baseOption.name === "__prototype__") {
                throw new ParseOptionsError(`invalid name ${baseOption.name}`, name);
            }
            if (typeof baseOption.type !== "string") {
                throw new ParseOptionsError(`invalid type ${baseOption.type}`, name);
            }
            const argValue = arg[baseOption.name];
            if (argValue === undefined && baseOption.defaultValue !== undefined) {
                ret[baseOption.name] = baseOption.defaultValue;
                continue;
            }
            const typeSplit = baseOption.type.split("|").map((s)=>s.trim()).filter((s)=>s);
            for(let i = 0; i < typeSplit.length; i++){
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
                        ...option,
                        attrName: option.name,
                        name
                    }, this.parsers, this);
                    if (value === undefined && typeSplit.length - 1 === i) {
                        throw new ParseOptionsError(option.usage ? String(option.usage) : `${name ? `${name}.` : ""}${option.name} not ${option.type}` + `${option.type === "number" && option.numberMin !== undefined ? `${option.numberMin}:` : ""}${option.type === "number" && option.numberMax !== undefined ? `:${option.numberMax}` : ""}${option.numberMinDecimals !== undefined ? ` min decimals[${option.numberMinDecimals}]` : ""}${option.numberMaxDecimals !== undefined ? ` max decimals[${option.numberMaxDecimals}]` : ""}` + `${option.type === "string" && option.stringMinLength !== undefined ? `${option.stringMinLength}:` : ""}${option.type === "string" && option.stringMaxLength !== undefined ? `:${option.stringMaxLength}` : ""}` + `${option.type === "array" && option.arrayMinLength !== undefined ? `${option.arrayMinLength}:` : ""}${option.type === "array" && option.arrayMaxLength !== undefined ? `:${option.arrayMaxLength}` : ""}` + `${option.type === "array" && option.arrayType ? option.arrayType !== "enum" ? ` of ${option.arrayType}` : ` of ${option.arrayType} as defined. valid values [${option.enumValues}]` : ""}` + `${option.type === "nested" ? ` as defined!` : ""}` + `${option.type === "enum" ? ` as defined. valid values [${option.enumValues}]` : ""}` + `${option.type === "multiple" ? ` as defined.` : ""}`, `${name ? `${name}.` : ""}${option.name}`);
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
        switch(mode){
            case "no_extra":
                const argKeys = Object.keys(arg);
                for (const argKey of argKeys){
                    if (ret[argKey] === undefined && arg[argKey] !== undefined) {
                        throw new ParseOptionsError(`${name}.${argKey} option not valid [${argKey}]`, `${name}.${argKey}`);
                    }
                }
                return {
                    ...ret
                };
            case "add_extra":
                return {
                    ...arg,
                    ...ret
                };
            case "remove_extra":
                return {
                    ...ret
                };
            default:
                throw new ParseOptionsError(`unsupported mode ${mode}`);
        }
    }
}
const defaultParser = new Parser();
const parse = (arg, options, mode = "no_extra", name = "arg")=>defaultParser.parse(arg, options, mode, name);
function parseValue(value, args, parsers, p) {
    const { type , forceArray , parseJSON , defaultValue , required , name , attrName , allowNull  } = args;
    const parser = parsers.get(type);
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
            value = [
                value
            ];
        }
    }
    return parser(value, args, p);
}
function parseOptionMap2ParseOptionList(map) {
    if (typeof map !== "object") {
        throw new Error("options not object");
    }
    return Object.keys(map).map((name)=>{
        const val = map[name];
        return typeof val !== "object" ? {
            name,
            required: true,
            type: val
        } : {
            ...val,
            name
        };
    });
}
export { Parser as Parser };
export { parse as parse };
const get = (obj, attrPath, defaultValue, option, parser)=>{
    if (typeof option === "string") {
        option = {
            type: option
        };
    }
    if (defaultValue && option && option.defaultValue) {
        throw new Error(`cannot send defaultValue and options.defaultValue`);
    }
    defaultValue = defaultValue !== undefined ? defaultValue : option ? option.defaultValue : undefined;
    if (!obj || typeof obj !== "object") {
        return defaultValue !== undefined ? defaultValue : undefined;
    }
    if (typeof attrPath !== "string" && !(attrPath instanceof Array)) {
        throw new Error(`attrPath must be typeof string or string[]`);
    }
    const path = (attrPath instanceof Array ? attrPath : attrPath.split(".")).reverse();
    if (path.filter((p)=>p === "__prototype__" || p === "__proto__").length > 0) {
        throw new Error(`invalid attrPath`);
    }
    let value = obj;
    while(path.length > 0){
        const p = path.pop();
        if (!value.hasOwnProperty(p)) {
            return defaultValue !== undefined ? defaultValue : undefined;
        }
        value = value[p];
    }
    if (!option) {
        return value;
    }
    return (parser ? parser : {
        parse
    }).parse({
        value
    }, {
        value: option
    }, "no_extra", attrPath instanceof Array ? attrPath.join(".") : attrPath).value;
};
export { get as get };
function set(obj, attrPath, value) {
    if (!obj || typeof obj !== "object") {
        throw new Error(`obj must be and object`);
    }
    if (typeof attrPath !== "string" && !(attrPath instanceof Array)) {
        throw new Error(`attrPath must be typeof string or string[]`);
    }
    const path = (attrPath instanceof Array ? attrPath : attrPath.split(".")).reverse();
    if (path.filter((p)=>p === "__prototype__" || p === "__proto__").length > 0) {
        throw new Error(`invalid attrPath`);
    }
    let objRef = obj;
    while(path.length > 0){
        const p = path.pop();
        if (path.length === 0) {
            objRef[p] = value;
        } else {
            if (!objRef.hasOwnProperty(p)) {
                objRef[p] = {};
            }
            objRef = objRef[p];
        }
    }
    return obj;
}
export { set as set };
