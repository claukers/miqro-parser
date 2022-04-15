const {Parser} = require("../dist");
const {strictEqual} = require("assert");

const testOptions = {
  category: "parse custom"
}

it("parser custom happy path", () => {
  const parser = new Parser();

  parser.registerParser("custom1_item", (value, args, p) => {
    return p.parse({
      [args.attrName]: value
    }, {
      [args.attrName]: {
        type: "nested",
        nestedOptions: {
          options: {
            itemName: "string"
          }
        }
      }
    }, "no_extra", args.name)[args.attrName];
  });
  parser.registerParser("custom1", (value, args, p) => {
    return p.parse({
      [args.attrName]: value
    }, {
      [args.attrName]: {
        type: "nested",
        nestedOptions: {
          options: {
            name: "string",
            items: {
              type: "array",
              arrayType: "custom1_item"
            }
          }
        }
      }
    }, "no_extra", args.name)[args.attrName];
  });

  parser.registerParser("custom1_list", (value, args, p) => {
    return p.parse({
      [args.attrName]: value
    }, {
      [args.attrName]: {
        type: "array",
        arrayType: "custom1"
      }
    }, "no_extra", args.name)[args.attrName];
  });

  const parsed = parser.parse({
    list: [
      {
        name: "name",
        items: [
          {
            itemName: "item"
          }
        ]
      }
    ]
  }, {
    list: "custom1_list"
  });
  console.dir(parsed, {
    depth: 10
  });
}, testOptions);

it("test list alias", async () => {
  const parser = new Parser();
  const ret = parser.parse({
    A: ["1"],
    C: ["1", 2, "33"],
    B: [true, false]
  }, {
    A: "string[]",
    B: "boolean[]",
    C: "number[]"
  }, "no_extra");
  strictEqual(Object.keys(ret).length, 3);
  strictEqual(ret.C[0], 1)
  strictEqual(ret.C[1], 2)
  strictEqual(ret.C[2], 33)
}, testOptions);

it("test alias", async () => {
  const parser = new Parser();
  parser.registerType("A", {
    value: {
      type: "number"
    }
  })
  const ret = parser.parse({
    A: [{value: "1"}, {value: 2}, {value: "33"}]
  }, {
    A: "A[]"
  }, "no_extra");
  strictEqual(Object.keys(ret).length, 1);
  strictEqual(ret.A[0].value, 1)
  strictEqual(ret.A[1].value, 2)
  strictEqual(ret.A[2].value, 33)
}, testOptions);
