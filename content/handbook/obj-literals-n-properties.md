---
title: "Object Literals & Property Access"
description: "Master JavaScript object literals, dot notation, bracket notation, property shorthand, computed properties, and dynamic property access patterns used in real-world applications."
order: 1
category: "Objects & Arrays Basics"
categoryOrder: 2
keywords: ["javascript objects", "object literals", "dot notation", "bracket notation", "property access", "computed properties", "object shorthand", "dynamic properties"]
---

# Object Literals & Property Access

You're debugging a colleague's code and see this: `user[userRole + 'Permissions']`. It looks weird. Why not just use `user.adminPermissions`? Then you realize the role is dynamic — it could be "admin", "editor", or "viewer". Suddenly bracket notation isn't just an alternative syntax; it's the only way to solve this problem.

Understanding object literals and the different ways to access properties is fundamental to JavaScript. It's also where a lot of subtle bugs hide — and where interviewers love to probe.

## What Are Object Literals?

An **object literal** is the simplest way to create an object in JavaScript — you just write curly braces with key-value pairs inside. No `new` keyword, no class definition, no constructor function. Just data, structured.

```javascript
const user = {
  name: "Dima",
  age: 28,
  isActive: true
};
```

Each property has a **key** (also called a name) and a **value**. Keys are strings (or Symbols), values can be anything — primitives, arrays, functions, even other objects.

Objects are JavaScript's swiss army knife. Arrays, functions, dates, regular expressions — they're all objects under the hood. Understanding the literal syntax is your entry point to the entire object system.

## Why Does This Exist?

Before JSON-like object literals became standard, creating structured data in JavaScript was verbose. You'd either use constructor functions or assign properties one by one:

```javascript
// The old, painful way
const user = new Object();
user.name = "Dima";
user.age = 28;
```

Object literals gave developers a clean, readable syntax that mirrors how we think about data. This syntax also directly influenced JSON (JavaScript Object Notation), which became the universal data exchange format for web APIs.

Modern JavaScript has evolved the literal syntax even further — with shorthand properties, computed keys, and method definitions that make objects more expressive than ever.

## Let's See It in Action

### Basic Object Literal

```javascript
const product = {
  id: 1,
  name: "Mechanical Keyboard",
  price: 149.99,
  inStock: true,
  tags: ["electronics", "peripherals", "gaming"]
};

console.log(product.name);  // Output: Mechanical Keyboard
console.log(product.price); // Output: 149.99
```

This is straightforward — define properties, access them with dot notation. But there's more to learn.

### Dot Notation vs Bracket Notation

JavaScript gives you two ways to access properties:

```javascript
const car = {
  brand: "Toyota",
  "model-year": 2024,        // Key with hyphen — must be quoted
  "2fast": "too furious"     // Key starting with number — must be quoted
};

// Dot notation — clean and common
console.log(car.brand);       // Output: Toyota

// Bracket notation — more flexible
console.log(car["brand"]);    // Output: Toyota
console.log(car["model-year"]); // Output: 2024
console.log(car["2fast"]);    // Output: too furious

// These would cause syntax errors:
// car.model-year  ❌ (JavaScript sees subtraction)
// car.2fast       ❌ (identifiers can't start with numbers)
```

**The rule:** Dot notation is cleaner, but bracket notation handles any valid string key.

### Dynamic Property Access

Here's where bracket notation becomes essential:

```javascript
const permissions = {
  adminAccess: ["read", "write", "delete", "manage"],
  editorAccess: ["read", "write"],
  viewerAccess: ["read"]
};

function getPermissions(role) {
  // The key is computed at runtime
  const key = role + "Access";
  return permissions[key];
}

console.log(getPermissions("admin"));  // Output: ["read", "write", "delete", "manage"]
console.log(getPermissions("viewer")); // Output: ["read"]

// This is impossible with dot notation:
// permissions.role + "Access"  ❌ (looks for literal property "role")
```

Any time the property name is stored in a variable or needs to be computed, you need brackets.

### Property Shorthand (ES6+)

When the variable name matches the property name, you can skip the repetition:

```javascript
const name = "Dima";
const age = 28;
const role = "developer";

// ❌ Old way — repetitive
const userOld = {
  name: name,
  age: age,
  role: role
};

// ✅ Shorthand — clean
const user = { name, age, role };

console.log(user); // Output: { name: "Dima", age: 28, role: "developer" }
```

This is everywhere in modern JavaScript — React components, destructured imports, function returns. Get comfortable with it.

### Computed Property Names

You can compute property names right in the literal:

