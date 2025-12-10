---
title: "Basic Operators & Expressions"
description: "Master JavaScript operators and expressions — arithmetic, comparison, logical, assignment, and more. Learn operator precedence, common gotchas, and real-world patterns."
order: 5
category: "Fundamentals"
categoryOrder: 1
keywords: ["javascript operators", "expressions", "comparison operators", "logical operators", "operator precedence", "ternary operator", "nullish coalescing", "optional chaining"]
---

# Basic Operators & Expressions

Quick — what's the result of `[] + []` in JavaScript? How about `"5" - 3`? If you hesitated, you're in good company. JavaScript's operators hide some surprising behaviors that can trip up even experienced developers in interviews and production code alike.

Let's demystify operators and expressions so you can predict what JavaScript will do every single time.

## What Are Operators and Expressions?

An **expression** is any piece of code that produces a value. It could be as simple as `42` or as complex as `user?.profile?.settings?.theme ?? "dark"`.

An **operator** is a symbol that tells JavaScript to perform a specific operation on one or more values (called operands). When you write `5 + 3`, the `+` is the operator, and `5` and `3` are the operands. The entire thing — `5 + 3` — is an expression that evaluates to `8`.

Here's the key insight: expressions can be nested inside other expressions. That's why `(2 + 3) * (4 - 1)` works — each parenthesized part is an expression, and the `*` operator combines their results.

## Why Understanding Operators Deeply Matters

You might think operators are too basic to study. But consider this: operator behavior is one of the most common sources of bugs and interview questions. The difference between `==` and `===`, understanding short-circuit evaluation, knowing when `+` concatenates vs. adds — these aren't trivia. They're the foundation of writing predictable code.

JavaScript's operators also evolved over time. Newer additions like `??` (nullish coalescing) and `?.` (optional chaining) solve real problems that developers struggled with for years. Knowing the full toolkit helps you write cleaner, more intentional code.

## Let's See Them in Action

### Arithmetic Operators: The Basics

```javascript
const a = 10;
const b = 3;

console.log(a + b);   // 13 — addition
console.log(a - b);   // 7  — subtraction
console.log(a * b);   // 30 — multiplication
console.log(a / b);   // 3.333... — division (always returns float)
console.log(a % b);   // 1  — remainder (modulo)
console.log(a ** b);  // 1000 — exponentiation (10³)
```

The `%` operator is surprisingly useful — checking if a number is even (`n % 2 === 0`), cycling through arrays, or implementing wrap-around behavior.

```javascript
// Cycle through 0, 1, 2, 0, 1, 2, ...
let index = 0;
function next() {
  const current = index;
  index = (index + 1) % 3; // Wraps back to 0 after 2
  return current;
}
```

### The Tricky `+` Operator

The `+` operator does double duty: addition AND string concatenation. JavaScript decides which based on the operand types.

```javascript
// Number + Number = Addition
console.log(5 + 3);        // 8

// String + Anything = Concatenation
console.log("5" + 3);      // "53"
console.log(5 + "3");      // "53"
console.log("Hello" + " " + "World"); // "Hello World"

// Multiple operations — left to right
console.log(1 + 2 + "3");  // "33" (1+2=3, then 3+"3"="33")
console.log("1" + 2 + 3);  // "123" (all concatenation after first string)
```

But here's where it gets interesting — the `-` operator ONLY does subtraction, so it converts strings to numbers:

```javascript
console.log("5" - 3);      // 2 (string "5" becomes number 5)
console.log("5" - "3");    // 2
console.log("hello" - 3);  // NaN (can't convert "hello" to number)
```

### Comparison Operators: `==` vs `===`

This is probably the most asked-about operator distinction in JavaScript interviews.

```javascript
// === (Strict Equality) — No type conversion
console.log(5 === 5);      // true
console.log(5 === "5");    // false — different types
console.log(null === undefined); // false

// == (Loose Equality) — Converts types before comparing
console.log(5 == "5");     // true — string converted to number
console.log(null == undefined);  // true — special case
console.log(true == 1);    // true — boolean converted to number
console.log(false == 0);   // true
console.log(false == "");  // true — both convert to 0
```

