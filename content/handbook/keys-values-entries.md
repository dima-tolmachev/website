---
title: "Object.keys, Object.values, Object.entries"
description: "Master JavaScript's object iteration methods. Learn how to extract keys, values, and key-value pairs from objects with practical examples and common gotchas."
order: 6
category: "Objects & Arrays Basics"
categoryOrder: 2
keywords: ["object.keys", "object.values", "object.entries", "javascript objects", "object iteration", "object methods", "iterate object", "object to array"]
---

# Object.keys, Object.values, Object.entries

You have an object. You need to loop through it. You reach for `for...in` and suddenly you're dealing with inherited properties, prototype chain issues, and `hasOwnProperty` checks everywhere. There had to be a better way.

In ES2017, JavaScript gave us three elegant methods that turn objects into arrays you can actually work with: `Object.keys()`, `Object.values()`, and `Object.entries()`. Let's see why they've become essential tools in every developer's toolkit.

## What Are These Methods?

These three static methods on the `Object` constructor each give you a different "view" of an object as an array:

- **`Object.keys(obj)`** — Returns an array of the object's own enumerable property *names* (the keys)
- **`Object.values(obj)`** — Returns an array of the object's own enumerable property *values*
- **`Object.entries(obj)`** — Returns an array of `[key, value]` pairs

The key word here is **own**. These methods only return properties that belong directly to the object, not inherited ones from the prototype chain. And they only return **enumerable** properties — the ones that would show up in a `for...in` loop.

## Why Do These Exist?

Before these methods, iterating over an object was awkward:

```javascript
// The old way — verbose and error-prone
const user = { name: "Dima", role: "developer" };

for (const key in user) {
  if (user.hasOwnProperty(key)) {  // Don't forget this check!
    console.log(key, user[key]);
  }
}
```

You had to remember the `hasOwnProperty` check every time, or risk iterating over inherited properties. Plus, `for...in` gives you keys — if you wanted values or both together, you had to do extra work.

`Object.keys()` arrived in ES5, and `Object.values()` and `Object.entries()` followed in ES2017. Together, they let you convert objects to arrays, which opens up the entire arsenal of array methods: `map`, `filter`, `reduce`, `find`, and more.

## Let's See Them in Action

### Basic Example: Extracting Keys, Values, and Entries

```javascript
const product = {
  name: "Laptop",
  price: 999,
  inStock: true
};

console.log(Object.keys(product));
// Output: ["name", "price", "inStock"]

console.log(Object.values(product));
// Output: ["Laptop", 999, true]

console.log(Object.entries(product));
// Output: [["name", "Laptop"], ["price", 999], ["inStock", true]]
```

Notice how `Object.entries()` returns nested arrays — each inner array is a `[key, value]` pair. This format works beautifully with destructuring.

### Real-World Usage: Transforming and Filtering Objects

Here's where these methods really shine — combining them with array methods:

```javascript
const prices = {
  apple: 1.5,
  banana: 0.75,
  orange: 2.0,
  grape: 3.5
};

// Find all items under $2
const affordable = Object.entries(prices)
  .filter(([fruit, price]) => price < 2)
  .map(([fruit]) => fruit);

console.log(affordable);
// Output: ["apple", "banana"]

// Calculate total inventory value
const quantities = { apple: 10, banana: 25, orange: 15, grape: 8 };

const totalValue = Object.entries(prices).reduce((sum, [fruit, price]) => {
  return sum + (price * quantities[fruit]);
}, 0);

console.log(totalValue);
// Output: 91.75
```

The destructuring in the callback — `([fruit, price])` — turns each `[key, value]` pair into named variables. This pattern is everywhere in modern JavaScript.

### Converting Back to an Object

`Object.entries()` has a perfect counterpart: `Object.fromEntries()`. Together, they let you transform objects:

```javascript
const original = { a: 1, b: 2, c: 3 };

// Double all values
const doubled = Object.fromEntries(
  Object.entries(original).map(([key, value]) => [key, value * 2])
);

console.log(doubled);
// Output: { a: 2, b: 4, c: 6 }

// Filter out specific keys
const settings = { theme: "dark", fontSize: 16, debugMode: true };

const publicSettings = Object.fromEntries(
  Object.entries(settings).filter(([key]) => key !== "debugMode")
);

console.log(publicSettings);
// Output: { theme: "dark", fontSize: 16 }
```

This `entries → transform → fromEntries` pattern is the object equivalent of array's `map` and `filter`.

### Watch Out: Property Order

Object property order in JavaScript follows specific rules that can surprise you:

```javascript
const mixed = {
  b: 2,
  1: "one",
  a: 1,
  2: "two"
};

console.log(Object.keys(mixed));
// Output: ["1", "2", "b", "a"]
```

