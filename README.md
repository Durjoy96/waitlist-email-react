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

## Styling (Tailwind / Custom CSS)

`WaitlistForm` is unstyled by default so it fits right into your design. You can pass classes to each element:

```tsx
<WaitlistForm
  baseUrl="https://your-backend.vercel.app"
  projectId="my-project"
  className="flex flex-col gap-2 max-w-sm w-full"
  inputClassName="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  buttonClassName="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 disabled:opacity-50"
  messageClassName="text-sm mt-1 text-neutral-600"
/>
```

---

## Props

| Prop                     | Default             | Description                                                 |
| ------------------------ | ------------------- | ----------------------------------------------------------- |
| `baseUrl` _(required)_   | —                   | Your self-hosted waitlist backend URL                       |
| `projectId` _(required)_ | —                   | Your project ID created on the backend                      |
| `placeholder`            | `"you@example.com"` | Input placeholder text                                      |
| `buttonLabel`            | `"Join waitlist"`   | Button label                                                |
| `loadingLabel`           | `"Joining..."`      | Button label while submitting                               |
| `onSuccess`              | —                   | Callback: `(status: "success" \| "already_exists") => void` |
| `onError`                | —                   | Callback: `(message: string) => void`                       |
| `className`              | `""`                | Class name for `<form>`                                     |
| `inputClassName`         | `""`                | Class name for `<input>`                                    |
| `buttonClassName`        | `""`                | Class name for `<button>`                                   |
| `messageClassName`       | `""`                | Class name for `<p role="status">`                          |

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

Need a backend? Deploy your own free copy of [waitlist-email](https://github.com/Durjoy96/waitlist-email) to Vercel in 1 click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Durjoy96/waitlist-email)

---

## License

[MIT](LICENSE)
