---
title: "Scope (Global, Function, Block)"
description: "Understanding JavaScript scope - how variables are accessed and organized through global, function, and block scope. Master variable visibility and avoid common scoping pitfalls."
order: 8
category: "Fundamentals"
categoryOrder: 1
keywords: ["javascript scope", "global scope", "function scope", "block scope", "lexical scope", "var let const", "variable hoisting", "scope chain"]
---

# Scope (Global, Function, Block)

Have you ever declared a variable and then been baffled when it's `undefined` somewhere else in your code? Or accidentally overwritten a variable you didn't mean to touch? These frustrating bugs almost always come down to one thing: not understanding how **scope** works in JavaScript.

Scope is one of those concepts that seems simple until it isn't. Let's make sure you never get tripped up by it again.

## What is Scope?

**Scope** determines where variables are accessible in your code. Think of it as the "visibility" or "reach" of a variable — where can you use it, and where is it invisible?

When you declare a variable, JavaScript doesn't just throw it into one big bucket. Instead, it places the variable in a specific scope, and only code within that scope (or nested inside it) can access it. This is what allows you to use the same variable name `i` in multiple `for` loops without them interfering with each other.

JavaScript has three types of scope:
- **Global scope** — accessible everywhere
- **Function scope** — accessible only inside a function
- **Block scope** — accessible only inside a `{ }` block (with `let` and `const`)

## Why Does This Exist?

Imagine if every variable you ever declared was accessible from everywhere in your program. Chaos. You'd constantly be worried about naming conflicts, accidentally overwriting values, and tracking down bugs across thousands of lines of code.

Scope solves this by creating boundaries. It lets you:
- **Encapsulate** code so internal details don't leak out
- **Reuse** variable names safely in different contexts
- **Prevent** accidental modifications to data
- **Reason** about code locally without knowing the entire codebase

Early JavaScript only had global and function scope (using `var`). This led to many bugs, especially in loops and callbacks. ES6 (2015) introduced `let` and `const` with block scope, finally giving developers the control they needed.

## Let's See It in Action

### Global Scope

Variables declared outside any function or block live in the global scope. They're accessible from anywhere in your code.

```javascript
// Global scope
const appName = "MyApp";
let userCount = 0;

function greetUser() {
  // Can access global variables here
  console.log(`Welcome to ${appName}!`);
  userCount++;
}

greetUser();
console.log(userCount); // Output: 1
```

In browsers, global variables become properties of the `window` object:

```javascript
var legacyGlobal = "I'm on window";
console.log(window.legacyGlobal); // Output: I'm on window

// But let and const don't attach to window
let modernGlobal = "I'm not on window";
console.log(window.modernGlobal); // Output: undefined
```

> ⚠️ **Warning:** Global variables are generally considered bad practice. They create hidden dependencies, make testing harder, and can be accidentally overwritten. Use them sparingly.

### Function Scope

Variables declared inside a function are only accessible within that function. This is true for `var`, `let`, and `const`.

```javascript
function calculateTotal(items) {
  // These variables only exist inside this function
  const taxRate = 0.08;
  let subtotal = 0;
  
  for (const item of items) {
    subtotal += item.price;
  }
  
  const total = subtotal * (1 + taxRate);
  return total;
}

const result = calculateTotal([{ price: 10 }, { price: 20 }]);
console.log(result); // Output: 32.4

// These would throw ReferenceError:
// console.log(taxRate);   // ❌ taxRate is not defined
// console.log(subtotal);  // ❌ subtotal is not defined
```

Each function call creates a **new scope**. Variables from one call don't interfere with another:

```javascript
function counter() {
  let count = 0;
  count++;
  return count;
}

console.log(counter()); // Output: 1
console.log(counter()); // Output: 1 (fresh scope each time)
console.log(counter()); // Output: 1
```

### Block Scope (The Game Changer)

This is where `let` and `const` differ from `var`. Block scope means variables are confined to the nearest `{ }` — whether that's an `if` statement, a `for` loop, or just bare braces.

```javascript
if (true) {
  var varVariable = "I escape blocks!";
  let letVariable = "I stay in my block";
  const constVariable = "Me too";
}

console.log(varVariable);   // Output: I escape blocks!
console.log(letVariable);   // ❌ ReferenceError: letVariable is not defined
console.log(constVariable); // ❌ ReferenceError: constVariable is not defined
```

This is especially important in loops:

```javascript
for (let i = 0; i < 3; i++) {
  // Each iteration gets its own 'i'
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

for (var j = 0; j < 3; j++) {
  // Only ONE 'j' shared across all iterations
  setTimeout(() => console.log(j), 100);
}
// Output: 3, 3, 3
```

### Scope Chain: Looking Up Variables

When you reference a variable, JavaScript looks for it in the current scope first. If it's not there, it looks in the outer scope, then the next outer scope, all the way up to global. This is the **scope chain**.

