"use client";

import { useState, type FormEvent, type CSSProperties } from "react";
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
  /** Custom success message text shown on successful email submission */
  successMessage?: string;

  /** Width of the form container (e.g. "100%", "400px", 400). Default is "100%". */
  width?: string | number;
  /** Maximum width of the form container (e.g. "500px", 500). Default is "100%". */
  maxWidth?: string | number;

  /** Border radius for both input box and button (e.g. "8px", 8, "0.5rem"). Default is "8px". */
  borderRadius?: string | number;

  /** Background color of the submit button. Automatically sets the input focus outline color. Default is "#000000". */
  buttonColor?: string;
  /** Text color of the submit button. Default is "#ffffff". */
  buttonTextColor?: string;

  /** Whether to display a modal popup on submission status. Default is true. */
  showModal?: boolean;

  /** Called after a successful submit (new or already-existing email) */
  onSuccess?: (status: "success" | "already_exists") => void;
  /** Called if the submit fails */
  onError?: (message: string) => void;

  /** Custom inline styles for the outer <form> */
  style?: CSSProperties;
  /** Extra class name applied to the outer <form> */
  className?: string;
}

function formatSize(val?: string | number): string | undefined {
  if (val === undefined || val === null) return undefined;
  return typeof val === "number" ? `${val}px` : val;
}

export function WaitlistForm({
  baseUrl,
  projectId,
  placeholder = "you@example.com",
  inputAriaLabel = "Email address",
  buttonLabel = "Join waitlist",
  loadingLabel = "Joining...",
  successMessage,
  width = "100%",
  maxWidth = "100%",
  borderRadius = "8px",
  buttonColor = "#000000",
  buttonTextColor = "#ffffff",
  showModal = true,
  onSuccess,
  onError,
  style,
  className = "",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "already_exists" | "error" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedRadius = formatSize(borderRadius) ?? "8px";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || isLoading) return;

    setIsLoading(true);
    setStatus(null);
    setMessage(null);

    const result = await joinWaitlist({
      baseUrl,
      projectId,
      email: cleanEmail,
    });

    setIsLoading(false);
    setStatus(result.status);

    if (result.ok) {
      const displayMsg = successMessage ?? result.message ?? "You're on the list!";
      setMessage(displayMsg);
      setEmail("");
      onSuccess?.(result.status as "success" | "already_exists");
    } else {
      const errorMsg = result.message ?? "Something went wrong.";
      setMessage(errorMsg);
      onError?.(errorMsg);
    }

    if (showModal) {
      setIsModalOpen(true);
    }
  };

  const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: formatSize(width) ?? "100%",
    maxWidth: formatSize(maxWidth) ?? "100%",
    boxSizing: "border-box",
    ...style,
  };

  const rowStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  };

  const inputStyle: CSSProperties = {
    flex: "1 1 200px",
    minWidth: 0,
    padding: "12px 16px",
    fontSize: "15px",
    lineHeight: "22px",
    borderRadius: formattedRadius,
    border: `1.5px solid ${isFocused ? buttonColor : "#d1d5db"}`,
    outline: isFocused ? `2px solid ${buttonColor}` : "none",
    outlineOffset: "1px",
    backgroundColor: "#ffffff",
    color: "#111827",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease-in-out, outline 0.15s ease-in-out",
  };

  const buttonStyle: CSSProperties = {
    flexShrink: 0,
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: "22px",
    borderRadius: formattedRadius,
    backgroundColor: buttonColor,
    color: buttonTextColor,
    border: "none",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.7 : 1,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    transition: "opacity 0.15s ease-in-out, background-color 0.15s ease-in-out",
  };

  const inlineMessageStyle: CSSProperties = {
    fontSize: "13px",
    margin: "3px 0 0 0",
    color: status === "error" ? "#ef4444" : "#10b981",
  };

  // Modal theme styles based on status
  const getModalDetails = () => {
    if (status === "already_exists") {
      return {
        badgeBg: "#eff6ff",
        badgeColor: "#3b82f6",
        title: "Already Subscribed",
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        ),
      };
    }
    if (status === "error") {
      return {
        badgeBg: "#fef2f2",
        badgeColor: "#ef4444",
        title: "Submission Failed",
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ),
      };
    }
    return {
      badgeBg: "#ecfdf5",
      badgeColor: "#10b981",
      title: "You're on the list!",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    };
  };

  const modalDetails = getModalDetails();

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .wfe-row-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .wfe-input-field, .wfe-submit-button {
            width: 100% !important;
            flex: none !important;
          }
        }
      `}</style>
      <form onSubmit={handleSubmit} style={formStyle} className={className}>
        <div style={rowStyle} className="wfe-row-container">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            aria-label={inputAriaLabel}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={isLoading}
            style={inputStyle}
            className="wfe-input-field"
          />
          <button type="submit" disabled={isLoading} style={buttonStyle} className="wfe-submit-button">
            {isLoading ? loadingLabel : buttonLabel}
          </button>
        </div>
        {!showModal && message && (
          <p role="status" data-status={status} style={inlineMessageStyle}>
            {message}
          </p>
        )}
      </form>

      {/* Status Modal Popup */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "28px 24px",
              maxWidth: "380px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              textAlign: "center",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: modalDetails.badgeBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {modalDetails.icon}
            </div>
            <h3
              style={{
                margin: "4px 0 0 0",
                fontSize: "18px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              {modalDetails.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#4b5563",
                lineHeight: "20px",
              }}
            >
              {message}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: formattedRadius,
                backgroundColor: buttonColor,
                color: buttonTextColor,
                border: "none",
                cursor: "pointer",
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

