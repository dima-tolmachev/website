---
title: "Spread Operator"
description: "Master the JavaScript spread operator (...) for arrays, objects, and function calls. Learn practical patterns, common pitfalls, and the difference between spread and rest syntax."
order: 5
category: "Objects & Arrays Basics"
categoryOrder: 2
keywords: ["spread operator", "spread syntax", "javascript spread", "array spread", "object spread", "rest parameters", "shallow copy", "array destructuring"]
---

# Spread Operator

You need to merge two arrays. In the old days, you'd reach for `concat()`. You need to copy an object without mutating the original. Time for `Object.assign()`. You want to pass array elements as individual function arguments. Hello, `.apply()`.

Then ES6 gave us three little dots that changed everything: `...`

## What is the Spread Operator?

The **spread operator** (`...`) expands an iterable (like an array or string) into individual elements, or expands an object's properties into another object.

Think of it as "unpacking" a container. When you write `...array`, you're saying "take everything out of this array and spread it here." It's the opposite of gathering things together — it's scattering them apart.

```javascript
const numbers = [1, 2, 3];
console.log(...numbers); // Output: 1 2 3 (not an array, just individual values)
```

## Why Does This Exist?

Before ES6, JavaScript developers had to use clunky workarounds for common operations:

```javascript
// Merging arrays (the old way)
var merged = array1.concat(array2);

// Copying an array (the old way)
var copy = array.slice();

// Passing array as function arguments (the old way)
Math.max.apply(null, numbers);

// Copying objects (the old way)
var copy = Object.assign({}, original);
```

These approaches worked, but they weren't intuitive. The spread operator provides a cleaner, more readable syntax that makes your intent immediately clear. When you see `...`, you instantly know something is being expanded.

## Let's See It in Action

### Basic Example: Spreading Arrays

```javascript
const fruits = ["apple", "banana"];
const vegetables = ["carrot", "tomato"];

// Combine arrays
const groceries = [...fruits, ...vegetables];
console.log(groceries); // Output: ["apple", "banana", "carrot", "tomato"]

// Add items while spreading
const moreGroceries = ["bread", ...fruits, "milk"];
console.log(moreGroceries); // Output: ["bread", "apple", "banana", "milk"]
```

Notice how you can place spread items anywhere in the new array — beginning, middle, or end. This flexibility is something `concat()` couldn't offer as elegantly.

### Real-World Usage: Immutable State Updates

In React (or any state management), you never want to mutate state directly. Spread makes immutable updates clean:

```javascript
// ❌ Bad: Mutating state directly
state.users.push(newUser);

// ✅ Good: Creating a new array with spread
const updatedUsers = [...state.users, newUser];

// Updating an object immutably
const updatedUser = {
  ...user,
  name: "New Name",  // Override specific property
  lastModified: Date.now()
};

// Nested update (combining patterns)
const updatedState = {
  ...state,
  users: [...state.users, newUser],
  metadata: {
    ...state.metadata,
    count: state.metadata.count + 1
  }
};
```

This pattern is everywhere in modern React, Redux, and other state management libraries.

### Spreading Objects

Object spread works similarly, copying all enumerable properties:

```javascript
const defaults = {
  theme: "dark",
  fontSize: 14,
  showSidebar: true
};

const userPreferences = {
  fontSize: 18
};

// Merge objects (later properties override earlier ones)
const settings = { ...defaults, ...userPreferences };
console.log(settings);
// Output: { theme: "dark", fontSize: 18, showSidebar: true }
```

> 💡 **Order matters!** Properties spread later override earlier ones with the same key. This is how you create "defaults with overrides" patterns.

### Watch Out: Shallow Copy Only

This is the gotcha that catches almost everyone:

```javascript
const original = {
  name: "Dima",
  address: {
    city: "Kyiv",
    country: "Ukraine"
  }
};

// Spread creates a SHALLOW copy
const copy = { ...original };

// Modify nested object
copy.address.city = "Lviv";

// 😱 Original is also modified!
console.log(original.address.city); // Output: "Lviv"
```

Why does this happen? Spread only copies one level deep. For nested objects, it copies the *reference*, not the actual object. Both `original.address` and `copy.address` point to the same object in memory.

Here's how to handle deep copies:

