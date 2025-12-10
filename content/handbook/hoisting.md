---
title: "Hoisting"
description: "Understanding JavaScript hoisting, how variable and function declarations are moved to the top of their scope, and avoiding common pitfalls in interviews and real code."
order: 9
category: "Fundamentals"
categoryOrder: 1
keywords: ["hoisting", "javascript hoisting", "var hoisting", "function hoisting", "temporal dead zone", "TDZ", "let const hoisting"]
---

# Hoisting

You're debugging some code and see a variable being used *before* it's declared. Your instinct says "this should crash!" — but it doesn't. Or maybe it does crash, but only sometimes, depending on whether you used `var`, `let`, or `const`. Welcome to hoisting, one of JavaScript's most misunderstood behaviors and a favorite interview topic.

Let's demystify what's actually happening under the hood.

## What is Hoisting?

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope before code execution. But here's the key insight that most explanations miss: *only the declarations are hoisted, not the initializations*.

When JavaScript compiles your code (yes, there's a compilation phase!), it makes two passes. First, it finds all declarations and sets up memory space for them. Then, it executes your code line by line. This is why you can reference things before they appear in your code — JavaScript already knows they exist.

## Why Does This Exist?

Hoisting exists because of how JavaScript was designed in its early days. Brendan Eich created JavaScript in just 10 days, and the language needed to be forgiving and flexible for non-programmers building simple web interactions.

Function hoisting was intentional — it allows you to organize code with function calls at the top and definitions at the bottom, which some developers find more readable. Variable hoisting with `var` was more of a side effect of how the compiler worked. The introduction of `let` and `const` in ES6 was partly to address the confusing behavior of `var` hoisting.

## Let's See It in Action

### Basic Example: Function Hoisting

```javascript
// This works perfectly fine
sayHello(); // Output: Hello!

function sayHello() {
  console.log("Hello!");
}
```

The entire function declaration is hoisted, including its body. That's why you can call functions before they appear in your code.

But watch what happens with function expressions:

```javascript
sayGoodbye(); // TypeError: sayGoodbye is not a function

var sayGoodbye = function() {
  console.log("Goodbye!");
};
```

Only the variable declaration (`var sayGoodbye`) is hoisted, not the function assignment. At the time of the call, `sayGoodbye` is `undefined`.

### Variable Hoisting: var vs let/const

```javascript
console.log(a); // Output: undefined
console.log(b); // ReferenceError: Cannot access 'b' before initialization
console.log(c); // ReferenceError: Cannot access 'c' before initialization

var a = 1;
let b = 2;
const c = 3;
```

Here's what JavaScript actually "sees" after hoisting:

```javascript
var a;          // Declaration hoisted, initialized to undefined
// let b;       // Hoisted but in "Temporal Dead Zone"
// const c;     // Hoisted but in "Temporal Dead Zone"

console.log(a); // undefined — exists but no value yet
console.log(b); // TDZ error!
console.log(c); // TDZ error!

a = 1;
let b = 2;      // Now b is accessible
const c = 3;    // Now c is accessible
```

### Real-World Gotcha: Hoisting in Conditionals

```javascript
function getUserRole(isAdmin) {
  if (isAdmin) {
    var role = "admin";
  } else {
    var role = "user";
  }
  return role;
}

console.log(getUserRole(true));  // Output: admin
console.log(getUserRole(false)); // Output: user
```

This works, but it's confusing. Because `var` is function-scoped (not block-scoped), both `var role` declarations are hoisted to the function's top. JavaScript sees:

```javascript
function getUserRole(isAdmin) {
  var role; // Hoisted here
  if (isAdmin) {
    role = "admin";
  } else {
    role = "user";
  }
  return role;
}
```

With `let`, you'd get a cleaner mental model:

```javascript
function getUserRole(isAdmin) {
  let role;
  if (isAdmin) {
    role = "admin";
  } else {
    role = "user";
  }
  return role;
}
```

### Watch Out: The Temporal Dead Zone (TDZ)

```javascript
let name = "Global";

function printName() {
  console.log(name); // ReferenceError!
  let name = "Local";
}

printName();
```

Wait, why doesn't it just use the global `name`? Because `let name` inside the function IS hoisted — JavaScript knows a local `name` exists. But you can't access it until the actual `let name` line executes. The period between entering the scope and the declaration is called the **Temporal Dead Zone**.

This is actually a feature, not a bug. It catches errors where you accidentally use a variable before properly initializing it.

### Interview Classic: What Gets Logged?

```javascript
var x = 1;

function foo() {
  console.log(x); // What's logged here?
  var x = 2;
  console.log(x);
}

foo();
```

**Answer:**
```
undefined
2
```

The local `var x` is hoisted within `foo()`, shadowing the global `x`. The first `console.log` sees the hoisted (but uninitialized) local `x`, which is `undefined`.

### Advanced: Class Hoisting

Classes are hoisted but remain uninitialized (like `let`/`const`):

```javascript
const dog = new Animal(); // ReferenceError: Cannot access 'Animal' before initialization

class Animal {
  constructor() {
    this.type = "animal";
  }
}
```

This is intentional — it enforces declaring classes before using them, which makes code more predictable.

### Function Declaration vs Expression in Hoisting

```javascript
// Both function name 'double' gets hoisted, but differently

console.log(double);      // [Function: double]
console.log(triple);      // undefined

function double(x) {
  return x * 2;
}

var triple = function(x) {
  return x * 3;
};

console.log(double(5));   // 10
console.log(triple(5));   // 15
```

**Function declarations** are fully hoisted (name + body).
**Function expressions** only hoist the variable name, not the function itself.

## How to Think About This

Imagine JavaScript has a two-phase process for every scope:

**Phase 1 — Setup (Compilation):**
- Find all `var` declarations → create variables with value `undefined`
- Find all `function` declarations → create functions with their full body
- Find all `let`/`const` declarations → note their existence, but put them in a "do not touch" zone

**Phase 2 — Execution:**
- Run code line by line
- When you hit a `var` assignment, update the value
- When you hit a `let`/`const` declaration, finally allow access to that variable

> 💡 **Remember:** Hoisting doesn't physically move your code anywhere. It's about when JavaScript allocates memory and makes things accessible during the two compilation phases.

## Test Yourself

Before moving on, make sure you can answer:

- What's the difference between how `var` and `let` are hoisted?
- Why can you call a function declaration before its definition, but not a function expression?
- What is the Temporal Dead Zone, and why does it exist?
- What will `console.log(typeof undeclaredVar)` output? What about `console.log(typeof declaredWithLet)` before the `let` statement?
- In what order are variables and functions hoisted when they have the same name?

## Related Topics

- **Scope** — Hoisting happens within scopes; understanding function vs block scope is essential to predicting hoisting behavior
- **Closures** — Closures capture variables after hoisting has occurred, which affects what values they "see"
- **var vs let vs const** — The different hoisting behaviors are one of the key reasons `let` and `const` were introduced
- **Execution Context** — Hoisting is part of the creation phase of execution contexts, a deeper topic for understanding JavaScript internals

## Go Deeper

- [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) — Clear official explanation with examples
- [javascript.info: Variable Scope, Closure](https://javascript.info/closure) — Covers hoisting as part of lexical environment creation
- [You Don't Know JS: Scope & Closures, Chapter 5](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch5.md) — Kyle Simpson's deep dive into "The (Not So) Secret Lifecycle of Variables"
- [2ality: Variables and Scoping in ES6](https://2ality.com/2015/02/es6-scoping.html) — Axel Rauschmayer's thorough treatment of `let`, `const`, and the TDZ