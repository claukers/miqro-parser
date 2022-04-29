const {fake, requireMock, describe, it} = require("@miqro/test");
const {resolve} = require("path");
const {strictEqual} = require("assert");
const {distPath} = require("./setup-test.js");

const testFilePath = resolve(distPath, "set.js");

describe("template.util.set unit tests", () => {
  it("happy path nested with {}", async () => {
    const {set} = requireMock(testFilePath, {}, distPath);
    const obj ={};
    const ret = set(obj, "user.name", "somename");
    strictEqual(ret, obj);
    strictEqual(obj.user.name, "somename");
  });
  it("happy path nested with {list:['item1']}", async () => {
    const {set} = requireMock(testFilePath, {}, distPath);
    const obj ={list:["item1"]};
    const ret = set(obj, "list.1", "item2");
    strictEqual(ret, obj);
    strictEqual(obj.list.length, 2);
    strictEqual(obj.list[0], "item1");
    strictEqual(obj.list[1], "item2");
  });
});
