---
title: "typeof and Basic Type Checking"
description: "Master JavaScript's typeof operator, understand its quirks, and learn reliable patterns for type checking including Array.isArray(), instanceof, and Object.prototype.toString."
order: 4
category: "Fundamentals"
categoryOrder: 1
keywords: ["typeof", "type checking", "javascript types", "instanceof", "Array.isArray", "type coercion", "primitive types", "object types"]
---

# typeof and Basic Type Checking

Here's a question that has tripped up countless developers in interviews: "What does `typeof null` return?" If you said `"null"`, you're wrong — and you're in good company. This quirk has been in JavaScript since 1995, and it's just the beginning of the surprises `typeof` has in store.

Understanding how to check types in JavaScript isn't just interview trivia — it's essential for writing defensive code, debugging mysterious errors, and building utilities that handle different inputs gracefully.

## What is typeof?

The **typeof** operator returns a string indicating the type of a value. You use it by placing `typeof` before any expression, and it tells you what kind of value you're dealing with.

```javascript
typeof 42          // "number"
typeof "hello"     // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof BigInt(9)   // "bigint"
typeof {}          // "object"
typeof function(){} // "function"
```

Looks simple enough, right? It is — until you hit the edge cases that have confused developers for decades.

## Why Does This Exist?

JavaScript is a dynamically typed language. Variables don't have fixed types — a variable can hold a string one moment and an object the next. This flexibility is powerful but dangerous.

```javascript
function processUser(user) {
  // Is user an object? A string ID? null? undefined?
  // We need to know before we can safely use it
}
```

Before TypeScript existed, before Flow, before any static analysis tools — `typeof` was the primary way to figure out what kind of value you were working with at runtime. It's still essential today for:

- Validating function arguments
- Handling API responses that might be different types
- Building polymorphic functions that behave differently based on input
- Checking if optional features or variables exist

## Let's See It in Action

### Basic Example: The typeof Results Table

Here's every possible return value of `typeof`:

```javascript
// Primitives
typeof undefined     // "undefined"
typeof null          // "object"    ← ⚠️ Famous bug!
typeof true          // "boolean"
typeof 42            // "number"
typeof "text"        // "string"
typeof Symbol("id")  // "symbol"
typeof 10n           // "bigint"

// Objects and functions
typeof {}            // "object"
typeof []            // "object"    ← Arrays are objects
typeof function(){}  // "function"
typeof new Date()    // "object"
typeof /regex/       // "object"
typeof new Map()     // "object"
typeof null          // "object"    ← Yes, this is a bug
```

Notice something? Almost everything that isn't a primitive returns `"object"`. This severely limits `typeof`'s usefulness for distinguishing between different kinds of objects.

### Real-World Usage: Safe Property Access

```javascript
// Checking if something exists before using it
function getConfig(options) {
  // Check if options was provided and is an object
  if (typeof options !== "object" || options === null) {
    return { theme: "light", language: "en" }; // defaults
  }
  
  return {
    theme: typeof options.theme === "string" ? options.theme : "light",
    language: typeof options.language === "string" ? options.language : "en"
  };
}

getConfig();                    // { theme: "light", language: "en" }
getConfig(null);                // { theme: "light", language: "en" }
getConfig({ theme: "dark" });   // { theme: "dark", language: "en" }
```

### Watch Out: The Notorious null Bug

```javascript
// ❌ This doesn't work as expected
function isObject(value) {
  return typeof value === "object";
}

isObject({});     // true ✓
isObject([]);     // true (arrays are objects, so... okay?)
isObject(null);   // true ← 😱 null is NOT an object!
```

Why does `typeof null` return `"object"`? It's a bug from JavaScript's first implementation in 1995. Values were stored with a type tag, and the tag for objects was `0`. `null` was represented as the NULL pointer (`0x00`), so its type tag was also `0`, making it appear as an object. The bug was never fixed because too much existing code depended on it.

Here's the fix:

```javascript
// ✅ Proper object check
function isObject(value) {
  return typeof value === "object" && value !== null;
}

isObject({});     // true
isObject([]);     // true
isObject(null);   // false ✓
```

### Watch Out: Arrays Look Like Objects

```javascript
// ❌ typeof can't distinguish arrays
typeof []           // "object"
typeof {}           // "object"
typeof new Map()    // "object"

// ✅ Use Array.isArray() for arrays
Array.isArray([]);           // true
Array.isArray({});           // false
Array.isArray("string");     // false
Array.isArray(new Array());  // true
```

### Advanced: The Nuclear Option — Object.prototype.toString

When `typeof` isn't enough, there's a more powerful (if uglier) technique:

```javascript
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

getType(42);            // "number"
getType("hi");          // "string"
getType(true);          // "boolean"
getType(undefined);     // "undefined"
getType(null);          // "null"        ← Finally!
getType([]);            // "array"       ← Yes!
getType({});            // "object"
getType(new Date());    // "date"
getType(/regex/);       // "regexp"
getType(new Map());     // "map"
getType(new Set());     // "set"
getType(function(){});  // "function"
getType(Promise.resolve()); // "promise"
```

