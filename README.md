# @miqro/parser

## parse value

```typescript
import {Parser} from "@miqro/parser";
import {strictEqual} from "assert";

const parser = new Parser();
const valueNumber = "123";
const parsed = parser.parse(valueNumber, "number");

strictEqual(typeof parsed, "number");
```

## parse object

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

## custom types

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
/*parser.registerParser((value, args, parser) => {
   return ... // return parsed value or undefined if cannot be parsed
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

## or ( **|** ), array ( **[]** ), forceArray ( **[]!** ) and optional ( **?** )

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

## get

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

## built-in types

- string
  - options
    - stringMinLength
    - stringMaxLength
- regex
  - options
    - regex
    - stringMinLength
    - stringMaxLength
- url
  - options
    - stringMinLength
    - stringMaxLength
- function
- email
  - options
    - stringMinLength
    - stringMaxLength
- decodeHTML
  - options
    - stringMinLength
    - stringMaxLength
- encodeHTML
  - options
    - stringMinLength
    - stringMaxLength
- integer
  - numberMin
  - numberMax
- number
  - options
    - numberMin
    - numberMax
    - numberMaxDecimals
    - numberMinDecimals
- any
- object
- array
  - options
    - arrayType
    - arrayMaxLength
    - arrayMinLength
- dict
  - options
    - dictType
- boolean
- enum
  - options
    - enumValues
- multiple
  - options
    - multipleOptions
- nested
  - options
    - nestedOptions
- string1

### built-in options

to use the built-in type options use type as ```object``` instead of a string for example.

```typescript
import {Parser} from "@miqro/parser";

const parser = new Parser();
parser.registerType("CustomType", {
  // value will use stringMinLength option from built-in string type
  value: {
    type: "string",
    stringMinLength: 3
  },
  // other will use the default options os built-in string type
  other: "string"
});
```

### type aliases

to avoid using built-in type options create a type alias.

```typescript
import {Parser} from "@miqro/parser";

const parser = new Parser();
parser.registerAlias("my-integer", {
  type: "number", // any registered type
  numberMinDecimals: 0,
  numberMaxDecimals: 0
});
```

### type custom option

use the ```options``` attribute. 

#### example

```typescript
import {Parser} from "@miqro/parser";

const parser = new Parser();
parser.registerParser("my-type", (value, args) => {
  // use args.options
  // return parsed value
  return "parsed";
});

const parsed = parser.parse(..., {
  value: {
    type: "my-type",
    options: {
      other: "options"
    }
  }
});

/*
// you can also use the custom options in type aliases.
parser.registerAlias("my-type-alias", {
  type: "my-type", // any registered type
  options: {
      some: "attr"
  }
});
 */

```
