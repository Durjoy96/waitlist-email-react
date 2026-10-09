# waitlist-email-react

[![npm version](https://img.shields.io/npm/v/waitlist-email-react.svg)](https://www.npmjs.com/package/waitlist-email-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The official React component and client library for self-hosted [waitlist-email](https://github.com/Durjoy96/waitlist-email) backends.

Add a simple, reliable email waitlist to your Next.js or React site in seconds.

---

## Quick Start

### 1. Install

```bash
npm i waitlist-email-react
```

### 2. Add to your page

```tsx
import { WaitlistForm } from "waitlist-email-react/react";

export default function App() {
  return (
    <WaitlistForm
      baseUrl="https://your-backend.vercel.app"
      projectId="my-project"
    />
  );
}
```

That's it! It automatically handles submitting, loading states, validation, and feedback messages.

---

## Customization & Styling (Zero CSS / Tailwind Required)

`WaitlistForm` comes with responsive built-in inline styles so you don't need to write Tailwind CSS or external CSS files. The input field and button sit cleanly in the same row, with the input automatically expanding to take up more width than the button.

```tsx
<WaitlistForm
  baseUrl="https://your-backend.vercel.app"
  projectId="my-project"
  maxWidth="500px"
  borderRadius="8px"
  buttonColor="#2563eb"
  buttonTextColor="#ffffff"
/>
```

When the user clicks (focuses) the email input, the outline color automatically matches `buttonColor` (e.g. `#2563eb`).

---

## Props

| Prop               | Default             | Description                                                                          |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------ |
| `baseUrl` _(req)_  | —                   | Your self-hosted waitlist backend URL                                                |
| `projectId` _(req)_| —                   | Your project ID created on the backend                                               |
| `placeholder`      | `"you@example.com"` | Input placeholder text                                                               |
| `buttonLabel`      | `"Join waitlist"`   | Button label                                                                         |
| `loadingLabel`     | `"Joining..."`      | Button label while submitting                                                        |
| `successMessage`   | —                   | Custom text shown on successful email submission                                     |
| `width`            | `"100%"`            | Form width (e.g., `"100%"`, `"400px"`, `400`)                                        |
| `maxWidth`         | `"100%"`            | Form max width (e.g., `"500px"`, `500`)                                              |
| `borderRadius`     | `"8px"`             | Border radius for both input box and button (e.g., `"8px"`, `8`, `"0.5rem"`)         |
| `buttonColor`      | `"#000000"`         | Button background color. Automatically becomes input focus outline color when clicked |
| `buttonTextColor`  | `"#ffffff"`         | Button text color                                                                    |
| `showModal`        | `true`              | Displays a responsive modal popup for status feedback (success, error, already registered) |
| `onSuccess`        | —                   | Callback: `(status: "success" \| "already_exists") => void`                          |
| `onError`          | —                   | Callback: `(message: string) => void`                                                |
| `style`            | —                   | Extra inline styles for `<form>`                                                     |
| `className`        | `""`                | Extra class name for `<form>`                                                        |

---

## Headless API (Vanilla JS / TypeScript)

If you want to build your own custom form, use `joinWaitlist` directly:

```ts
import { joinWaitlist } from "waitlist-email-react";

const res = await joinWaitlist({
  baseUrl: "https://your-backend.vercel.app",
  projectId: "my-project",
  email: "user@example.com",
});

if (res.ok) {
  console.log(res.message); // "You're on the list!"
} else {
  console.error(res.message); // "Something went wrong."
}
```

---

## Backend Setup

Need a backend? Deploy your own free copy of [waitlist-email](https://github.com/Durjoy96/waitlist-email)
---

## License

[MIT](LICENSE)