**The rule is simple: always use `===` unless you have a specific reason not to.** The only common exception is checking for both `null` and `undefined` at once:

```javascript
// This catches both null and undefined
if (value == null) {
  console.log("value is null or undefined");
}

// Equivalent to:
if (value === null || value === undefined) {
  console.log("value is null or undefined");
}
```

### Logical Operators: Beyond True and False

Logical operators (`&&`, `||`, `!`) don't just return booleans — they return actual values. This enables powerful patterns.

```javascript
// && returns the first falsy value, or the last value if all truthy
console.log("hello" && 123);       // 123
console.log(0 && "hello");         // 0 (stopped at falsy)
console.log(null && undefined);    // null

// || returns the first truthy value, or the last value if all falsy
console.log("" || "default");      // "default"
console.log(0 || null || "found"); // "found"
console.log(false || 0 || "");     // "" (all falsy, returns last)

// ! converts to boolean and negates
console.log(!0);          // true
console.log(!"hello");    // false
console.log(!!"hello");   // true (double negation = convert to boolean)
```

**Real-world pattern — default values:**

```javascript
// Old way: using ||
function greet(name) {
  const displayName = name || "Guest";
  console.log(`Hello, ${displayName}!`);
}

greet("Dima");    // Hello, Dima!
greet("");        // Hello, Guest! — But what if "" is valid?
greet(0);         // Hello, Guest! — What if 0 is valid?
```

### Nullish Coalescing: The Better Default

The `??` operator only falls back when the left side is `null` or `undefined` — not other falsy values:

```javascript
// ?? only checks for null/undefined
console.log(0 ?? "default");       // 0 — zero is NOT nullish
console.log("" ?? "default");      // "" — empty string is NOT nullish  
console.log(false ?? "default");   // false
console.log(null ?? "default");    // "default"
console.log(undefined ?? "default"); // "default"

// Compare with ||
console.log(0 || "default");       // "default" — treats 0 as falsy
```

**This is the modern way to set defaults:**

```javascript
function createConfig(options) {
  return {
    timeout: options.timeout ?? 5000,   // 0 is valid
    retries: options.retries ?? 3,      // 0 is valid
    verbose: options.verbose ?? false   // false is valid
  };
}

createConfig({ timeout: 0, retries: 0, verbose: false });
// { timeout: 0, retries: 0, verbose: false } — all preserved!
```

### Optional Chaining: Safe Property Access

Before `?.`, accessing nested properties was verbose and error-prone:

```javascript
// Old way — defensive checks everywhere
const theme = user && user.profile && user.profile.settings 
  ? user.profile.settings.theme 
  : undefined;

// Modern way — optional chaining
const theme = user?.profile?.settings?.theme;
```

It works with methods and array access too:

```javascript
const user = {
  getName: () => "Dima",
  friends: ["Ana", "Bob"]
};

// Safe method call
console.log(user.getName?.());   // "Dima"
console.log(user.getAge?.());    // undefined (no error!)

// Safe array access
console.log(user.friends?.[0]);  // "Ana"
console.log(user.enemies?.[0]);  // undefined

// Combining with ??
const displayName = user?.profile?.name ?? "Anonymous";
```

### Watch Out: Operator Precedence Gotchas

```javascript
// ❌ This doesn't do what you might expect
const result = 1 + 2 * 3;
console.log(result); // 7, not 9 — multiplication first!

// ✅ Use parentheses to be explicit
const explicit = (1 + 2) * 3; // 9
```

Here's a trickier one that catches people:

```javascript
// ❌ Broken: ?? has lower precedence than ||
const value = null || undefined ?? "default";
// SyntaxError! Can't mix || and ?? without parentheses

// ✅ Fixed: be explicit
const value = (null || undefined) ?? "default"; // "default"
```

**Precedence you should memorize (highest to lowest):**

