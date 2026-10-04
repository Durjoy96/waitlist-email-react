"use client";

import { useState, type FormEvent } from "react";
import { joinWaitlist } from "./index";

export interface WaitlistFormProps {
  /** Base URL of your self-hosted waitlist-email instance, e.g. "https://your-app.vercel.app" */
  baseUrl: string;
  /** The project ID you created via POST /api/projects */
  projectId: string;
  /** Placeholder text for the email input */
  placeholder?: string;
  /** Accessible label for screen readers on the email input */
  inputAriaLabel?: string;
  /** Button label while idle */
  buttonLabel?: string;
  /** Button label while submitting */
  loadingLabel?: string;
  /** Called after a successful submit (new or already-existing email) */
  onSuccess?: (status: "success" | "already_exists") => void;
  /** Called if the submit fails */
  onError?: (message: string) => void;
  /** Extra class name applied to the outer <form> */
  className?: string;
  /** Extra class name applied to the <input> */
  inputClassName?: string;
  /** Extra class name applied to the <button> */
  buttonClassName?: string;
  /** Extra class name applied to the status message <p> */
  messageClassName?: string;
}

export function WaitlistForm({
  baseUrl,
  projectId,
  placeholder = "you@example.com",
  inputAriaLabel = "Email address",
  buttonLabel = "Join waitlist",
  loadingLabel = "Joining...",
  onSuccess,
  onError,
  className = "",
  inputClassName = "",
  buttonClassName = "",
  messageClassName = "",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "already_exists" | "error" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || isLoading) return;

    setIsLoading(true);
    setStatus(null);
    setMessage(null);

    const result = await joinWaitlist({ baseUrl, projectId, email: cleanEmail });

    setIsLoading(false);
    setStatus(result.status);

    if (result.ok) {
      setMessage(result.message ?? "You're on the list!");
      setEmail("");
      onSuccess?.(result.status as "success" | "already_exists");
    } else {
      setMessage(result.message ?? "Something went wrong.");
      onError?.(result.message ?? "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label={inputAriaLabel}
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        disabled={isLoading}
        className={inputClassName}
      />
      <button type="submit" disabled={isLoading} className={buttonClassName}>
        {isLoading ? loadingLabel : buttonLabel}
      </button>
      {message && (
        <p role="status" data-status={status} className={messageClassName}>
          {message}
        </p>
      )}
    </form>
  );
}

