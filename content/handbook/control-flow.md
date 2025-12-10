---
title: "Control Flow"
description: "Master JavaScript control flow with if statements, switch cases, and loops. Learn when to use each, common pitfalls, and patterns that senior developers rely on."
order: 6
category: "Fundamentals"
categoryOrder: 1
keywords: ["control flow", "if statement", "switch", "loops", "for loop", "while loop", "for of", "for in", "break", "continue"]
---

# Control Flow

Every program you've ever written makes decisions. "If the user is logged in, show the dashboard. Otherwise, show the login page." "Loop through these items and render each one." Control flow is so fundamental that we barely think about it — until an interview question reveals we've been using `for...in` wrong for years, or we can't explain why `switch` uses strict equality.

Let's make sure you truly understand the tools you use every day.

## What is Control Flow?

**Control flow** is the order in which your code executes. By default, JavaScript runs top to bottom, line by line. Control flow statements let you break that pattern — making decisions, repeating actions, or skipping code entirely.

There are three main categories:
- **Conditionals** (`if`, `else`, `switch`) — Choose which code runs based on a condition
- **Loops** (`for`, `while`, `for...of`, `for...in`) — Repeat code multiple times
- **Jump statements** (`break`, `continue`, `return`) — Skip ahead or exit early

## Why Does This Exist?

Without control flow, programs would be completely linear — they'd do the exact same thing every time. Imagine a calculator that could only add 2 + 2, or a website that showed the same page to every user.

Control flow is what transforms a script into a program that can respond to input, handle different scenarios, and process collections of data. It's the difference between a recipe that says "add salt" and one that says "taste and add salt *if needed*."

## Conditionals: Making Decisions

### The `if` Statement

The most fundamental decision-making tool:

```javascript
const temperature = 22;

if (temperature > 30) {
  console.log("It's hot!");
} else if (temperature > 20) {
  console.log("It's pleasant");
} else {
  console.log("It's cold");
}
// Output: It's pleasant
```

JavaScript evaluates conditions as **truthy** or **falsy**, not just `true` or `false`. This matters:

```javascript
const username = "";

if (username) {
  console.log(`Hello, ${username}`);
} else {
  console.log("Hello, stranger");
}
// Output: Hello, stranger (empty string is falsy)
```

> 💡 **Falsy values:** `false`, `0`, `-0`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy — including `[]` and `{}`.

### Real-World Pattern: Guard Clauses

Senior developers often use early returns to avoid deep nesting:

```javascript
// ❌ Nested (harder to read)
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // Finally do the thing
        return doSomething(user);
      }
    }
  }
  return null;
}

// ✅ Guard clauses (much cleaner)
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return null;
  if (!user.hasPermission) return null;
  
  return doSomething(user);
}
```

The second version handles edge cases upfront and keeps the "happy path" at the main indentation level.

### The `switch` Statement

When you're comparing one value against many possibilities, `switch` can be cleaner than chained `if/else`:

```javascript
function getStatusMessage(status) {
  switch (status) {
    case "pending":
      return "Your order is being processed";
    case "shipped":
      return "Your order is on the way";
    case "delivered":
      return "Your order has arrived";
    default:
      return "Unknown status";
  }
}
```

### Watch Out: Fall-Through Behavior

This is a classic interview gotcha:

```javascript
const fruit = "apple";

switch (fruit) {
  case "apple":
    console.log("It's an apple");
  case "banana":
    console.log("It's a banana");
  case "orange":
    console.log("It's an orange");
}
// Output:
// It's an apple
// It's a banana
// It's an orange
```

Wait, what? Without `break`, execution "falls through" to the next case. This is rarely what you want:

```javascript
// ✅ Fixed: Add break statements
switch (fruit) {
  case "apple":
    console.log("It's an apple");
    break;
  case "banana":
    console.log("It's a banana");
    break;
  case "orange":
    console.log("It's an orange");
    break;
}
// Output: It's an apple
```

Sometimes fall-through is intentional — grouping cases that share logic:

```javascript
switch (day) {
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Weekday");
}
```

> 💡 **Remember:** `switch` uses strict equality (`===`). The string `"1"` won't match the number `1`.

## Loops: Repeating Actions

### The Classic `for` Loop

When you need precise control over iteration:

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// Output: 0, 1, 2, 3, 4
```

The three parts: initialization (`let i = 0`), condition (`i < 5`), and update (`i++`). All are optional — `for (;;)` is an infinite loop.

### `for...of`: Iterating Over Values

The modern way to loop through arrays, strings, Maps, Sets, and other iterables:

```javascript
const colors = ["red", "green", "blue"];

