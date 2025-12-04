---
title: "State Management"
description: "Compare and master modern state management solutions including React Context, Redux, Zustand, Jotai, and React Query for data fetching."
order: 3
category: "Frameworks & Libraries"
categoryOrder: 2
keywords: ["state management", "redux", "zustand", "jotai", "react context", "react query", "global state"]
---

# State Management

Choosing the right state management solution is crucial for building scalable React applications.

## When to Use What

| Solution | Use Case |
|----------|----------|
| useState | Local component state |
| useContext | Shared state without prop drilling |
| React Query | Server state / data fetching |
| Zustand | Simple global state |
| Redux | Complex global state with devtools |
| Jotai | Atomic state management |

## React Context

Good for low-frequency updates like themes or user preferences.

```typescript
const ThemeContext = createContext<Theme>('light');

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Zustand

Minimal, fast, and scalable state management.

```typescript
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

## React Query

For server state and data fetching.

```typescript
function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

*Content coming soon...*

