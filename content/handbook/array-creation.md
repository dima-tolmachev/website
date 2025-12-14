---
title: "Array Creation & Basic Methods"
description: "Master JavaScript array creation patterns and essential methods like push, pop, slice, splice, and more. Learn when to use each approach and avoid common pitfalls."
order: 2
category: "Objects & Arrays Basics"
categoryOrder: 2
keywords: ["javascript arrays", "array methods", "array creation", "push pop", "slice splice", "array literal", "Array.from", "array manipulation", "javascript data structures"]
---

# Array Creation & Basic Methods

Here's a question that trips up developers in interviews: what's the difference between `Array(5)` and `[5]`? One gives you an array with five empty slots, the other gives you an array containing the number five. This kind of subtle distinction is everywhere when working with arrays — and getting it wrong can lead to bugs that are surprisingly hard to track down.

Arrays are the workhorses of JavaScript. You'll use them constantly, but there's more depth to array creation and manipulation than most developers realize.

## What Are Arrays?

An **array** is an ordered collection of values, where each value has a numeric index starting from zero. Unlike objects (which use string keys), arrays maintain insertion order and provide specialized methods for adding, removing, and transforming elements.

In JavaScript, arrays are actually objects under the hood — special objects with numeric keys and a magical `length` property that updates automatically. This explains why `typeof []` returns `"object"`, not `"array"`.

## Why Do Arrays Exist?

Before arrays, managing collections meant creating numbered variables (`item1`, `item2`, `item3`...) or using objects with numeric string keys. Arrays solve this by providing:

- **Ordered storage** — items maintain their sequence
- **Dynamic sizing** — arrays grow and shrink automatically  
- **Rich methods** — built-in tools for searching, sorting, and transforming
- **Iteration support** — designed to work with loops and higher-order functions

Arrays are fundamental to almost every programming task: storing user data, managing UI state, processing API responses, handling form inputs — the list goes on.

## Creating Arrays

JavaScript offers several ways to create arrays. Each has its use case, and knowing when to use which separates beginners from experienced developers.

### Array Literals (The Default Choice)

```javascript
// Empty array
const empty = [];

// Array with initial values
const fruits = ["apple", "banana", "cherry"];

// Mixed types (valid, but usually avoid in practice)
const mixed = [1, "two", true, null, { name: "object" }];

// Nested arrays (2D array)
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(fruits[0]);    // Output: "apple"
console.log(fruits.length); // Output: 3
```

Array literals are your go-to choice 95% of the time. They're clear, concise, and leave no room for confusion.

### The Array Constructor (Handle With Care)

```javascript
// Creates an array with 5 empty slots
const fiveSlots = new Array(5);
console.log(fiveSlots.length); // Output: 5
console.log(fiveSlots[0]);     // Output: undefined

// Creates an array containing the values 1, 2, 3
const numbers = new Array(1, 2, 3);
console.log(numbers); // Output: [1, 2, 3]

// The gotcha: single number vs multiple values
const confusing = new Array(3);   // [empty × 3]
const clear = new Array(3, 4);    // [3, 4]
```

The `Array` constructor's behavior changes based on how many arguments you pass. With one numeric argument, it creates empty slots. With multiple arguments (or a single non-numeric argument), it creates an array containing those values. This inconsistency is why most style guides recommend avoiding it.

### Array.of() — The Consistent Alternative

```javascript
// Always creates an array containing the arguments
const single = Array.of(5);
console.log(single); // Output: [5]

const multiple = Array.of(1, 2, 3);
console.log(multiple); // Output: [1, 2, 3]

const mixed = Array.of("a", "b", "c");
console.log(mixed); // Output: ["a", "b", "c"]
```

`Array.of()` was added in ES6 specifically to fix the `new Array()` inconsistency. It always creates an array containing whatever arguments you pass, regardless of type or count.

### Array.from() — Converting to Arrays

