export interface JoinWaitlistOptions {
  /** Base URL of your self-hosted waitlist-email instance, e.g. "https://your-app.vercel.app" */
  baseUrl: string;
  /** The project ID you created via POST /api/projects */
  projectId: string;
  /** The email address to submit */
  email: string;
}

export interface JoinWaitlistResult {
  ok: boolean;
  status: "success" | "already_exists" | "error";
  message?: string;
}

/**
 * Submit an email to a waitlist-email project.
 *
 * @example
 * const result = await joinWaitlist({
 *   baseUrl: "https://your-app.vercel.app",
 *   projectId: "my-launch",
 *   email: "someone@example.com",
 * });
 */
export async function joinWaitlist({
  baseUrl,
  projectId,
  email,
}: JoinWaitlistOptions): Promise<JoinWaitlistResult> {
  const trimmedBaseUrl = baseUrl?.trim();
  const trimmedProjectId = projectId?.trim();
  const cleanEmail = email?.trim();

  if (!trimmedBaseUrl) {
    throw new Error("waitlist-email-react: `baseUrl` is required (your self-hosted instance URL).");
  }
  if (!trimmedProjectId) {
    throw new Error("waitlist-email-react: `projectId` is required.");
  }
  if (!cleanEmail) {
    return { ok: false, status: "error", message: "Email is required." };
  }

  const normalizedBase = /^https?:\/\//i.test(trimmedBaseUrl)
    ? trimmedBaseUrl
    : `https://${trimmedBaseUrl}`;

  const url = `${normalizedBase.replace(/\/+$/, "")}/api/collect/${encodeURIComponent(trimmedProjectId)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        typeof data?.error === "string"
          ? data.error
          : typeof data?.message === "string"
          ? data.message
          : data?.error?.message || `Request failed with status ${res.status}`;

      return {
        ok: false,
        status: "error",
        message: errorMessage,
      };
    }

    if (data?.status === "already_exists") {
      return { ok: true, status: "already_exists", message: data?.message || "You're already on the list." };
    }

    return { ok: true, status: "success", message: data?.message || "You're on the list!" };
  } catch (err) {
    return {
      ok: false,
      status: "error",
      message: err instanceof Error ? err.message : "Network error.",
    };
  }
}

