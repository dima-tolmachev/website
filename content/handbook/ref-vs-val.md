---
title: "Reference vs Value Behavior"
description: "Understanding how JavaScript handles primitive values and reference types, why objects behave differently than numbers, and how to avoid common mutation bugs."
order: 3
category: "Objects & Arrays Basics"
categoryOrder: 2
keywords: ["reference vs value", "pass by reference", "pass by value", "javascript primitives", "object reference", "shallow copy", "deep copy", "mutation", "immutability"]
---

# Reference vs Value Behavior

You carefully copy an object to avoid mutating the original. You make your changes. Then you check the original and... it changed too. What happened?

This is one of the most common sources of bugs in JavaScript, and it catches even experienced developers off guard. The culprit? JavaScript treats some values fundamentally differently than others — and understanding this distinction is crucial for writing predictable code.

## What's the Difference?

In JavaScript, data types fall into two categories based on how they're stored and copied:

**Primitive values** (numbers, strings, booleans, `null`, `undefined`, symbols, and BigInt) are stored directly in memory. When you copy them, you get an entirely new, independent value.

**Reference values** (objects, arrays, functions) are stored in memory, but variables hold a *reference* (like an address) pointing to that memory location. When you copy them, you're copying the address — not the actual data. Both variables now point to the same thing.

Think of it this way: primitives are like giving someone a photocopy of a document. Reference types are like giving someone directions to your house — you both end up at the same place.

## Why Does This Exist?

This design is about efficiency. Imagine you have an object with thousands of properties. If JavaScript made a complete copy every time you passed it to a function or assigned it to a variable, your program would grind to a halt, consuming massive amounts of memory.

By using references, JavaScript can pass around large data structures cheaply — just copying a small memory address instead of the entire structure. The trade-off is that you need to be conscious of when you're sharing data versus when you truly need an independent copy.

This isn't unique to JavaScript — most programming languages distinguish between value types and reference types for the same reason.

## Let's See It in Action

### Primitives: Independent Copies

```javascript
let originalScore = 100;
let copiedScore = originalScore;

copiedScore = 200;

console.log(originalScore); // Output: 100
console.log(copiedScore);   // Output: 200
```

Each variable holds its own value. Changing one has no effect on the other.

The same applies to strings:

```javascript
let greeting = "Hello";
let anotherGreeting = greeting;

anotherGreeting = "Goodbye";

console.log(greeting);        // Output: Hello
console.log(anotherGreeting); // Output: Goodbye
```

No surprises here. This is probably what you'd expect.

### Objects: Shared References

```javascript
const originalUser = { name: "Dima", role: "Developer" };
const copiedUser = originalUser;

copiedUser.role = "Senior Developer";

console.log(originalUser.role); // Output: Senior Developer
console.log(copiedUser.role);   // Output: Senior Developer
```

Both variables point to the *same object* in memory. There's only one object — just two names for it.

This catches people off guard because assignment looks the same for primitives and objects, but behaves completely differently.

### Arrays: The Same Story

```javascript
const colors = ["red", "green", "blue"];
const palette = colors;

palette.push("yellow");

console.log(colors);  // Output: ["red", "green", "blue", "yellow"]
console.log(palette); // Output: ["red", "green", "blue", "yellow"]
```

Arrays are objects in JavaScript, so they follow the same reference rules.

### Function Arguments: Pass by Value (of the Reference)

JavaScript always passes arguments by value — but for objects, that value *is* a reference:

```javascript
function updateName(user) {
  user.name = "Updated"; // Modifies the original object
}

const person = { name: "Original" };
updateName(person);

console.log(person.name); // Output: Updated
```

The function receives a *copy* of the reference, which points to the same object. So mutations inside the function affect the original.

But reassigning the parameter doesn't affect the original:

```javascript
function reassignUser(user) {
  user = { name: "Completely New" }; // Only changes local reference
}

const person = { name: "Original" };
reassignUser(person);

console.log(person.name); // Output: Original
```

The local `user` variable now points to a new object, but `person` still points to the original.

### Watch Out: The "Copying" Trap

```javascript
// ❌ This doesn't create an independent copy
const config = { theme: "dark", fontSize: 16 };
const userConfig = config;

userConfig.theme = "light";
console.log(config.theme); // Output: light — Original changed!
```

This is the classic mistake. You wanted a copy, but you got a shared reference.

**Creating actual copies:**

```javascript
// ✅ Shallow copy with spread operator
const config = { theme: "dark", fontSize: 16 };
const userConfig = { ...config };

userConfig.theme = "light";
console.log(config.theme); // Output: dark — Original preserved!
```

For arrays:

```javascript
// ✅ Shallow copy of array
const original = [1, 2, 3];
const copy = [...original];
// or: const copy = original.slice();
// or: const copy = Array.from(original);

copy.push(4);
console.log(original); // Output: [1, 2, 3] — Original preserved!
```