```javascript
// From a string
const chars = Array.from("hello");
console.log(chars); // Output: ["h", "e", "l", "l", "o"]

// From a Set
const uniqueNumbers = new Set([1, 2, 2, 3, 3, 3]);
const arrayFromSet = Array.from(uniqueNumbers);
console.log(arrayFromSet); // Output: [1, 2, 3]

// From NodeList (common in DOM manipulation)
const divs = document.querySelectorAll("div");
const divArray = Array.from(divs);

// With a mapping function (second argument)
const doubled = Array.from([1, 2, 3], x => x * 2);
console.log(doubled); // Output: [2, 4, 6]

// Creating a range of numbers
const range = Array.from({ length: 5 }, (_, index) => index + 1);
console.log(range); // Output: [1, 2, 3, 4, 5]
```

`Array.from()` is incredibly versatile. It converts any iterable or array-like object into a true array. The optional mapping function lets you transform elements during conversion.

### Array.fill() — Initializing With Values

```javascript
// Create and fill in one step
const zeros = new Array(5).fill(0);
console.log(zeros); // Output: [0, 0, 0, 0, 0]

// Fill with any value
const greeting = new Array(3).fill("hello");
console.log(greeting); // Output: ["hello", "hello", "hello"]

// Partial fill (start index, end index)
const partial = [1, 2, 3, 4, 5].fill(0, 1, 4);
console.log(partial); // Output: [1, 0, 0, 0, 5]
```

> ⚠️ **Warning:** `fill()` uses the same reference for objects. `new Array(3).fill([])` creates three references to the *same* array, not three separate arrays. We'll cover this gotcha in detail below.

## Adding and Removing Elements

JavaScript provides methods for modifying both ends of an array, plus inserting and removing at any position.

### push() and pop() — Working With the End

```javascript
const stack = ["a", "b", "c"];

// push() adds to the end, returns new length
const newLength = stack.push("d");
console.log(stack);     // Output: ["a", "b", "c", "d"]
console.log(newLength); // Output: 4

// Push multiple values at once
stack.push("e", "f");
console.log(stack); // Output: ["a", "b", "c", "d", "e", "f"]

// pop() removes from the end, returns removed element
const removed = stack.pop();
console.log(removed); // Output: "f"
console.log(stack);   // Output: ["a", "b", "c", "d", "e"]
```

`push()` and `pop()` are fast (O(1) time complexity) because they only touch the end of the array. Use them when you need stack-like behavior (Last In, First Out).

### unshift() and shift() — Working With the Beginning

```javascript
const queue = ["b", "c", "d"];

// unshift() adds to the beginning, returns new length
queue.unshift("a");
console.log(queue); // Output: ["a", "b", "c", "d"]

// shift() removes from the beginning, returns removed element
const first = queue.shift();
console.log(first); // Output: "a"
console.log(queue); // Output: ["b", "c", "d"]
```

These are slower than `push()`/`pop()` (O(n) time complexity) because every element needs to be re-indexed. For small arrays, this doesn't matter. For large arrays with frequent operations at the beginning, consider a different data structure.

### splice() — The Swiss Army Knife

```javascript
const colors = ["red", "green", "blue", "yellow"];

// Remove 1 element at index 1
const removed = colors.splice(1, 1);
console.log(removed); // Output: ["green"]
console.log(colors);  // Output: ["red", "blue", "yellow"]

// Insert without removing (deleteCount = 0)
colors.splice(1, 0, "orange", "purple");
console.log(colors); // Output: ["red", "orange", "purple", "blue", "yellow"]

// Replace: remove 2, insert 1
colors.splice(2, 2, "pink");
console.log(colors); // Output: ["red", "orange", "pink", "yellow"]

// Negative index: count from the end
colors.splice(-1, 1); // Remove last element
console.log(colors);  // Output: ["red", "orange", "pink"]
```

The syntax is `splice(startIndex, deleteCount, ...itemsToInsert)`. It modifies the original array and returns an array of removed elements.

## Searching and Checking

### indexOf() and lastIndexOf()

