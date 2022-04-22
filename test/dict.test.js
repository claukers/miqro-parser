const {parse, Parser} = require("../dist");
const {strictEqual} = require("assert");
const {it, describe} = require("@miqro/test");

describe("parse dict functional tests", () => {
  it("happy path", async () => {
    const value = {
      dict: {
        key: "value",
        key2: "2"
      }
    }
    const parsed = parse(value, {
      dict: {
        type: "dict",
        dictType: "string"
      }
    });
    strictEqual(parsed.dict.key, "value");
    strictEqual(parsed.dict.key2, "2");
  });

  it("happy path 2", async () => {
    const parser = new Parser();
    const value = {
      dict: {
        key: "value",
        key2: {
          some: 1
        }
      }
    }
    parser.registerType("custom", {
      some: "number"
    });
    const parsed = parser.parse(value, {
      dict: {
        type: "dict",
        dictType: "string|custom"
      }
    });
    strictEqual(parsed.dict.key, "value");
    strictEqual(parsed.dict.key2.some, 1);
  });

  it("string[][] alias test", async () => {


    const ret = (parse({arg: [["1", "2"], "3"]}, {
      arg: {
        type: "array",
        arrayType: "string|string[]"
      }
    }))["arg"];
    strictEqual(ret.length, 2);
    strictEqual(ret[0].length, 2);
    strictEqual(ret[1], "3");
    strictEqual(ret[0][1], "2");
  });
});
