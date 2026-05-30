import { useCallback, useEffect, useState, type ReactNode } from "react";
import "../components/Toast/Toast.css";

const TOAST_DURATION_MS = 2500;

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => setMessage(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  const showToast = useCallback((text: string) => {
    setMessage(text);
  }, []);

  const toast: ReactNode = message ? (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  ) : null;

  return { showToast, toast };
}
