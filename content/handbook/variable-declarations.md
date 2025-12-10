---
title: "Variable Declarations: var, let, const"
description: "Master JavaScript variable declarations with var, let, and const. Learn scoping rules, hoisting behavior, the Temporal Dead Zone, and best practices for modern JavaScript development."
order: 1
category: "Fundamentals"
categoryOrder: 1
keywords: ["var", "let", "const", "javascript variables", "variable declaration", "block scope", "function scope", "hoisting", "temporal dead zone", "tdz", "es6 variables", "const vs let", "javascript scope"]
---

# Variable Declarations: var, let, const

You're in an interview. The interviewer asks: "What's the difference between `var`, `let`, and `const`?" You start confidently — "Well, `const` is for constants..." — and then they hit you with a follow-up: "So why can you push to a `const` array?" Suddenly you're not so sure anymore.

These three keywords look simple on the surface, but they hide some of JavaScript's most frequently misunderstood behavior. Let's untangle them.

## What Are Variable Declarations?

**Variable declarations** are how you tell JavaScript to set aside memory for storing a value. Think of them as creating labeled boxes where you can put stuff. The keywords `var`, `let`, and `const` all create these boxes — but they follow very different rules about where those boxes exist, when you can access them, and whether you can swap out their contents.

`var` is the original way (ES5 and earlier). `let` and `const` arrived in ES6 (2015) to fix some frustrating quirks. Today, `let` and `const` are the standard — you'll rarely see `var` in modern codebases except in legacy code or very specific edge cases.

## Why Does This Exist?

Before 2015, `var` was all we had. It worked, but it caused constant headaches:

- Variables declared inside `if` blocks leaked outside them
- Loop variables didn't behave how you'd expect in callbacks
- You could accidentally re-declare the same variable without errors
- Variables were "hoisted" in confusing ways

Developers built elaborate workarounds (IIFEs, anyone?). When ES6 introduced `let` and `const`, it gave us block-scoped variables that behave the way most programmers intuitively expect. The old problems didn't disappear — `var` still works the same way — but we finally had better tools.

## Let's See It in Action

### Basic Example: The Three Keywords

```javascript
var oldSchool = "I'm function-scoped";
let flexible = "I'm block-scoped";
const locked = "I'm block-scoped AND can't be reassigned";

// Reassignment
oldSchool = "New value"; // ✅ Works
flexible = "New value";  // ✅ Works
locked = "New value";    // ❌ TypeError: Assignment to constant variable
```

The key insight: `const` prevents *reassignment*, not *mutation*. More on that in a moment.

### Scope: The Fundamental Difference

```javascript
function scopeDemo() {
  if (true) {
    var varVariable = "I escape the block!";
    let letVariable = "I stay in the block.";
    const constVariable = "Me too.";
  }
  
  console.log(varVariable);   // Output: "I escape the block!"
  console.log(letVariable);   // ReferenceError: letVariable is not defined
  console.log(constVariable); // ReferenceError: constVariable is not defined
}
```

`var` is **function-scoped** — it only respects function boundaries. `let` and `const` are **block-scoped** — they respect any curly braces `{}`, including `if`, `for`, `while`, and even standalone blocks.

### Real-World Usage: Configuration and State

```javascript
// Use const for values that shouldn't change reference
const API_URL = "https://api.example.com";
const CONFIG = {
  timeout: 5000,
  retries: 3
};

// Use let for values that will be reassigned
let currentUser = null;
let isLoading = true;

async function login(credentials) {
  isLoading = true;
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    
    currentUser = await response.json(); // Reassigning let ✅
    CONFIG.lastLogin = Date.now();       // Mutating const object ✅
  } finally {
    isLoading = false;
  }
}
```

Notice that we modify `CONFIG` even though it's `const`. That's allowed because we're changing a *property*, not reassigning the variable itself.

### Watch Out: The Infamous Loop Problem