This works because `Object.prototype.toString` returns strings like `"[object Array]"` or `"[object Null]"`. We slice off the `"[object "` and `"]"` to get just the type name.

### instanceof: Checking the Prototype Chain

`instanceof` checks if an object was created by a specific constructor:

```javascript
class Animal {}
class Dog extends Animal {}

const buddy = new Dog();

buddy instanceof Dog;     // true
buddy instanceof Animal;  // true — checks whole prototype chain
buddy instanceof Object;  // true — everything inherits from Object

[] instanceof Array;      // true
[] instanceof Object;     // true

// ⚠️ Doesn't work for primitives
"hello" instanceof String;  // false — it's a primitive, not a String object
42 instanceof Number;       // false

// But these are true (object wrappers):
new String("hello") instanceof String;  // true
new Number(42) instanceof Number;       // true
```

### Interview Challenge: What's the Output?

```javascript
console.log(typeof typeof 42);
```

Think about it before reading on...

**Answer:** `"string"`

Why? `typeof 42` returns `"number"` (a string). Then `typeof "number"` returns `"string"`. The `typeof` operator *always* returns a string.

Here's another one:

```javascript
console.log(typeof NaN);
console.log(typeof Infinity);
```

**Answer:** Both return `"number"`. Yes, "Not a Number" is a number. `NaN` is a special IEEE 754 floating-point value, and `Infinity` is how JavaScript represents mathematical infinity — both are of type `number`.

## Putting It All Together: A Robust Type Checker

Here's a utility function that handles all the edge cases:

```javascript
function typeOf(value) {
  // Handle null explicitly (typeof null === "object" bug)
  if (value === null) return "null";
  
  // Handle primitives with typeof
  const type = typeof value;
  if (type !== "object") return type;
  
  // Handle arrays
  if (Array.isArray(value)) return "array";
  
  // Handle other object types
  const objectType = Object.prototype.toString.call(value).slice(8, -1);
  return objectType.toLowerCase();
}

// Usage
typeOf(42);              // "number"
typeOf("hi");            // "string"
typeOf(null);            // "null" ✓
typeOf(undefined);       // "undefined"
typeOf([1, 2, 3]);       // "array" ✓
typeOf({ a: 1 });        // "object"
typeOf(new Date());      // "date"
typeOf(/regex/);         // "regexp"
typeOf(new Map());       // "map"
typeOf(Promise.resolve()); // "promise"
```

## How to Think About This

Think of JavaScript's type checking tools as a **hierarchy of specificity**:

1. **typeof** — Fast and simple, good for primitives, but lumps most objects together
2. **Array.isArray()** — Specifically for arrays, very reliable
3. **instanceof** — Checks prototype chain, good for custom classes
4. **Object.prototype.toString** — The "tell me exactly what you are" nuclear option

Use the simplest tool that gets the job done:

```javascript
// Checking for undefined? Use typeof
if (typeof callback === "undefined") { ... }

// Checking for a function? typeof works great
if (typeof callback === "function") { ... }

// Checking for an array? Use Array.isArray
if (Array.isArray(items)) { ... }

// Checking for your custom class? Use instanceof
if (user instanceof User) { ... }

// Need to distinguish Date from RegExp from Map? Use toString
if (getType(value) === "date") { ... }
```

> 💡 **Remember:** `typeof` is reliable for primitives (except `null`) and for detecting functions. For anything else, you'll need additional checks.

## Test Yourself

Before moving on, make sure you can answer:

- What does `typeof null` return and why?
- How do you reliably check if a value is an array?
- What's the difference between `typeof` and `instanceof`?
- Why does `typeof function(){}` return `"function"` but `typeof []` returns `"object"`?
- What does `typeof typeof x` always return, regardless of what `x` is?
- How would you check if a variable is a plain object (not an array, not null, not a Date)?

## Related Topics

- **Primitive vs Reference Types** — Understanding why `typeof` behaves differently for primitives and objects is rooted in how JavaScript stores values
- **Type Coercion** — JavaScript automatically converts types in many situations; `typeof` helps you understand what type you're starting with
- **Truthy and Falsy** — Type checking is often used alongside truthiness checks for defensive coding
- **Optional Chaining (?.)** — Modern alternative to some `typeof` checks when accessing nested properties
- **TypeScript** — If you find yourself writing lots of runtime type checks, TypeScript provides compile-time type safety

## Go Deeper

- [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) — Complete reference including the historical bug explanation
- [MDN: instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) — Understanding prototype chain checking
- [javascript.info: Type Conversions](https://javascript.info/type-conversions) — How JavaScript converts between types
- [2ality: typeof null](https://2ality.com/2013/10/typeof-null.html) — Axel Rauschmayer's deep dive into the null bug's history
- [You Don't Know JS: Types & Grammar](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/types%20%26%20grammar/ch1.md) — Kyle Simpson's thorough exploration of JavaScript's type system