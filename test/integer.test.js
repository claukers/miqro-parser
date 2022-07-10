const {parse} = require("../dist/cjs");
const {strictEqual} = require("assert");

describe("integer functional tests", () => {

  it('happy path parse', async () => {
    strictEqual(parse("3.0", "integer"), 3);
    strictEqual(parse("3", "integer"), 3);
    strictEqual(parse(3.0, "integer"), 3);
    strictEqual(parse(3, "integer"), 3);
  });

  it('happy path invalid', async () => {
    try {
      const parsed = parse("3.1", "integer");
      console.log(parsed);
      strictEqual(parsed, 3);
      strictEqual(false, true);
    } catch (e) {
      strictEqual(e.message, "arg not integer");
    }

    try {
      strictEqual(parse(3.1, "integer"), 3);
      strictEqual(false, true);
    } catch (e) {
      strictEqual(e.message, "arg not integer");
    }
  });

});