1. `()` — Grouping
2. `.` `?.` `[]` — Member access
3. `!` `typeof` — Unary operators
4. `**` — Exponentiation
5. `*` `/` `%` — Multiplication, division
6. `+` `-` — Addition, subtraction
7. `<` `>` `<=` `>=` — Comparison
8. `===` `!==` `==` `!=` — Equality
9. `&&` — Logical AND
10. `||` — Logical OR
11. `??` — Nullish coalescing
12. `? :` — Ternary
13. `=` `+=` `-=` — Assignment

### The Ternary Operator

The only operator that takes three operands:

```javascript
const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Can be chained (but be careful with readability)
const score = 85;
const grade = score >= 90 ? "A"
            : score >= 80 ? "B"
            : score >= 70 ? "C"
            : "F";
```

> ⚠️ **Careful:** Nested ternaries quickly become unreadable. If you need more than two levels, use `if/else` or a lookup object instead.

### Assignment Operators: More Than Just `=`

```javascript
let x = 10;

x += 5;   // x = x + 5  → 15
x -= 3;   // x = x - 3  → 12
x *= 2;   // x = x * 2  → 24
x /= 4;   // x = x / 4  → 6
x **= 2;  // x = x ** 2 → 36
x %= 10;  // x = x % 10 → 6

// Logical assignment (ES2021)
let user = null;
user ??= { name: "Guest" };  // Assigns only if null/undefined
console.log(user); // { name: "Guest" }

let settings = { theme: "dark" };
settings.theme ||= "light";  // Assigns only if falsy
console.log(settings.theme); // "dark" (unchanged)
```

### Interview Classic: Type Coercion Puzzles

```javascript
// What do these output?
console.log([] + []);      // "" — both convert to "", then concat
console.log([] + {});      // "[object Object]"
console.log({} + []);      // "[object Object]" (or 0 in some contexts!)
console.log(true + true);  // 2 — booleans convert to 1
console.log("3" - - "1");  // 4 — double negative, both become numbers
console.log([] == false);  // true — [] → "" → 0, false → 0
```

Don't memorize these — understand that JavaScript tries very hard to make operations work, converting types along the way. When in doubt, be explicit:

```javascript
// Be explicit about conversions
const num = Number("42");
const str = String(42);
const bool = Boolean(value);
```

## How to Think About This

Think of operators as **questions you're asking JavaScript**:

- `+` asks: "Can I add these? If not, can I concatenate them?"
- `===` asks: "Are these the exact same type AND value?"
- `==` asks: "Can these be considered equal after conversion?"
- `??` asks: "Is this null or undefined? If so, use the fallback."
- `?.` asks: "Does this exist? If not, just give me undefined."

When you're unsure what an expression will produce, break it down into these questions and apply operator precedence rules.

> 💡 **Remember:** When operators surprise you, it's almost always because of type coercion or precedence. Be explicit with parentheses and type conversions, and your code will behave predictably.

## Test Yourself

Before moving on, make sure you can answer:

- What's the difference between `==` and `===`? When would you use `==`?
- What does `"5" + 3 - 1` evaluate to and why?
- When would you use `??` instead of `||`?
- What does `a && b && c` return if `b` is falsy?
- Why does `[] == false` return true?
- What's the precedence between `&&` and `||`?

## Related Topics

- **Type Coercion** — The automatic conversion rules that operators trigger; understanding coercion is essential for predicting operator behavior
- **Truthy and Falsy Values** — The foundation for how logical operators work; knowing which values are falsy (`0`, `""`, `null`, `undefined`, `NaN`, `false`) is crucial
- **Control Flow** — Operators are used in conditions; understanding short-circuit evaluation helps write cleaner conditionals
- **Expressions vs Statements** — Knowing what produces a value (expression) vs. what performs an action (statement) clarifies where operators can be used

## Go Deeper

- [MDN: Expressions and Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators) — Comprehensive reference for all JavaScript operators
- [javascript.info: Operators](https://javascript.info/operators) — Excellent progressive tutorial with interactive examples
- [MDN: Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence) — The complete precedence table when you need to look it up
- [2ality: Nullish Coalescing](https://2ality.com/2019/08/nullish-coalescing.html) — Axel Rauschmayer's deep dive into `??` and when to use it