for (const color of colors) {
  console.log(color);
}
// Output: red, green, blue

// Works with strings too
for (const char of "Hello") {
  console.log(char);
}
// Output: H, e, l, l, o
```

This is usually what you want when iterating arrays. It's cleaner than a classic `for` loop and safer than `for...in`.

### `for...in`: Iterating Over Keys

Loops through an object's enumerable property names:

```javascript
const user = { name: "Dima", age: 30, city: "NYC" };

for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}
// Output:
// name: Dima
// age: 30
// city: NYC
```

### Watch Out: `for...in` on Arrays

This is a common mistake:

```javascript
const fruits = ["apple", "banana", "cherry"];

// ❌ Don't use for...in with arrays
for (const index in fruits) {
  console.log(index, typeof index);
}
// Output:
// 0 string
// 1 string  
// 2 string
```

Two problems: the indices are **strings**, not numbers, and `for...in` also iterates over inherited enumerable properties (which can cause bugs with modified prototypes).

```javascript
// ✅ Use for...of for arrays
for (const fruit of fruits) {
  console.log(fruit);
}
```

### `while` and `do...while`

When you don't know how many iterations you need:

```javascript
// while: Check condition first
let attempts = 0;
while (attempts < 3) {
  console.log(`Attempt ${attempts + 1}`);
  attempts++;
}

// do...while: Run at least once, then check
let input;
do {
  input = prompt("Enter 'yes' to continue");
} while (input !== "yes");
```

### Controlling Loop Flow: `break` and `continue`

`break` exits the loop entirely. `continue` skips to the next iteration:

```javascript
// Find the first even number greater than 5
const numbers = [1, 3, 4, 7, 8, 9, 12];

for (const num of numbers) {
  if (num <= 5) continue;    // Skip numbers 5 and below
  if (num % 2 === 0) {
    console.log(`Found: ${num}`);
    break;                    // Stop searching
  }
}
// Output: Found: 8
```

### Advanced: Labeled Statements

When you need to break out of nested loops:

```javascript
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outer;  // Breaks out of BOTH loops
    }
    console.log(`i=${i}, j=${j}`);
  }
}
// Output:
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
```

This is rarely used, but it's good to know it exists for those edge cases.

## Modern Alternatives: When Loops Aren't the Answer

In modern JavaScript, you often don't need explicit loops. Array methods are usually clearer:

```javascript
const numbers = [1, 2, 3, 4, 5];

// Instead of a for loop to transform
const doubled = numbers.map(n => n * 2);

// Instead of a for loop to filter
const evens = numbers.filter(n => n % 2 === 0);

// Instead of a for loop to find
const firstBig = numbers.find(n => n > 3);

// Instead of a for loop to check all
const allPositive = numbers.every(n => n > 0);
```

Use loops when you need `break`/`continue`, when performance is critical, or when the logic doesn't fit array methods cleanly.

## How to Think About This

Think of control flow as **routing traffic**:

- `if/else` is a **fork in the road** — go left or right based on a sign
- `switch` is a **roundabout with many exits** — one entry point, pick your exit
- `for` is a **lap counter** — "run this track N times"
- `while` is a **"keep going until"** sign — repeat until a condition changes
- `break` is an **emergency exit** — leave immediately
- `continue` is a **skip button** — jump to the next lap

> 💡 **Rule of thumb:** Use `for...of` for arrays, `for...in` for objects, and array methods (`.map()`, `.filter()`) when transforming data. Save classic `for` loops for when you need the index or complex iteration logic.

## Test Yourself

Before moving on, make sure you can answer:

- What are the six falsy values in JavaScript?
- What's the difference between `for...in` and `for...of`?
- Why does `switch` require `break` statements?
- What will this output: `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100) }`?
- When would you use a `do...while` instead of a `while` loop?
- How do you break out of nested loops?

## Related Topics

- **Truthy and Falsy** — Control flow depends heavily on JavaScript's type coercion rules
- **Iterators and Generators** — The protocol that powers `for...of` and allows custom iteration
- **Array Methods** — Modern functional alternatives to loops (`.map()`, `.filter()`, `.reduce()`)
- **Async Iteration** — `for await...of` for looping over async data streams

## Go Deeper

- [MDN: Control Flow and Error Handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) — Official reference covering all control structures
- [javascript.info: Loops](https://javascript.info/while-for) — Thorough tutorial with interactive examples
- [MDN: for...of vs for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) — Clear explanation of when to use each
- [2ality: Iterables and Iterators](https://2ality.com/2015/02/es6-iteration.html) — Deep dive into the iteration protocol that powers modern loops