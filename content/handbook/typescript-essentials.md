---
title: "TypeScript Essentials"
description: "Master TypeScript for front-end development. Learn type inference, generics, utility types, and how to build type-safe React applications."
order: 2
category: "Frameworks & Libraries"
categoryOrder: 2
keywords: ["typescript", "type safety", "generics", "react typescript", "type inference", "utility types"]
---

# TypeScript Essentials

TypeScript adds type safety to JavaScript, making your code more maintainable and catching errors at compile time.

## Type Inference

TypeScript is smart about inferring types.

```typescript
// Type is inferred as number
const count = 42;

// Type is inferred as string[]
const names = ['Alice', 'Bob'];

// Type is inferred from return
function double(n: number) {
  return n * 2; // returns number
}
```

## Generics

Generics let you write reusable, type-safe code.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

## Utility Types

TypeScript provides powerful utility types.

```typescript
// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Pick specific properties
type UserName = Pick<User, 'firstName' | 'lastName'>;

// Omit specific properties
type UserWithoutId = Omit<User, 'id'>;
```

## TypeScript with React

*Content coming soon...*
