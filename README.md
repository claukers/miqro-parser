# @miqro/parser

parse value

```typescript
import {Parser} from "@miqro/parser";
import {strictEqual} from "assert";

const parser = new Parser();
const valueNumber = "123";
const parsed = parser.parse(valueNumber, "number");

strictEqual(typeof parsed, "number");
```

parse object

```typescript
import {Parser} from "@miqro/parser";
import {strictEqual} from "assert";

const parser = new Parser();
const valueObject = {
  attr1: "13",
  attr2: ["true", false]
};
const parsed = parser.parse(valueObject, {
  attr1: "number",
  attr2: "boolean[]"
});

strictEqual(typeof parsed.attr1, "number");

// to force array use []!
const parsedForceArray = parser.parse({
  attr2: true
}, {
  attr1: "number?", // optional
  attr2: "boolean[]!"
});

strictEqual(parsedForceArray.attr2[0], true);
```

custom types

```typescript
import {Parser} from "@miqro/parser";
import {strictEqual} from "assert";

const parser = new Parser();
parser.registerEnum("CustomStatus", ["OK", "NOK"]);
parser.registerDict("Dict<CustomStatus>", "CustomStatus");
parser.registerType("CustomType", {
  custom: "string",
  status: "CustomStatus",
  statusMap: "Dict<CustomStatus>"
});
// or as a function
/*parser.registerParser((args, parser) => {
   return ... // return parsed value
});*/


const value = {
  attr1: "13",
  attr2: {
    custom: "custom1",
    status: "NOK",
    statusMap: {
        registered: "OK",
        emailValidated: "NOK"
    }
  }
};

const parsed = parser.parse(value, {
  attr1: "number",
  attr2: "CustomType"
});

strictEqual(parsed.attr1, 13);
```

or ( **|** ), forceArray ( **[]!** ) and optional ( **?** )

```typescript
import {Parser} from "@miqro/parser";
import {strictEqual} from "assert";

const parser = new Parser();
const parsed = parser.parse({
  forceArray: "123",
  attr: "123",
  attr2: "true",
  attr3: "text"
}, {
  optional: "string?",
  forceArray: "number[]!?",
  attr: "boolean|number|string",
  attr2: "boolean|number|string",
  attr3: "boolean|number|string",
});

strictEqual(parsed.attr, 123);
strictEqual(parsed.attr2, true);
strictEqual(parsed.attr3, "text");
strictEqual(parsed.forceArray[0], 123);
```

get

```typescript
import {get} from "@miqro/parser";
import {strictEqual} from "assert";

const obj = {
  user: {
    info: null
  }
}

const name = get(obj, "user.info.name", "noname");

strictEqual(name, "noname");

// using parse
const name2 = get({
  user: {
    info: {
      name: "name"
    }
  }
}, "user.info.name", "noname", "string");

strictEqual(name2, "name");
```

## browser bundle ( not recommended )

Tested with ```webpack's``` vanilla configuration.
