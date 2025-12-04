---
title: "Browser APIs & DOM"
description: "Understanding browser APIs, DOM manipulation, Web Storage, Fetch API, and other essential browser interfaces for front-end development."
order: 2
category: "Fundamentals"
categoryOrder: 1
keywords: ["browser apis", "dom", "dom manipulation", "fetch api", "web storage", "local storage", "session storage"]
---

# Browser APIs & DOM

The browser provides a rich set of APIs that enable powerful web applications. Understanding these APIs is crucial for front-end development.

## Document Object Model (DOM)

The DOM is a programming interface for HTML documents. It represents the structure of a document as a tree of nodes.

```javascript
// Selecting elements
const element = document.querySelector('.my-class');
const elements = document.querySelectorAll('div');

// Creating elements
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello World';
document.body.appendChild(newDiv);

// Event handling
element.addEventListener('click', (event) => {
  console.log('Clicked!', event.target);
});
```

## Web Storage API

Store data locally in the browser with localStorage and sessionStorage.

```javascript
// localStorage persists across sessions
localStorage.setItem('user', JSON.stringify({ name: 'John' }));
const user = JSON.parse(localStorage.getItem('user'));

// sessionStorage clears when tab closes
sessionStorage.setItem('temp', 'value');
```

## Fetch API

Modern way to make HTTP requests.

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
```

*Content coming soon...*

