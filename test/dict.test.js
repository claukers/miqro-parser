const {parse} = require("../dist");
const {strictEqual} = require("assert");

const testOptions = {
  category: "parse dict test"
}

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
}, testOptions)
