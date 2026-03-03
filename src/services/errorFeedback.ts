function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength = 220): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

export function extractErrorDetail(error: unknown): string | null {
  if (error instanceof Error) {
    const detail = normalizeWhitespace(error.message.replace(/^error:\s*/i, ""));
    return detail.length > 0 ? truncate(detail) : null;
  }

  if (typeof error === "string") {
    const detail = normalizeWhitespace(error);
    return detail.length > 0 ? truncate(detail) : null;
  }

  return null;
}

export function formatErrorFeedback(
  fallbackMessage: string,
  error: unknown,
): string {
  const detail = extractErrorDetail(error);
  if (!detail) {
    return fallbackMessage;
  }

  const lowerFallback = fallbackMessage.toLowerCase();
  const lowerDetail = detail.toLowerCase();
  if (lowerFallback.includes(lowerDetail)) {
    return fallbackMessage;
  }

  return `${fallbackMessage} (${detail})`;
}
