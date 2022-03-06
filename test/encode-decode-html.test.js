const {parse} = require("../dist");
const {strictEqual} = require("assert");

const testOptions = {
  category: "encode/decode html"
}

it("happy path", async () => {
  const value = "<p>somevalue</p>";
  const parsed = parse(value, "encodeHTML");
  console.log(parsed);
  strictEqual(parsed, "&#60;&#112;&#62;&#115;&#111;&#109;&#101;&#118;&#97;&#108;&#117;&#101;&#60;&#47;&#112;&#62;");
  const decoded = parse(parsed, "decodeHTML");
  console.log(decoded);
  strictEqual(decoded, value);
}, testOptions);