Wait, what? Here's the rule: **integer keys come first (in numeric order), then string keys (in insertion order)**.

This matters when you're relying on key order:

```javascript
// Building a form from an object? Order matters!
const formFields = {
  email: { type: "email", required: true },
  password: { type: "password", required: true },
  2: { type: "hidden" },  // This will appear FIRST
  name: { type: "text", required: false }
};

Object.entries(formFields).forEach(([field, config]) => {
  console.log(field);  // "2", "email", "password", "name" — not what you expected!
});
```

If order matters, either avoid numeric keys or use a `Map` instead.

### Watch Out: Non-Objects

What happens if you pass something that isn't an object?

```javascript
// Strings get split into characters with numeric indices
console.log(Object.keys("hello"));
// Output: ["0", "1", "2", "3", "4"]

console.log(Object.values("hello"));
// Output: ["h", "e", "l", "l", "o"]

// Numbers and booleans return empty arrays
console.log(Object.keys(42));      // Output: []
console.log(Object.values(true));  // Output: []

// null and undefined throw errors!
Object.keys(null);      // TypeError: Cannot convert undefined or null to object
Object.keys(undefined); // TypeError
```

Always validate your input if it might be `null` or `undefined`:

```javascript
const safeKeys = (obj) => Object.keys(obj ?? {});
```

### Advanced: Working with Symbols

`Object.keys()`, `Object.values()`, and `Object.entries()` silently ignore Symbol keys:

```javascript
const id = Symbol("id");
const user = {
  name: "Dima",
  [id]: 12345
};

console.log(Object.keys(user));
// Output: ["name"] — the symbol is missing!

// To get symbol keys, use:
console.log(Object.getOwnPropertySymbols(user));
// Output: [Symbol(id)]

// Or get everything with Reflect.ownKeys:
console.log(Reflect.ownKeys(user));
// Output: ["name", Symbol(id)]
```

This is usually what you want — symbols are meant for "hidden" properties. But if you need them, reach for `Reflect.ownKeys()`.

### Interview Challenge: What Does This Output?

```javascript
const proto = { inherited: "value" };
const obj = Object.create(proto);
obj.own = "property";

console.log(Object.keys(obj));
console.log(Object.values(obj));

for (const key in obj) {
  console.log(key);
}
```

<details>
<summary>Click to see the answer</summary>

```javascript
console.log(Object.keys(obj));    // ["own"]
console.log(Object.values(obj));  // ["property"]

for (const key in obj) {
  console.log(key);
}
// "own"
// "inherited"  — for...in includes inherited properties!
```

This demonstrates the key advantage of `Object.keys/values/entries` — they only return **own** properties, while `for...in` walks the entire prototype chain.

</details>

## How to Think About This

Think of these three methods as different **lenses** for viewing an object:

| Method | Returns | Use When |
|--------|---------|----------|
| `Object.keys()` | Property names | You need to know what keys exist, or iterate without values |
| `Object.values()` | Property values | You only care about the data, not the keys |
| `Object.entries()` | `[key, value]` pairs | You need both, or want to transform the object |

Here's a decision framework:

```
Need to iterate over an object?
├── Need keys only? → Object.keys()
├── Need values only? → Object.values()
├── Need both key and value? → Object.entries()
└── Need to include inherited/symbols? → for...in or Reflect.ownKeys()
```

> 💡 **Remember:** These methods return arrays, so you get immediate access to `map`, `filter`, `reduce`, `find`, and every other array method. That's their superpower.

## Test Yourself

Before moving on, make sure you can answer:

- What's the difference between `Object.keys()` and `for...in` when iterating an object?
- In what order does `Object.keys()` return properties if some keys are numbers?
- How would you create a new object with all values doubled using `Object.entries()`?
- What happens if you call `Object.keys(null)`?
- How can you get both string keys and Symbol keys from an object?

## Related Topics

- **`for...in` loops** — The older way to iterate objects; includes inherited properties unlike these methods
- **`Object.fromEntries()`** — The inverse of `Object.entries()`; converts `[key, value]` pairs back to an object
- **Maps** — If you need guaranteed insertion order or non-string keys, `Map` is often a better choice
- **Destructuring** — Essential for cleanly working with `Object.entries()` results
- **Prototype Chain** — Understanding why "own" properties matter requires knowing how inheritance works

## Go Deeper

- [MDN: Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) — Complete reference with edge cases
- [MDN: Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) — Includes browser compatibility notes
- [javascript.info: Object keys, values, entries](https://javascript.info/keys-values-entries) — Interactive examples and exercises
- [2ality: Object.entries() and Object.values()](https://2ality.com/2015/11/stage3-object-entries.html) — Axel Rauschmayer's deep dive into the ES2017 additions