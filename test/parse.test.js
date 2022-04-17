const {strictEqual} = require("assert");
const {URL} = require("url");
const {Parser, parse} = require("../dist");

describe("parse functional tests", () => {
  it('parse no_extra test', async () => {

    try {

      parse({
        bla: 1,
        blaasd: "1"
      }, [
        {name: "bla", type: "number", defaultValue: 1},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.blaasd option not valid [blaasd]");
    }

  });

  it('parse no_extra test any with number', async () => {

    const {bla} = parse({
      bla: 123
    }, [
      {name: "bla", type: "any", required: true},
    ], "no_extra", true);
    strictEqual(bla, 123);

  });

  it('parse minDecimal', async () => {

    const ret = parse({
      bla: "1.2"
    }, [
      {name: "bla", type: "number", numberMinDecimals: 1},
    ], "no_extra");
    strictEqual(ret.bla, 1.2);
    try {
      parse({
        bla: "1"
      }, [
        {name: "bla", type: "number", numberMinDecimals: 1},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not number min decimals[1]");
    }
    try {
      parse({
        bla: "1.223"
      }, [
        {name: "bla", type: "number", numberMinDecimals: 4},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not number min decimals[4]");
    }
    const ret2 = parse({
      bla: "1231231.2234"
    }, [
      {name: "bla", type: "number", numberMinDecimals: 4},
    ], "no_extra");
    strictEqual(ret2.bla, 1231231.2234);

  });

  it('parse maxDecimal', async () => {

    const ret = parse({
      bla: "1.2"
    }, [
      {name: "bla", type: "number", numberMaxDecimals: 1},
    ], "no_extra");
    strictEqual(ret.bla, 1.2);
    try {
      parse({
        bla: "1.23"
      }, [
        {name: "bla", type: "number", numberMaxDecimals: 1},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not number max decimals[1]");
    }
    try {
      parse({
        bla: "1231.223"
      }, [
        {name: "bla", type: "number", numberMaxDecimals: 2},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not number max decimals[2]");
    }
    const ret2 = parse({
      bla: "1231231.2234"
    }, [
      {name: "bla", type: "number", numberMaxDecimals: 4},
    ], "no_extra");
    strictEqual(ret2.bla, 1231231.2234);

  });

  it('parse maxDecimal && minDecimal', async () => {

    const ret = parse({
      bla: "1.2"
    }, [
      {name: "bla", type: "number", numberMinDecimals: 1, numberMaxDecimals: 1},
    ], "no_extra");
    strictEqual(ret.bla, 1.2);
    try {
      parse({
        bla: "1.23"
      }, [
        {name: "bla", type: "number", numberMinDecimals: 0, numberMaxDecimals: 1},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not number min decimals[0] max decimals[1]");
    }
    try {
      parse({
        bla: "1231.223"
      }, [
        {name: "bla", type: "number", numberMaxDecimals: 1},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not number max decimals[1]");
    }
    const ret2 = parse({
      bla: "1231231.2234"
    }, [
      {name: "bla", type: "number", numberMinDecimals: 0, numberMaxDecimals: 4},
    ], "no_extra");
    strictEqual(ret2.bla, 1231231.2234);

    const ret3 = parse({
      bla: "1231231.2234"
    }, [
      {name: "bla", type: "number", numberMinDecimals: 4, numberMaxDecimals: 4},
    ], "no_extra");
    strictEqual(ret3.bla, 1231231.2234);

  });

  it('parse noDecimal', async () => {


    try {
      parse({
        bla: "1231.223"
      }, [
        {name: "bla", type: "number", numberMaxDecimals: 0},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not number max decimals[0]");
    }
    const ret = parse({
      bla: "1231"
    }, [
      {name: "bla", type: "number", numberMaxDecimals: 0},
    ], "no_extra");
    strictEqual(ret.bla, 1231);

  });

  it('parse mail happy path no dmoain 2', async () => {


    try {
      parse({
        bla: "as@d@asd"
      }, [
        {name: "bla", type: "email"}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not email");
    }


  });

  it('parse mail happy path no dmoain', async () => {


    try {
      parse({
        bla: "asd@asd"
      }, [
        {name: "bla", type: "email"}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not email");
    }

  });

  it('parse email happy path', async () => {


    const {bla} = parse({
      bla: "asd@asd.dds"
    }, [
      {name: "bla", type: "email"}
    ], "no_extra");
    strictEqual(typeof bla === "string", true);
  });

  it('parse email happy path sub dmoain', async () => {


    const {bla} = parse({
      bla: "asasd-sda.d@asd.d20ds.asd.asd"
    }, [
      {name: "bla", type: "email"}
    ], "no_extra");
    strictEqual(typeof bla === "string", true);

  });

  it('parse url happy path no protocol', async () => {


    try {
      parse({
        bla: "localhost/asd"
      }, [
        {name: "bla", type: "url"}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not url");
    }


  });

  it('parse url happy path', async () => {


    const {bla} = parse({
      bla: "http://localhost/asd"
    }, [
      {name: "bla", type: "url"}
    ], "no_extra");
    strictEqual(bla instanceof URL, true);

  });

  it('parse regex parser', async () => {


    const ret = parse({
      bla: "AA-BB-123"
    }, [
      {name: "bla", type: "regex", regex: "AA-BB-\\d"},
    ], "no_extra");

  });

  it('parse custom parser AA-BB-#', async () => {


    let parser = new Parser();
    parser.registerParser("AA-BB-#", (value) => {
      return /AA-BB-\d/.test(value) ? value : undefined;
    });
    const ret = parser.parse({
      bla: "AA-BB-123"
    }, [
      {name: "bla", type: "AA-BB-#"},
    ], "no_extra");

    try {
      parser.parse({
        bla: "BB-AA-123"
      }, [
        {name: "bla", type: "AA-BB-#"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      console.error(e);
      strictEqual((e).message, "arg.bla not AA-BB-#");
    }

    parser = new Parser();

    try {
      parser.parse({
        bla: "AA-BB-123"
      }, [
        {name: "bla", type: "AA-BB-#"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "unsupported type AA-BB-#");
    }


  });

  it('parse custom parser AA-BB-# on custom instance', async () => {


    let parser = new Parser();
    parser.registerParser("AA-BB-#", (value) => {
      return /AA-BB-\d/.test(value) ? value : undefined;
    });
    const ret = parser.parse({
      bla: "AA-BB-123"
    }, [
      {name: "bla", type: "AA-BB-#"},
    ], "no_extra");

    try {
      parse({
        bla: "AA-BB-123"
      }, [
        {name: "bla", type: "AA-BB-#"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "unsupported type AA-BB-#");
    }

    try {
      parser.parse({
        bla: "BB-AA-123"
      }, [
        {name: "bla", type: "AA-BB-#"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.bla not AA-BB-#");
    }

    parser = new Parser();

    try {
      parser.parse({
        bla: "AA-BB-123"
      }, [
        {name: "bla", type: "AA-BB-#"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "unsupported type AA-BB-#");
    }

  });

  it('parse custom parser register and unregister', async () => {


    let parser = new Parser();
    try {
      parser.parse({
        bla: "bla"
      }, [
        {name: "bla", type: "blo"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "unsupported type blo");
    }

    parser.registerParser("blo", ({
                                    value
                                  }) => {
      return "afhsakjf";
    });

    const ret = parser.parse({
      bla: "bla"
    }, [
      {name: "bla", type: "blo"},
    ], "no_extra");
    strictEqual(ret.bla, "afhsakjf");
    parser = new Parser();

    try {
      parser.parse({
        bla: "bla"
      }, [
        {name: "bla", type: "blo"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "unsupported type blo");
    }


  });

  it('parse custom parser register and unregister with custom instance', async () => {


    let parser = new Parser();
    try {
      parser.parse({
        bla: "bla"
      }, [
        {name: "bla", type: "blo"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "unsupported type blo");
    }

    parser.registerParser("blo", ({
                                    value
                                  }) => {
      return "afhsakjf";
    });

    const ret = parser.parse({
      bla: "bla"
    }, [
      {name: "bla", type: "blo"},
    ], "no_extra");
    strictEqual(ret.bla, "afhsakjf");
    parser = new Parser();

    try {
      parser.parse({
        bla: "bla"
      }, [
        {name: "bla", type: "blo"},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "unsupported type blo");
    }


  });

  it('parse simple invalid check minLength no_extra', async () => {

    try {

      const ret = parse({
        stringArray: ["", ""]
      }, [
        {name: "stringArray", type: "array", arrayType: "string", required: true, arrayMinLength: 3},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.stringArray not array3: of string");
    }

  });

  it('parse simple invalid check maxLength no_extra', async () => {

    try {

      const ret = parse({
        stringArray: ["", ""]
      }, [
        {name: "stringArray", type: "array", arrayType: "string", required: true, arrayMaxLength: 1},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.stringArray not array:1 of string");
    }

  });

  it('parse simple invalid check maxLength and minLength', async () => {

    try {

      const ret = parse({
        stringArray: ["", ""]
      }, [
        {name: "stringArray", type: "array", arrayType: "string", required: true, arrayMinLength: 0, arrayMaxLength: 1},
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.stringArray not array0::1 of string");
    }

  });

  it('parse simple valid check maxLength and minLength', async () => {


    const ret = parse({
      stringArray: ["", ""]
    }, [
      {name: "stringArray", type: "array", arrayType: "string", required: true, arrayMinLength: 0, arrayMaxLength: 2},
    ], "no_extra");

  });

  it('parse simple valid check maxLength and minLength required false', async () => {


    const ret = parse({}, [
      {name: "stringArray", type: "array", arrayType: "string", required: false, arrayMinLength: 0, arrayMaxLength: 2},
    ], "no_extra");

  });

  it('parse simple allowNull false default happy path', async () => {


    try {
      const ret = parse({
        number: null
      }, [
        {name: "number", type: "number", required: true}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.number not number");
      strictEqual((e).argAttr, "arg.number");
    }

  });

  it('parse simple allowNull false happy path', async () => {


    try {
      const ret = parse({
        number: null
      }, [
        {name: "number", type: "number", required: true, allowNull: false}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.number not number");
      strictEqual((e).argAttr, "arg.number");
    }

  });

  it('parse simple allowNull happy path', async () => {


    const {number} = parse({
      number: null
    }, [
      {name: "number", type: "number", required: true, allowNull: true}
    ], "no_extra");
    strictEqual(number, null);

  });

  it('parse simple invalid valid null  check no_extra', async () => {


    try {
      parse(null, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "string", required: true},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {name: "stringArray", type: "array", arrayType: "string", required: true},
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "invalid arg");
      strictEqual((e).argAttr, "arg");
    }

  });
  it('parse simple valid check no_extra with enum and parseJSON', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: false,
      object: JSON.stringify({
        bla: 1
      }),
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {
        name: "object",
        type: "nested",
        nestedOptions: {mode: "no_extra", options: [{name: "bla", required: true, type: "number"}]},
        required: true,
        parseJSON: true
      },
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, false);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });
  it('parse simple valid check no_extra with array and parseJSON', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: false,
      object: JSON.stringify({
        bla: 1
      }),
      stringArray: ["", ""],
      numberArray: JSON.stringify([1, 2, 3])
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {
        name: "object",
        type: "nested",
        nestedOptions: {mode: "no_extra", options: [{name: "bla", required: true, type: "number"}]},
        required: true,
        parseJSON: true
      },
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true, parseJSON: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, false);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });

  it('parse simple valid check no_extra with array nested and parseJSON', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: false,
      object: JSON.stringify({
        bla: 1
      }),
      stringArray: ["", ""],
      numberArray: JSON.stringify([{bla: 1}, {bla: 2}, {bla: 3}])
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {
        name: "object",
        type: "nested",
        nestedOptions: {mode: "no_extra", options: [{name: "bla", required: true, type: "number"}]},
        required: true,
        parseJSON: true
      },
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {
        name: "numberArray",
        type: "array",
        arrayType: "nested",
        required: true,
        parseJSON: true,
        nestedOptions: {mode: "no_extra", options: [{name: "bla", required: true, type: "number"}]}
      }
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, false);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });

  it('parse simple invalid check no_extra with enum and parseJSON', async () => {

    try {

      const ret = parse({
        number: 1,
        string: "string",
        boolean: false,
        object: {
          bla: 1
        },
        stringArray: ["", ""],
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
        {name: "boolean", type: "boolean", required: true},
        {
          name: "object",
          type: "nested",
          nestedOptions: {mode: "no_extra", options: [{name: "bla", required: true, type: "number"}]},
          required: true,
          parseJSON: true
        },
        {name: "stringArray", type: "array", arrayType: "string", required: true},
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "parseJSON not available to non string value");
    }
  });

  it('parse simple valid check no_extra with enum', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: false,
      object: {},
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, false);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });

  it('parse simple valid check no_extra with enum and multiple', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: false,
      object: {},
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {
        name: "object", type: "multiple", required: true, multipleOptions: [
          {type: "string"},
          {type: "object"}
        ]
      },
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, false);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

    const ret2 = parse({
      number: 1,
      string: "string",
      boolean: false,
      object: "bla",
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {
        name: "object", type: "multiple", required: true, multipleOptions: [
          {type: "string"},
          {type: "object"}
        ]
      },
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret2.number, 1);
    strictEqual(ret2.string, "string");
    strictEqual(ret2.boolean, false);
    strictEqual(ret2.object, "bla");
    strictEqual(ret2.stringArray.length, 2);
    strictEqual(ret2.numberArray.length, 3);

    try {
      parse({
        number: 1,
        string: "string",
        boolean: false,
        object: "bla",
        stringArray: ["", ""],
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
        {name: "boolean", type: "boolean", required: true},
        {
          name: "object", type: "multiple", required: true, multipleOptions: [
            {type: "number"},
            {type: "object"}
          ]
        },
        {name: "stringArray", type: "array", arrayType: "string", required: true},
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(true, false);
    } catch (e) {
      strictEqual((e).message, "arg.object not multiple as defined.");
    }

  });

  it('parse simple valid check no_extra with enum in array', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      object: {},
      stringArray: ["object", "function"],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {name: "stringArray", type: "array", arrayType: "enum", required: true, enumValues: ["object", "function"]},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);
  });

  it('parse simple valid check no_extra with enum in array with forceArray', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      object: {},
      stringArray: "object",
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {
        name: "stringArray",
        type: "array",
        arrayType: "enum",
        required: true,
        enumValues: ["object", "function"],
        forceArray: true
      },
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 1);
    strictEqual(ret.numberArray.length, 3);
  });

  it('parse simple invalid check no_extra with enum in array with forceArray', async () => {


    try {
      parse({
        number: 1,
        string: "string",
        boolean: true,
        object: {},
        stringArray: "object",
        numberArray: 1
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {
          name: "stringArray",
          type: "array",
          arrayType: "enum",
          required: true,
          enumValues: ["object", "function"],
          forceArray: true
        },
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
    } catch (e) {
      strictEqual((e).message, "arg.numberArray not array of number");
    }

  });

  it('parse simple invalid check no_extra with enum in array', async () => {


    try {
      const ret = parse({
        number: 1,
        string: "string",
        boolean: true,
        object: {},
        stringArray: ["object", "not valid"],
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {name: "stringArray", type: "array", arrayType: "enum", required: true, enumValues: ["object", "function"]},
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(true, false);
    } catch (e) {
      strictEqual((e).message, "arg.stringArray.1 not enum as defined. valid values [object,function]");
      strictEqual((e).argAttr, "arg.stringArray.1");
    }


  });
  it('parse simple invalid check no_extra with enum in nested', async () => {


    try {
      const ret = parse({
        number: 1,
        string: "string",
        boolean: true,
        object: {},
        nested: {
          stringArray: ["object", "not valid"]
        },
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {
          name: "nested", type: "nested", required: true, nestedOptions: {
            options: [
              {
                name: "stringArray",
                type: "array",
                arrayType: "enum",
                required: true,
                enumValues: ["object", "function"]
              }
            ],
            mode: "no_extra"
          }
        },
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(true, false);
    } catch (e) {
      strictEqual((e).message, "arg.nested.stringArray.1 not enum as defined. valid values [object,function]");
      strictEqual((e).argAttr, "arg.nested.stringArray.1");
    }

  });
  it('parse simple invalid check no_extra with enum in nested not array', async () => {


    try {
      const ret = parse({
        number: 1,
        string: "string",
        boolean: true,
        object: {},
        nested: {
          string: "not valid"
        },
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {
          name: "nested", type: "nested", required: true, nestedOptions: {
            options: [
              {
                name: "string",
                type: "enum",
                required: true,
                enumValues: ["object", "function"]
              }
            ],
            mode: "no_extra"
          }
        },
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(true, false);
    } catch (e) {
      strictEqual((e).message, "arg.nested.string not enum as defined. valid values [object,function]");
      strictEqual((e).argAttr, "arg.nested.string");
    }

  });
  it('parse simple invalid check no_extra with enum', async () => {


    try {
      const ret = parse({
        number: 1,
        string: "not valid",
        boolean: true,
        object: {}
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {name: "string", type: "enum", required: true, enumValues: ["object", "function"]}
      ], "no_extra");
      strictEqual(true, false);
    } catch (e) {
      strictEqual((e).message, "arg.string not enum as defined. valid values [string,number]");
      strictEqual((e).argAttr, "arg.string");
    }

  });
  it('parse simple valid check no_extra with enum in nested and simplemap as options', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      object: {},
      stringArray: ["object", "function"],
      numberArray: [1, 2, 3],
      nested: {
        stringArray2: ["object", "function"],
      }
    }, {
      number: {
        type: "number",
        required: true,
      },
      string: {
        type: "enum",
        required: true,
        enumValues: ["string", "number"]
      },
      boolean: {
        type: "boolean",
        required: true
      },
      object: {
        type: "object",
        required: true
      },
      stringArray: {
        type: "array",
        arrayType: "enum",
        required: true,
        enumValues: ["object", "function"]
      },
      numberArray: {
        type: "array",
        arrayType: "number",
        required: true
      },
      nested: {
        type: "nested", required: true, nestedOptions: {
          options: {
            stringArray2: {
              type: "array",
              arrayType: "enum",
              required: true,
              enumValues: ["object", "function"]
            }
          },
          mode: "no_extra"
        }
      }
    }, "no_extra");
    strictEqual(Object.keys(ret).length, 7);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });
  it('parse simple valid check no_extra with enum in nested', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      object: {},
      stringArray: ["object", "function"],
      numberArray: [1, 2, 3],
      nested: {
        stringArray2: ["object", "function"],
      }
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "enum", required: true, enumValues: ["string", "number"]},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {name: "stringArray", type: "array", arrayType: "enum", required: true, enumValues: ["object", "function"]},
      {name: "numberArray", type: "array", arrayType: "number", required: true},
      {
        name: "nested", type: "nested", required: true, nestedOptions: {
          options: [
            {
              name: "stringArray2",
              type: "array",
              arrayType: "enum",
              required: true,
              enumValues: ["object", "function"]
            },
          ],
          mode: "no_extra"
        }
      },
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 7);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });
  it('parse simple valid check no_extra', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      object: {},
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "string", required: true},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });
  it('parse simple valid check with nested array and no_extra', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      object: {},
      stringArray: ["", ""],
      numberArray: [1, 2, 3],
      nestedArray: [
        {bla: "blo"}
      ]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "string", required: true},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {
        name: "nestedArray", type: "array", arrayType: "nested", required: true, nestedOptions: {
          mode: "no_extra",
          options: [
            {name: "bla", type: "string", required: true}
          ]
        }
      },
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 7);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);
    strictEqual(ret.nestedArray.length, 1);
    strictEqual(ret.nestedArray[0].bla, "blo");

  });
  it('parse simple valid check nested no_extra', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      nested: {
        string: "string"
      },
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "string", required: true},
      {name: "boolean", type: "boolean", required: true},
      {
        name: "nested", type: "nested", required: true, nestedOptions: {
          options: [
            {name: "string", type: "string", required: true},
            {name: "boolean", type: "boolean", required: false}
          ]
        }
      },
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.nested, "object");
    strictEqual(typeof ret.nested.string, "string");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });
  it('parse simple valid check nested add_extra and no_extra', async () => {


    const ret = parse({
      number: 1,
      string: "string",
      boolean: true,
      nested: {
        string: "string",
        extra: "ble"
      },
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "string", required: true},
      {name: "boolean", type: "boolean", required: true},
      {
        name: "nested", type: "nested", required: true, nestedOptions: {
          options: [
            {name: "string", type: "string", required: true},
            {name: "boolean", type: "boolean", required: false}
          ],
          mode: "add_extra"
        }
      },
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "no_extra");
    console.dir(ret);
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.nested, "object");
    strictEqual(typeof ret.nested.string, "string");
    strictEqual(ret.nested.extra, "ble");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });
  it('parse simple invalid check nested no_extra', async () => {


    try {
      const ret = parse({
        number: 1,
        string: "string",
        boolean: true,
        nested: {
          string: "string"
        },
        stringArray: ["", ""],
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "string", required: true},
        {name: "boolean", type: "boolean", required: true},
        {
          name: "nested", type: "nested", required: true, nestedOptions: {
            options: [
              {name: "string", type: "string", required: true},
              {name: "boolean", type: "boolean", required: true}
            ]
          }
        },
        {name: "stringArray", type: "array", arrayType: "string", required: true},
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.nested.boolean not defined");
      strictEqual((e).argAttr, "arg.nested.boolean");
    }

  });
  it('parse simple invalid number check no_extra', async () => {

    try {

      parse({
        number: "number",
        string: "string",
        boolean: true,
        object: {},
        stringArray: ["", ""],
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "string", required: true},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {name: "stringArray", type: "array", arrayType: "string", required: true},
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.number not number");
      strictEqual((e).argAttr, "arg.number");
    }

  });

  it('parse simple invalid extra key check no_extra', async () => {

    try {

      parse({
        number: 1,
        extraKey: "bla",
        string: "string",
        boolean: true,
        object: {},
        stringArray: ["", ""],
        numberArray: [1, 2, 3]
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "string", required: true},
        {name: "boolean", type: "boolean", required: true},
        {name: "object", type: "object", required: true},
        {name: "stringArray", type: "array", arrayType: "string", required: true},
        {name: "numberArray", type: "array", arrayType: "number", required: true}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.extraKey option not valid [extraKey]");
      strictEqual((e).argAttr, "arg.extraKey");
    }

  });

  it('parse simple valid extra key check add_extra', async () => {


    const ret = parse({
      number: 1,
      extraKey: "bla",
      string: "string",
      boolean: true,
      object: {},
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "string", required: true},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "add_extra");
    strictEqual(Object.keys(ret).length, 7);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.extraKey, "bla");
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });

  it('parse simple valid extra key check remove_extra', async () => {


    const ret = parse({
      number: 1,
      extraKey: "bla",
      string: "string",
      boolean: true,
      object: {},
      stringArray: ["", ""],
      numberArray: [1, 2, 3]
    }, [
      {name: "number", type: "number", required: true},
      {name: "string", type: "string", required: true},
      {name: "boolean", type: "boolean", required: true},
      {name: "object", type: "object", required: true},
      {name: "stringArray", type: "array", arrayType: "string", required: true},
      {name: "numberArray", type: "array", arrayType: "number", required: true}
    ], "remove_extra");
    strictEqual(Object.keys(ret).length, 6);
    strictEqual(ret.number, 1);
    strictEqual(ret.string, "string");
    strictEqual(ret.extraKey, undefined);
    strictEqual(ret.hasOwnProperty("extraKey"), false);
    strictEqual(ret.boolean, true);
    strictEqual(typeof ret.object, "object");
    strictEqual(ret.stringArray.length, 2);
    strictEqual(ret.numberArray.length, 3);

  });


  it('parse simple {} no_extra', async () => {


    parse({}, [
      {name: "number", type: "number", required: false},
      {name: "string", type: "string", required: false},
      {name: "boolean", type: "boolean", required: false},
      {name: "object", type: "object", required: false},
      {name: "stringArray", type: "array", arrayType: "string", required: false},
      {name: "numberArray", type: "array", arrayType: "number", required: false}
    ], "no_extra");

  });

  it('parse simple {number: undefined} no_extra', async () => {


    try {
      const ret = parse({
        number: undefined
      }, [
        {name: "number", type: "number", required: true},
        {name: "string", type: "string", required: false},
        {name: "boolean", type: "boolean", required: false},
        {name: "object", type: "object", required: false},
        {name: "stringArray", type: "array", arrayType: "string", required: false},
        {name: "numberArray", type: "array", arrayType: "number", required: false}
      ], "no_extra");
      console.dir(ret);
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.number not defined");
      strictEqual((e).argAttr, "arg.number");
    }

  });

  it('parse simple {number: undefined} no_extra defautlValue', async () => {


    const {number} = parse({
      number: undefined
    }, [
      {name: "number", type: "number", required: false, defaultValue: 33},
      {name: "string", type: "string", required: false},
      {name: "boolean", type: "boolean", required: false},
      {name: "object", type: "object", required: false},
      {name: "stringArray", type: "array", arrayType: "string", required: false},
      {name: "numberArray", type: "array", arrayType: "number", required: false}
    ], "no_extra");
    strictEqual(number, 33);

  });

  it('parse simple {} no_extra defautlValue', async () => {


    const {number} = parse({}, [
      {name: "number", type: "number", required: false, defaultValue: 33},
      {name: "string", type: "string", required: false},
      {name: "boolean", type: "boolean", required: false},
      {name: "object", type: "object", required: false},
      {name: "stringArray", type: "array", arrayType: "string", required: false},
      {name: "numberArray", type: "array", arrayType: "number", required: false}
    ], "no_extra");
    strictEqual(number, 33);

  });

  it('parse simple {number} no_extra numberMax', async () => {


    try {
      const {number} = parse({
        number: 33
      }, [
        {name: "number", type: "number", required: false, numberMax: 32},
        {name: "string", type: "string", required: false},
        {name: "boolean", type: "boolean", required: false},
        {name: "object", type: "object", required: false},
        {name: "stringArray", type: "array", arrayType: "string", required: false},
        {name: "numberArray", type: "array", arrayType: "number", required: false}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.number not number:32");
    }

  });

  it('parse simple {number} no_extra numberMax happy path', async () => {


    const {number} = parse({
      number: 33
    }, [
      {name: "number", type: "number", required: false, numberMax: 33},
      {name: "string", type: "string", required: false},
      {name: "boolean", type: "boolean", required: false},
      {name: "object", type: "object", required: false},
      {name: "stringArray", type: "array", arrayType: "string", required: false},
      {name: "numberArray", type: "array", arrayType: "number", required: false}
    ], "no_extra");
    strictEqual(number, 33);


  });

  it('parse simple {number} no_extra numberMin', async () => {


    try {
      const {number} = parse({
        number: 33
      }, [
        {name: "number", type: "number", required: false, numberMin: 34}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.number not number34:");
    }

  });
  it('parse simple {number} no_extra numberMin 0 and defaultValue 0 happy path', async () => {


    const {number} = parse({
      number: 0
    }, [
      {name: "number", type: "number", required: false, numberMin: 0, defaultValue: 0}
    ], "no_extra");
    strictEqual(number, 0);

  });

  it('parse simple {string} no_extra stringMinLength', async () => {


    try {
      const {string} = parse({
        string: "1"
      }, [
        {name: "string", type: "string", required: false, stringMinLength: 2}
      ], "no_extra");
      strictEqual(false, true);
    } catch (e) {
      strictEqual((e).message, "arg.string not string2:");
    }

  });

  it('parse simple {string} no_extra stringMaxLength', async () => {


    try {
      const {string} = parse({
        string: "12"
      }, [
        {name: "string", type: "string", required: false, stringMaxLength: 1},
      ], "no_extra");
      strictEqual(true, false);
    } catch (e) {
      strictEqual((e).message, "arg.string not string:1");
    }

  });

  it('parse simple {string} no_extra stringMaxLength happy path', async () => {


    const {string} = parse({
      string: "1"
    }, [
      {name: "string", type: "string", required: false, stringMaxLength: 1},
    ], "no_extra");
    strictEqual(string, "1");


  });
});

/*it('parse simple {number: undefined} no_extra with ignore undefined', async () => {



  const ret = parse( {
    number: undefined
  }, [
    { name: "number", type: "number", required: false },
    { name: "string", type: "string", required: false },
    { name: "boolean", type: "boolean", required: false },
    { name: "object", type: "object", required: false },
    { name: "stringArray", type: "array", arrayType: "string", required: false },
    { name: "numberArray", type: "array", arrayType: "number", required: false }
  ], "no_extra", true);
  strictEqual(Object.keys(ret).length, 0);

});*/