```javascript
const letters = ["a", "b", "c", "b", "a"];

// Find first occurrence
console.log(letters.indexOf("b"));     // Output: 1
console.log(letters.indexOf("z"));     // Output: -1 (not found)

// Find last occurrence
console.log(letters.lastIndexOf("b")); // Output: 3
console.log(letters.lastIndexOf("a")); // Output: 4

// Start searching from a specific index
console.log(letters.indexOf("a", 1));  // Output: 4 (skips index 0)
```

Both use strict equality (`===`), so they won't find objects unless you're checking for the exact same reference.

### includes() — Simple Existence Check

```javascript
const fruits = ["apple", "banana", "cherry"];

console.log(fruits.includes("banana")); // Output: true
console.log(fruits.includes("grape"));  // Output: false

// includes() handles NaN correctly (unlike indexOf)
const weird = [1, 2, NaN, 4];
console.log(weird.indexOf(NaN));  // Output: -1 (broken!)
console.log(weird.includes(NaN)); // Output: true (correct!)
```

Use `includes()` when you just need a boolean answer. It's more readable than `indexOf(thing) !== -1` and correctly handles `NaN`.

### find() and findIndex() — Custom Search Logic

```javascript
const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: true }
];

// find() returns the first matching element
const bob = users.find(user => user.name === "Bob");
console.log(bob); // Output: { id: 2, name: "Bob", active: false }

// findIndex() returns the index of the first match
const bobIndex = users.findIndex(user => user.name === "Bob");
console.log(bobIndex); // Output: 1

// No match returns undefined (find) or -1 (findIndex)
const dave = users.find(user => user.name === "Dave");
console.log(dave); // Output: undefined
```

These are essential when searching arrays of objects, where `indexOf()` and `includes()` won't help.

## Extracting and Combining

### slice() — Non-Destructive Extraction

```javascript
const original = ["a", "b", "c", "d", "e"];

// Extract from index 1 to 3 (end is exclusive)
const subset = original.slice(1, 4);
console.log(subset);   // Output: ["b", "c", "d"]
console.log(original); // Output: ["a", "b", "c", "d", "e"] (unchanged!)

// Negative indices count from the end
const lastTwo = original.slice(-2);
console.log(lastTwo); // Output: ["d", "e"]

// Clone an array
const clone = original.slice();
console.log(clone); // Output: ["a", "b", "c", "d", "e"]
```

`slice()` never modifies the original array — it returns a new array. This makes it perfect for immutable operations.

### concat() — Merging Arrays

```javascript
const first = [1, 2, 3];
const second = [4, 5, 6];

// Combine arrays
const combined = first.concat(second);
console.log(combined); // Output: [1, 2, 3, 4, 5, 6]
console.log(first);    // Output: [1, 2, 3] (unchanged!)

// Concat multiple arrays and values
const more = first.concat(second, [7, 8], 9);
console.log(more); // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Modern alternative: spread operator
const spread = [...first, ...second];
console.log(spread); // Output: [1, 2, 3, 4, 5, 6]
```

### join() — Array to String

```javascript
const words = ["JavaScript", "is", "awesome"];

console.log(words.join(" "));  // Output: "JavaScript is awesome"
console.log(words.join("-"));  // Output: "JavaScript-is-awesome"
console.log(words.join(""));   // Output: "JavaScriptisawesome"
console.log(words.join());     // Output: "JavaScript,is,awesome" (default: comma)

// Useful for building paths, CSS classes, etc.
const classes = ["btn", "btn-primary", "active"];
element.className = classes.join(" ");
```

## Watch Out: Common Mistakes

### The fill() Reference Trap

```javascript
// ❌ Broken: All rows share the same array reference
const matrix = new Array(3).fill([]);
matrix[0].push(1);
console.log(matrix);
// Output: [[1], [1], [1]] — All rows got the 1!

// ✅ Fixed: Create a new array for each row
const correctMatrix = Array.from({ length: 3 }, () => []);
correctMatrix[0].push(1);
console.log(correctMatrix);
// Output: [[1], [], []] — Only first row has the 1
```