### The Nested Object Problem

Shallow copies only go one level deep:

```javascript
const user = {
  name: "Dima",
  preferences: {
    theme: "dark",
    notifications: true
  }
};

const userCopy = { ...user };

userCopy.name = "Ana"; // Safe — different property
userCopy.preferences.theme = "light"; // Danger! Nested object is shared

console.log(user.name);              // Output: Dima — preserved
console.log(user.preferences.theme); // Output: light — mutated!
```

The spread operator copied the reference to `preferences`, not the `preferences` object itself.

**Deep copy solutions:**

```javascript
// ✅ Modern approach: structuredClone (Node 17+, modern browsers)
const deepCopy = structuredClone(user);

// ✅ JSON trick (works for simple objects, has limitations)
const deepCopy = JSON.parse(JSON.stringify(user));

// ✅ Manual recursive copying or libraries like lodash
import { cloneDeep } from 'lodash';
const deepCopy = cloneDeep(user);
```

> ⚠️ **Warning:** The JSON method doesn't handle functions, `undefined`, Dates, Maps, Sets, or circular references. Use `structuredClone` or a library for complex objects.

### Comparing Objects and Primitives

```javascript
// Primitives compare by value
const a = 5;
const b = 5;
console.log(a === b); // Output: true

// Objects compare by reference
const obj1 = { value: 5 };
const obj2 = { value: 5 };
console.log(obj1 === obj2); // Output: false — Different objects!

const obj3 = obj1;
console.log(obj1 === obj3); // Output: true — Same reference
```

Two objects are only equal if they're literally the same object in memory. Having identical contents doesn't make them equal.

### Real-World Scenario: State Management Bug

```javascript
// ❌ React state mutation bug
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn JS", done: false }
  ]);

  const toggleTodo = (id) => {
    // Bug: Mutating state directly
    const todo = todos.find(t => t.id === id);
    todo.done = !todo.done; // Mutation!
    setTodos(todos); // Same reference — React won't re-render!
  };
}

// ✅ Correct approach: Create new references
const toggleTodo = (id) => {
  setTodos(todos.map(todo =>
    todo.id === id
      ? { ...todo, done: !todo.done } // New object
      : todo
  ));
};
```

React (and other frameworks) rely on reference equality to detect changes. If you mutate an object and pass the same reference, it looks like nothing changed.

## How to Think About This

Imagine variables as **labels on boxes**.

For primitives, each label points to its own box containing the actual value. Copy the variable? You get a new box with a copy of the value inside.

For objects, the box contains a **map with directions** to where the treasure (your data) is buried. Copy the variable? You get a new box, but inside is a copy of the same map — both leading to the exact same treasure.

To get independent data, you need to actually dig up the treasure and rebury it somewhere new (make a real copy).

> 💡 **Remember:** Assignment (`=`) never copies objects. It only copies the reference. To get an independent copy, you must explicitly create one.

## Quick Reference: Copying Methods

| Method | Depth | Arrays | Objects | Notes |
|--------|-------|--------|---------|-------|
| `=` assignment | None | ❌ | ❌ | Just copies reference |
| `[...arr]` | Shallow | ✅ | - | Arrays only |
| `arr.slice()` | Shallow | ✅ | - | Arrays only |
| `{...obj}` | Shallow | - | ✅ | Objects only |
| `Object.assign({}, obj)` | Shallow | - | ✅ | Objects only |
| `structuredClone()` | Deep | ✅ | ✅ | Modern, handles most types |
| `JSON.parse(JSON.stringify())` | Deep | ✅ | ✅ | No functions, undefined, circular refs |

## Test Yourself

Before moving on, make sure you can answer:

- Why does changing a "copied" object also change the original?
- What's the difference between a shallow copy and a deep copy?
- Why does `{} === {}` return `false`?
- How does JavaScript pass objects to functions — by value or by reference?
- When would you need `structuredClone()` instead of the spread operator?

## Related Topics

- **Primitive vs Reference Types** — The foundation for understanding this behavior; primitives are immutable, references point to mutable data
- **Immutability Patterns** — Working with reference types in ways that avoid accidental mutation
- **Equality Operators** — How `===` compares references for objects but values for primitives
- **Memory Management** — How JavaScript allocates and garbage-collects reference types
- **React State Updates** — Relies heavily on understanding reference equality for efficient re-renders

## Go Deeper

- [MDN: Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) — Official documentation on primitive values and their behavior
- [javascript.info: Object References and Copying](https://javascript.info/object-copy) — Excellent walkthrough with interactive examples
- [Just JavaScript: Values and Variables](https://justjavascript.com/) — Dan Abramov's mental model course that visualizes this beautifully
- [You Don't Know JS: Types & Grammar](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/types-grammar/README.md) — Kyle Simpson's deep dive into JavaScript's type system