const { strictEqual } = require("assert");
const { Parser, get } = require("../dist");

it("get happy path", async () => {
  strictEqual(get({
    user: {
      info: {
        name: "name"
      }
    }
  }, "user.info.name"), "name");
});

it("get happy path custom parser", () => {
  const parser = new Parser();
  parser.registerParser("bla", (args, parser) => {
    return typeof args.value === "string" ? args.value : undefined;
  })
  strictEqual(get({
    user: {
      info: {
        name: "name"
      }
    }
  }, "user.info.name", undefined, { type: "bla" }, parser), "name");
});

it("get happy path parser", () => {
  strictEqual(get({
    user: {
      info: {
        age: "10"
      }
    }
  }, "user.info.age", undefined, { type: "number" }), 10);
});

it("get happy path default value", () => {
  strictEqual(get({
  }, "user.info.name", "name"), "name");
});

it("get happy path with {}", () => {
  strictEqual(get({
  }, "user.info.name"), undefined);
});

it("get happy path with null", () => {
  strictEqual(get(null, "user.info.name"), undefined);
});

it("get happy path default value 2", () => {
  strictEqual(get({
  }, "user.info.name", "name"), "name");
});

it("get happy path default value with null", () => {
  strictEqual(get(null, "user.info.name", "name"), "name");
});

it("get happy path default value with undefined", () => {
  strictEqual(get(undefined, "user.info.name", "name"), "name");
});

it("get happy path no default value with undefined", () => {
  strictEqual(get(undefined, "user.info.name"), undefined);
});

it("get happy path no default value", () => {
  strictEqual(get({}, "user.info.name"), undefined);
});