```javascript
// ❌ Classic var bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Output: 3, 3, 3
// Why? There's ONE i, and it's 3 by the time callbacks run

// ✅ Fixed with let
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
// Output: 0, 1, 2
// Why? Each iteration gets its OWN i (fresh binding per iteration)
```

This is the single most important practical difference. With `let`, each loop iteration creates a fresh variable that closures capture independently.

### Watch Out: Hoisting Behavior

```javascript
// var is hoisted and initialized as undefined
console.log(hoistedVar); // Output: undefined
var hoistedVar = "I exist";

// let/const are hoisted but NOT initialized (Temporal Dead Zone)
console.log(hoistedLet); // ReferenceError: Cannot access 'hoistedLet' before initialization
let hoistedLet = "I exist";
```

Both are technically "hoisted" (the engine knows they exist), but `let` and `const` enter a **Temporal Dead Zone (TDZ)** from the start of the block until the declaration. Accessing them in the TDZ throws an error — which is actually helpful for catching bugs.

### Advanced: The const Mutation Gotcha

```javascript
const user = {
  name: "Dima",
  scores: [95, 87, 92]
};

// All of these work ✅
user.name = "Ana";           // Mutating property
user.scores.push(100);       // Mutating array
user.email = "a@example.com"; // Adding property
delete user.scores;          // Deleting property

// This fails ❌
user = { name: "Someone else" }; // TypeError: Assignment to constant variable

// Want true immutability? Use Object.freeze (shallow)
const frozen = Object.freeze({ name: "Frozen" });
frozen.name = "Melted"; // Silently fails (or throws in strict mode)
console.log(frozen.name); // Output: "Frozen"
```

> 💡 **Remember:** `const` means "constant reference," not "constant value." The arrow points to the same box, but you can rearrange what's inside the box.

### Interview Question: What's the Output?

```javascript
let x = 1;

function foo() {
  console.log(x); // What prints here?
  let x = 2;
}

foo();
```

**Answer:** `ReferenceError: Cannot access 'x' before initialization`

Why? The `let x = 2` declaration is hoisted to the top of `foo`, creating a TDZ. Even though there's an `x` in the outer scope, the inner `x` shadows it from the start of the block — but you can't access it until the declaration line.

## How to Think About This

Here's a simple framework:

1. **Default to `const`** — If you don't need to reassign, `const` signals your intent clearly
2. **Use `let` when you need to reassign** — Loop counters, accumulators, state that changes
3. **Avoid `var` in new code** — There's almost never a good reason anymore

Think of `const` as a promise to other developers (and your future self): "This variable name will always point to the same thing." It doesn't guarantee immutability, but it does guarantee stability of reference.

For scope, remember:

- `var` respects only **function** boundaries
- `let` and `const` respect **any block** (`{}`)

> 💡 **Rule of thumb:** If you can't explain why you need `var`, use `let` or `const` instead.

## Test Yourself

Before moving on, make sure you can answer:

- What's the output of a `for` loop using `var` with `setTimeout` callbacks? Why?
- Can you add properties to an object declared with `const`? Why or why not?
- What is the Temporal Dead Zone, and which keywords are affected by it?
- Why might `var` declarations inside a block be accessible outside it?
- When would you choose `let` over `const`?

## Related Topics

- **Closures** — Understanding how `let` creates fresh bindings in loops requires understanding closures
- **Hoisting** — All declarations are hoisted, but `var`, `let`, and `const` behave differently during the "hoisting" phase
- **Block Scope vs Function Scope** — The fundamental distinction that makes `let`/`const` more predictable
- **Object.freeze() and Immutability** — If `const` doesn't make objects immutable, what does?

## Go Deeper

- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) — Complete reference including TDZ explanation
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) — Covers the "constant reference" distinction clearly
- [javascript.info: Variables](https://javascript.info/variables) — Excellent beginner-friendly walkthrough with interactive examples
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md) — Kyle Simpson's deep dive into how scope really works under the hood