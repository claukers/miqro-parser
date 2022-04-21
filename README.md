# @miqro/parser

validate and parse objects in node.

```npm install @miqro/parser```

to use in a browser bundle the module with something like webpack.

## Parser

```typescript
import {Parser} from "@miqro/parser";

const parser = new Parser();
```

### parse

#### object

```typescript
const parsed = parser.parse({
  attr1: "13",
  attr2: ["true", false]
}, {
  attr1: {
    type: "number",
    numberMaxDecimals: 0
  },
  attr2: "boolean[]"
});

console.log(typeof parsed.attr1); // "number"
console.log(typeof parsed.attr2[0]); // "boolean"
```

#### value

```typescript
const parsed = parser.parse("123", "number");
```

### parse mode

- ```no_extra```: the default mode. it doesn't allow extra attributes. Parser.parse will throw and error when extra attributes are found.
- ```remove_extra```: removes the extra attributes from parsed result.
- ```add_extra```: adds the extra attributes into the parsed result.

```typescript
const parsed = parser.parse({
  email: "user@server.com",
  otherData: {
      attr1: "1"
  }
}, {
    email: "email"
}, "add_extra");

console.log(parsed.otherData.attr1); // "1"
```

### built-in parsers

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

#### built-in parser options

to use the built-in parser options use type as ```object``` instead of a ```string```.

```typescript
parser.parse(value, {
  attr1: {
    type: "string",
    stringMaxLength: 10
  }
});
```

### custom parsers

#### registerParser

```typescript
parser.registerParser("my-type", (value, options, parser) => {
  // return parsed value
  return "parsed";
});
```

#### registerType 

```typescript
parser.registerType("CustomType", {
  custom: "string",
  status: "CustomStatus",
  statusMap: "Dict<CustomStatus>"
});
```

#### registerEnum

```typescript
parser.registerEnum("CustomStatus", ["OK", "NOK"]);
```

#### registerDict

```typescript
parser.registerDict("Dict<CustomStatus>", "CustomStatus");
```

#### registerArray

```typescript
parser.registerArray("CustomStatus[][][]", "CustomStatus[][]");
```

#### registerAlias

```typescript
parser.registerAlias("my-integer", {
  type: "number", // any registered type
  numberMinDecimals: 0,
  numberMaxDecimals: 0
});
```

### operators or ( **|** ), array ( **[]** ), forceArray ( **[]!** ) and optional ( **?** )

```typescript
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
```

**Important Notice**

internally array ( **[]** ) and forceArray ( **[]!** ) are aliases, so when calling ```this.registerParser("custom", ...)``` only  ```custom[]``` and ```custom[]!``` will be defined.

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