```javascript
const prefix = "user";
const id = 42;

const data = {
  [prefix + "Id"]: id,
  [prefix + "Name"]: "Dima",
  [`${prefix}Active`]: true
};

console.log(data);
// Output: { userId: 42, userName: "Dima", userActive: true }
```

This is powerful for building objects dynamically:

```javascript
// Creating an object from form field names
function createFormData(fields) {
  const data = {};
  
  fields.forEach(field => {
    data[field.name] = field.value;
  });
  
  return data;
}

const fields = [
  { name: "email", value: "dima@example.com" },
  { name: "password", value: "secret123" }
];

console.log(createFormData(fields));
// Output: { email: "dima@example.com", password: "secret123" }
```

### Method Definitions

Functions as properties have a cleaner syntax too:

```javascript
// ❌ Old way
const calculatorOld = {
  add: function(a, b) {
    return a + b;
  }
};

// ✅ Method shorthand
const calculator = {
  add(a, b) {
    return a + b;
  },
  
  subtract(a, b) {
    return a - b;
  },
  
  // Arrow functions work too (but 'this' behaves differently)
  multiply: (a, b) => a * b
};

console.log(calculator.add(5, 3));      // Output: 8
console.log(calculator.multiply(4, 2)); // Output: 8
```

### Watch Out: Property Access on Null/Undefined

This is one of the most common runtime errors in JavaScript:

```javascript
const response = {
  data: {
    user: null
  }
};

// ❌ This crashes
console.log(response.data.user.name);
// TypeError: Cannot read properties of null (reading 'name')

// ✅ Optional chaining (ES2020)
console.log(response.data.user?.name); // Output: undefined

// ✅ With a default value
console.log(response.data.user?.name ?? "Anonymous"); // Output: Anonymous
```

Optional chaining (`?.`) stops evaluation and returns `undefined` if it hits `null` or `undefined`. This single feature eliminates countless "cannot read property of undefined" errors.

### Watch Out: Accessing Non-Existent Properties

```javascript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};

// Accessing missing property returns undefined, not an error
console.log(config.retryCount); // Output: undefined

// This can cause subtle bugs
const maxRetries = config.retryCount + 1;
console.log(maxRetries); // Output: NaN (undefined + 1)

// ✅ Better: provide defaults
const maxRetriesSafe = (config.retryCount ?? 0) + 1;
console.log(maxRetriesSafe); // Output: 1
```

### Interview Challenge: What's the Output?

```javascript
const key = "name";
const obj = {
  key: "value1",
  [key]: "value2",
  name: "value3"
};

console.log(obj.key);
console.log(obj[key]);
console.log(obj.name);
```

Think about it before reading the answer.

**Answer:**
```javascript
console.log(obj.key);  // Output: value1 (literal string "key")
console.log(obj[key]); // Output: value3 (variable key = "name", but "value3" overwrites "value2")
console.log(obj.name); // Output: value3 (same as above)
```

The object ends up as `{ key: "value1", name: "value3" }`. The `[key]: "value2"` creates a `name` property (since `key = "name"`), but it gets overwritten by `name: "value3"` which comes after it.

## How to Think About This

Think of an object as a **labeled filing cabinet**. Each drawer has a label (the key) and contents (the value).

**Dot notation** is like knowing the exact drawer label and reaching for it directly: `cabinet.invoices`.

**Bracket notation** is like having the label written on a sticky note: `cabinet[stickyNote]`. The sticky note might say "invoices" today and "receipts" tomorrow — you won't know until you read it.

> 💡 **Remember:** Use dot notation by default for cleaner code. Switch to brackets when the property name is dynamic, contains special characters, or is stored in a variable.

## Test Yourself

Before moving on, make sure you can answer:

- When must you use bracket notation instead of dot notation?
- What happens when you access a property that doesn't exist on an object?
- How do computed property names work, and when would you use them?
- What's the difference between `obj.key` and `obj[key]`?
- How does optional chaining (`?.`) help prevent runtime errors?

## Related Topics

- **Destructuring** — A concise way to extract multiple properties from objects into variables
- **Object Methods** — `Object.keys()`, `Object.values()`, `Object.entries()` for iterating over properties
- **Spread Operator** — Copying and merging objects with `{...obj}`
- **Prototypes** — What happens when a property isn't found on the object itself
- **Reference Types** — Understanding that objects are accessed by reference, not copied by value

## Go Deeper

- [MDN: Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects) — Comprehensive guide covering all object fundamentals
- [javascript.info: Objects](https://javascript.info/object) — Excellent tutorial with interactive examples and tasks
- [MDN: Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) — Deep dive into the `?.` operator
- [ES6 In Depth: Shorthand Properties](https://hacks.mozilla.org/2015/06/es6-in-depth-destructuring/) — Mozilla's coverage of ES6 object enhancements