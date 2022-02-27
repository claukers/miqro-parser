const { parse } = require("../dist");
const {strictEqual} = require("assert");

const testOptions = {
  category: "integer"
}

it('happy path parse', async () => {
  strictEqual(parse("3.0", "integer"), 3);
  strictEqual(parse("3", "integer"), 3);
  strictEqual(parse(3.0, "integer"), 3);
  strictEqual(parse(3, "integer"), 3);
}, testOptions);

it('happy path invalid', async () => {
  try {
    const parsed = parse("3.1", "integer");
    console.log(parsed);
    strictEqual(parsed, 3);
    strictEqual(false, true);
  } catch(e) {
    strictEqual(e.message, "arg not integer");
  }

  try {
    strictEqual(parse(3.1, "integer"), 3);
    strictEqual(false, true);
  } catch(e) {
    strictEqual(e.message, "arg not integer");
  }
}, testOptions);