`fill()` doesn't call a function for each slot — it assigns the same value (or reference) to all slots.

### Confusing slice() and splice()

```javascript
const arr = [1, 2, 3, 4, 5];

// slice() — Returns a portion, doesn't modify original
const sliced = arr.slice(1, 3);
console.log(sliced); // Output: [2, 3]
console.log(arr);    // Output: [1, 2, 3, 4, 5] (unchanged)

// splice() — Modifies the original array
const spliced = arr.splice(1, 2);
console.log(spliced); // Output: [2, 3]
console.log(arr);     // Output: [1, 4, 5] (modified!)
```

Remember: sli**c**e **c**opies, spli**ce** **c**hanges.

### Empty Slots vs. Undefined

```javascript
// Empty slots (sparse array)
const sparse = new Array(3);
console.log(sparse);        // Output: [empty × 3]
console.log(0 in sparse);   // Output: false

// Array with undefined values
const withUndefined = [undefined, undefined, undefined];
console.log(withUndefined); // Output: [undefined, undefined, undefined]
console.log(0 in withUndefined); // Output: true

// Empty slots behave differently with methods
sparse.forEach(x => console.log(x));        // Logs nothing!
withUndefined.forEach(x => console.log(x)); // Logs three "undefined"
```

Empty slots are skipped by most array methods (`map`, `filter`, `forEach`), while `undefined` values are processed normally.

### Checking if Something is an Array

```javascript
const arr = [1, 2, 3];
const obj = { length: 3 };
const str = "hello";

// ❌ typeof doesn't work
console.log(typeof arr); // Output: "object"
console.log(typeof obj); // Output: "object"

// ✅ Use Array.isArray()
console.log(Array.isArray(arr)); // Output: true
console.log(Array.isArray(obj)); // Output: false
console.log(Array.isArray(str)); // Output: false
```

## How to Think About This

Think of an array as a **numbered list** where the numbers start at zero. Every item has an address (its index), and you can access any item directly if you know its address.

When choosing between array methods, ask yourself two questions:

1. **Do I want to modify the original array or get a new one?**
   - Modifying: `push`, `pop`, `shift`, `unshift`, `splice`, `fill`
   - New array: `slice`, `concat`, `map`, `filter` (covered in next article)

2. **Where do I need to operate?**
   - End of array: `push`, `pop` (fast)
   - Beginning: `unshift`, `shift` (slower)
   - Middle/anywhere: `splice`, `slice`

> 💡 **Remember:** Methods ending in a verb (push, pop, shift) tend to modify the array. Methods with noun-like names (slice, concat) tend to return new arrays.

## Test Yourself

Before moving on, make sure you can answer:

- What's the difference between `Array(5)` and `Array.of(5)`?
- Why does `new Array(3).fill({})` create a problem?
- What's the time complexity difference between `push()` and `unshift()`?
- How do you correctly check if a value is an array?
- What does `splice()` return, and how does it differ from `slice()`?
- Why does `[1, NaN, 3].indexOf(NaN)` return `-1`?

## Related Topics

- **Array Iteration Methods** — `map`, `filter`, `reduce`, and other transformations build on these basics
- **Spread Operator** — Modern syntax for copying and merging arrays (`[...arr]`)
- **Destructuring** — Extract array elements into variables (`const [first, second] = arr`)
- **Typed Arrays** — Fixed-length arrays for binary data and performance-critical code
- **Reference vs. Value** — Understanding why `fill([])` doesn't work as expected

## Go Deeper

- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) — Comprehensive reference for all array methods
- [javascript.info: Arrays](https://javascript.info/array) — Excellent tutorial with interactive exercises
- [javascript.info: Array Methods](https://javascript.info/array-methods) — Deep dive into the complete method list
- [Axel Rauschmayer: Arrays in ES6](https://2ality.com/2014/05/es6-array-methods.html) — Thorough coverage of modern array features