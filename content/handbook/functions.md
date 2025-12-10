---
title: "Functions: Declarations, Expressions & Parameters"
description: "Master JavaScript functions — declarations vs expressions, hoisting behavior, parameter handling, default values, rest parameters, and the patterns that separate junior from senior developers."
order: 7
category: "Fundamentals"
categoryOrder: 1
keywords: ["javascript functions", "function declaration", "function expression", "arrow functions", "default parameters", "rest parameters", "hoisting", "first-class functions"]
---

# Functions: Declarations, Expressions & Parameters

Quick — what's the difference between these two?

```javascript
function greet() { }
const greet = function() { }
```

If your answer is "they're basically the same," you're in for a surprise. This subtle distinction has tripped up developers in interviews and caused real bugs in production code. The difference isn't just syntax — it's about *when* your function exists and *how* JavaScript treats it behind the scenes.

Let's untangle this once and for all.

## What Are Functions in JavaScript?

A **function** is a reusable block of code designed to perform a specific task. But here's what makes JavaScript special: functions are **first-class citizens**. This means functions are values — you can store them in variables, pass them as arguments, return them from other functions, and even add properties to them.

This isn't just a technical detail. It's the foundation of callbacks, higher-order functions, closures, and pretty much every modern JavaScript pattern you'll encounter.

## Why Do We Have Multiple Ways to Define Functions?

JavaScript has evolved significantly since 1995. The original `function` declaration was simple but had quirks (hoisting, `this` binding) that caused confusion. As developers built more complex applications, they needed:

- Functions that didn't hoist (for more predictable code)
- Shorter syntax for callbacks (hello, arrow functions)
- Better handling of `this` in nested functions
- More flexible parameter handling

Each function syntax was added to solve real problems developers were facing. Understanding when to use each one is what separates beginners from professionals.

## Let's See Them in Action

### Function Declarations

The classic way to define a function:

```javascript
function calculateTax(amount, rate) {
  return amount * rate;
}

console.log(calculateTax(100, 0.2)); // Output: 20
```

The key characteristic of declarations is **hoisting** — they're moved to the top of their scope during compilation:

```javascript
// This works! Declaration is hoisted
sayHello(); // Output: "Hello!"

function sayHello() {
  console.log("Hello!");
}
```

### Function Expressions

When you assign a function to a variable:

```javascript
const calculateTax = function(amount, rate) {
  return amount * rate;
};

console.log(calculateTax(100, 0.2)); // Output: 20
```

Expressions are **not hoisted** — the variable exists (if using `var`), but it's `undefined` until the assignment:

```javascript
// ❌ This fails!
sayHello(); // TypeError: sayHello is not a function

const sayHello = function() {
  console.log("Hello!");
};
```

### Arrow Functions (ES6)

The modern, concise syntax:

```javascript
const calculateTax = (amount, rate) => amount * rate;

console.log(calculateTax(100, 0.2)); // Output: 20
```

Arrow functions aren't just shorter — they have fundamentally different behavior with `this`:

```javascript
const counter = {
  count: 0,
  
  // Regular function: 'this' refers to counter
  incrementRegular: function() {
    setTimeout(function() {
      this.count++; // ❌ 'this' is undefined or window!
      console.log(this.count);
    }, 100);
  },
  
  // Arrow function: 'this' is inherited from parent scope
  incrementArrow: function() {
    setTimeout(() => {
      this.count++; // ✅ 'this' refers to counter
      console.log(this.count);
    }, 100);
  }
};
```

## Real-World Usage: Choosing the Right Syntax

Here's how experienced developers typically choose:

```javascript
// ✅ Declaration: For top-level, named functions
function processUserData(user) {
  // Complex logic that deserves a clear name
  const validated = validateUser(user);
  const normalized = normalizeData(validated);
  return enrichWithDefaults(normalized);
}

// ✅ Arrow: For callbacks and short operations
const users = rawUsers
  .filter(user => user.isActive)
  .map(user => user.name.toUpperCase())
  .sort((a, b) => a.localeCompare(b));

// ✅ Arrow: For methods that need parent's 'this'
class UserService {
  constructor() {
    this.users = [];
  }
  
  fetchUsers() {
    api.get('/users').then(response => {
      this.users = response.data; // 'this' works correctly
    });
  }
}

// ✅ Expression: When you need a named function for recursion or stack traces
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can reference itself by name
};
```

## Parameters: More Powerful Than You Think

### Default Parameters

No more `|| fallback` patterns:

```javascript
// ❌ Old way (has bugs!)
function greet(name) {
  name = name || "Guest"; // Fails for empty string!
  console.log(`Hello, ${name}`);
}

// ✅ Modern way
function greet(name = "Guest") {
  console.log(`Hello, ${name}`);
}

greet();          // Output: Hello, Guest
greet("Dima");    // Output: Hello, Dima
greet("");        // Output: Hello,  (empty string is valid!)
```

Default parameters can even reference previous parameters:

```javascript
function createElement(tag, id = tag + "-element") {
  return { tag, id };
}

createElement("div");       // { tag: "div", id: "div-element" }
createElement("div", "app"); // { tag: "div", id: "app" }
```