```javascript
const global = "I'm global";

function outer() {
  const outerVar = "I'm in outer";
  
  function inner() {
    const innerVar = "I'm in inner";
    
    // JavaScript looks up the scope chain:
    console.log(innerVar);  // Found in current scope
    console.log(outerVar);  // Found in outer's scope
    console.log(global);    // Found in global scope
  }
  
  inner();
}

outer();
// Output:
// I'm in inner
// I'm in outer
// I'm global
```

The lookup only goes **outward**, never inward:

```javascript
function outer() {
  function inner() {
    const secret = "You can't see me from outer";
  }
  
  inner();
  console.log(secret); // ❌ ReferenceError
}
```

### Watch Out: Variable Shadowing

When you declare a variable with the same name in an inner scope, it **shadows** the outer variable:

```javascript
const name = "Global";

function greet() {
  const name = "Function"; // Shadows the global 'name'
  
  if (true) {
    const name = "Block"; // Shadows the function 'name'
    console.log(name);    // Output: Block
  }
  
  console.log(name);      // Output: Function
}

greet();
console.log(name);        // Output: Global
```

This can be intentional (useful for isolation) or a bug (you meant to use the outer variable). Be careful with common names like `data`, `result`, `error`, etc.

### Watch Out: The Temporal Dead Zone (TDZ)

Unlike `var`, which is hoisted and initialized to `undefined`, `let` and `const` are hoisted but **not initialized**. Accessing them before declaration throws an error:

```javascript
// This works (but please don't do this)
console.log(varValue); // Output: undefined
var varValue = "I'm hoisted and initialized";

// This throws an error
console.log(letValue); // ❌ ReferenceError: Cannot access 'letValue' before initialization
let letValue = "I'm hoisted but not initialized";
```

The time between entering the scope and the declaration is called the **Temporal Dead Zone**:

```javascript
{
  // TDZ starts for 'myVar'
  
  console.log(myVar); // ❌ ReferenceError (we're in the TDZ)
  
  let myVar = "Now I'm alive"; // TDZ ends
  
  console.log(myVar); // Output: Now I'm alive
}
```

### Real-World Usage: Module Pattern with IIFE

Before ES6 modules, developers used Immediately Invoked Function Expressions (IIFEs) to create private scope:

```javascript
const Counter = (function() {
  // Private variables — not accessible outside
  let count = 0;
  const MAX = 100;
  
  // Public API — returned object
  return {
    increment() {
      if (count < MAX) count++;
      return count;
    },
    decrement() {
      if (count > 0) count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
})();

Counter.increment(); // 1
Counter.increment(); // 2
Counter.getCount();  // 2
Counter.count;       // undefined — private!
Counter.MAX;         // undefined — private!
```

### Interview Classic: What Gets Logged?

```javascript
var a = 1;
function foo() {
  console.log(a); // What's logged here?
  var a = 2;
}
foo();
```

**Answer:** `undefined`

Why? Due to hoisting, the function is interpreted as:

```javascript
function foo() {
  var a;           // Declaration hoisted to top
  console.log(a);  // a exists but is undefined
  a = 2;           // Assignment stays in place
}
```

The local `a` shadows the global `a`, and the declaration is hoisted, but the assignment isn't.

## How to Think About This

Picture your code as a building with floors:

- **Global scope** is the ground floor — accessible from anywhere, but crowded and noisy
- **Function scope** is a private office — you bring what you need inside, and outsiders can't peek in
- **Block scope** is a meeting room within the office — even smaller, even more private

When you reference a variable, you first check your current room. If it's not there, you walk to the hallway (outer scope), then maybe to the lobby (global scope). You never break into someone else's private room to grab their variables.

> 💡 **Rule of thumb:** Declare variables in the narrowest scope possible. If a variable is only needed inside a `for` loop, declare it there with `let`. If it's only needed inside a function, don't make it global. Tight scope = fewer bugs.

## Test Yourself

Before moving on, make sure you can answer:

- What's the difference between function scope and block scope?
- Why does `var` in a `for` loop cause problems with async callbacks?
- What is the Temporal Dead Zone, and which keywords are affected by it?
- If you have a global variable and a local variable with the same name, which one wins?
- How does the scope chain determine where a variable is found?

## Related Topics

- **Closures** — When a function remembers variables from its outer scope, that's a closure in action. Scope is the foundation that makes closures possible.
- **Hoisting** — The behavior where declarations are "moved" to the top of their scope. Understanding hoisting requires understanding scope.
- **`this` Keyword** — While scope is about variable access, `this` is about execution context. They're related but work differently.
- **ES6 Modules** — Modules have their own scope, providing file-level encapsulation without IIFEs.

## Go Deeper

- [MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) — Concise reference with links to related concepts
- [javascript.info: Variable Scope, Closure](https://javascript.info/closure) — Excellent deep-dive with visual diagrams
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md) — Kyle Simpson's thorough treatment (free online)
- [Understanding ES6 Block Bindings](https://leanpub.com/understandinges6/read#leanpub-auto-block-bindings) — Nicholas Zakas on `let` and `const` vs `var`