```javascript
// Option 1: Spread nested objects too (manual)
const deepCopy = {
  ...original,
  address: { ...original.address }
};

// Option 2: Use structuredClone (modern browsers)
const deepCopy = structuredClone(original);

// Option 3: JSON trick (loses functions, dates, undefined)
const deepCopy = JSON.parse(JSON.stringify(original));
```

### Spread with Function Arguments

Spread shines when passing array elements as individual arguments:

```javascript
const scores = [89, 92, 78, 95, 88];

// Old way
const highest = Math.max.apply(null, scores);

// With spread
const highest = Math.max(...scores);
console.log(highest); // Output: 95

// Combine with other arguments
const allScores = Math.max(100, ...scores, 75);
console.log(allScores); // Output: 100
```

### Interview Challenge: Spread vs Rest

What's the difference between these two uses of `...`?

```javascript
// Example A
const arr = [1, 2, 3];
const newArr = [...arr, 4];

// Example B  
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

**Answer:** They're actually different operators that share the same syntax!

- **Spread** (Example A): *Expands* an iterable into individual elements. Used in array literals, object literals, and function calls.
- **Rest** (Example B): *Collects* multiple elements into a single array. Used in function parameters and destructuring.

Easy way to remember: Spread *spreads out*, Rest *gathers up*.

```javascript
// SPREAD: Breaking apart (in array/object/call)
const copy = [...original];           // spread in array
const merged = { ...obj1, ...obj2 };  // spread in object
console.log(...items);                // spread in function call

// REST: Gathering together (in parameters/destructuring)
function log(...args) { }             // rest in parameters
const [first, ...others] = array;     // rest in destructuring
const { id, ...rest } = object;       // rest in destructuring
```

### Advanced: Spreading Strings

Since strings are iterable, you can spread them into character arrays:

```javascript
const word = "hello";
const letters = [...word];
console.log(letters); // Output: ["h", "e", "l", "l", "o"]

// Useful for string manipulation
const uniqueLetters = [...new Set(word)];
console.log(uniqueLetters); // Output: ["h", "e", "l", "o"]
```

### Advanced: Converting Array-Like Objects

Some objects look like arrays but aren't (like `arguments` or DOM NodeLists). Spread converts them:

```javascript
function oldSchool() {
  // arguments is array-like but not an array
  const args = [...arguments];  // Now it's a real array
  return args.map(x => x * 2);
}

// DOM NodeList to array
const divs = [...document.querySelectorAll("div")];
divs.forEach(div => div.classList.add("processed"));
```

## How to Think About This

Imagine you have a box of items. The spread operator is like **dumping the box out** onto a table. The items are no longer "in a box" — they're individual pieces you can rearrange, combine with other items, or put into a new box.

When you see `[...arr]`, read it as "a new array containing all the items dumped out of `arr`."

When you see `{...obj}`, read it as "a new object containing all the properties dumped out of `obj`."

> 💡 **Remember:** Spread creates **new containers** with **shallow copies** of contents. It never modifies the original. Nested objects share references — they're not cloned.

## Test Yourself

Before moving on, make sure you can answer:

- What's the output of `[...[[1, 2], [3, 4]]]`? Why?
- How would you merge two objects where the second overrides the first?
- Why doesn't spreading an object into an array work (`[...{a: 1}]`)?
- What's the difference between `arr.concat(newArr)` and `[...arr, ...newArr]`?
- How do you create a true deep copy of a nested object?

## Related Topics

- **Rest Parameters** — The "gathering" counterpart to spread's "scattering" — same syntax (`...`), opposite effect
- **Destructuring** — Often used together with spread/rest to extract and collect values
- **Array Methods** — Understanding when to use spread vs. `concat()`, `slice()`, etc.
- **Object.assign()** — The pre-ES6 way to merge objects, still useful for modifying in place
- **Immutability** — Spread is the foundation of immutable update patterns in React and Redux

## Go Deeper

- [MDN: Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) — The definitive reference covering all spread use cases
- [javascript.info: Rest Parameters and Spread](https://javascript.info/rest-parameters-spread) — Clear tutorial distinguishing rest from spread
- [ES6 In Depth: Rest Parameters and Defaults](https://hacks.mozilla.org/2015/05/es6-in-depth-rest-parameters-and-defaults/) — Mozilla's deep dive into the ES6 features
- [Immer.js](https://immerjs.github.io/immer/) — When spread patterns get too complex, this library provides a cleaner alternative for immutable updates