### Rest Parameters

Gather remaining arguments into an array:

```javascript
function sum(first, ...rest) {
  console.log(first); // 1
  console.log(rest);  // [2, 3, 4, 5]
  
  return rest.reduce((total, num) => total + num, first);
}

sum(1, 2, 3, 4, 5); // Output: 15
```

This replaces the old `arguments` object, which was array-*like* but not an actual array:

```javascript
// ❌ Old way: arguments is not a real array
function oldSum() {
  // arguments.reduce is not a function!
  return Array.prototype.slice.call(arguments)
    .reduce((a, b) => a + b, 0);
}

// ✅ New way: rest params are real arrays
function newSum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### Destructuring Parameters

Extract values directly in the parameter list:

```javascript
// Object destructuring with defaults
function createUser({ name, age = 18, role = "user" } = {}) {
  return { name, age, role, createdAt: Date.now() };
}

createUser({ name: "Ana" });
// { name: "Ana", age: 18, role: "user", createdAt: ... }

createUser({ name: "Dima", age: 30, role: "admin" });
// { name: "Dima", age: 30, role: "admin", createdAt: ... }

// The = {} at the end allows calling with no arguments
createUser(); // Works! (name will be undefined)
```

## Watch Out: Common Gotchas

### Gotcha #1: Hoisting Confusion

```javascript
// What does this log?
console.log(typeof foo);
console.log(typeof bar);

function foo() {}
var bar = function() {};
```

Answer: `"function"` and `"undefined"`. The declaration `foo` is fully hoisted, but only the `var bar` declaration hoists (not the assignment).

### Gotcha #2: Arrow Functions and `this`

```javascript
const button = {
  label: "Submit",
  
  // ❌ Arrow function doesn't have its own 'this'
  handleClick: () => {
    console.log(this.label); // undefined!
  },
  
  // ✅ Regular function gets 'this' from the object
  handleClickFixed: function() {
    console.log(this.label); // "Submit"
  }
};
```

### Gotcha #3: Default Parameters and Temporal Dead Zone

```javascript
// ❌ This throws an error!
function broken(a = b, b = 1) {
  return a + b;
}
broken(); // ReferenceError: Cannot access 'b' before initialization

// ✅ Order matters
function working(b = 1, a = b) {
  return a + b;
}
working(); // 2
```

### Gotcha #4: Arguments Object in Arrow Functions

```javascript
function outer() {
  const arrow = () => {
    console.log(arguments); // Uses outer's arguments!
  };
  arrow();
}

outer(1, 2, 3); // Logs: [1, 2, 3]

// Arrow functions don't have their own 'arguments'
const standalone = () => {
  console.log(arguments); // ReferenceError in strict mode!
};
```

## Interview Challenge: What's the Output?

```javascript
var x = 1;

function outer() {
  var x = 2;
  
  function inner() {
    console.log(x);
  }
  
  return inner;
}

const fn = outer();
fn();

// Bonus: What if we add this?
var x = 3;
fn();
```

**Answer:** Both calls log `2`. The function `inner` closes over the `x` from `outer`'s scope (value: 2). The global `x` is irrelevant because `inner` found `x` in its lexical scope chain. Changing global `x` to 3 doesn't affect it.

## How to Think About This

Here's a simple decision framework:

**Use function declarations when:**
- It's a primary, named function in your module
- You want it available throughout the scope (hoisting)
- It's a method you're adding to a prototype

**Use arrow functions when:**
- You're writing callbacks or array methods
- You need to preserve the parent's `this`
- You want concise, inline functions

**Use function expressions when:**
- You need a named function for recursion or debugging
- You're creating a function conditionally
- You want to explicitly prevent hoisting

> 💡 **Remember:** Arrow functions are not just short syntax — they're fundamentally different regarding `this`, `arguments`, and `new`. When in doubt about `this` binding, arrow functions inherit it; regular functions get their own.

## Test Yourself

Before moving on, make sure you can answer:

- What's the difference between a function declaration and a function expression regarding hoisting?
- Why can't you use arrow functions as constructors (with `new`)?
- What happens if you call a function with fewer arguments than parameters?
- How do rest parameters differ from the `arguments` object?
- When would you choose a function expression over a declaration?

## Related Topics

- **Closures** — Functions that "remember" their lexical scope, enabling powerful patterns like private variables
- **`this` Keyword** — Understanding how `this` is determined differently for regular vs arrow functions
- **Higher-Order Functions** — Functions that take or return other functions, foundational for functional programming
- **Hoisting** — The mechanism that moves declarations to the top of their scope during compilation

## Go Deeper

- [MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) — Comprehensive reference covering all function types and features
- [javascript.info: Functions](https://javascript.info/function-basics) — Excellent progressive tutorial from basics to advanced patterns
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md) — Deep dive into how functions interact with scope
- [ES6 In Depth: Arrow Functions](https://hacks.mozilla.org/2015/06/es6-in-depth-arrow-functions/) — Mozilla's detailed explanation of arrow function semantics