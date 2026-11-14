"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Copies text to the clipboard and reports success for `ms` milliseconds. */
export function useCopy(ms = 1800) {
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setFailed(false);
        setCopied(text);
      } catch {
        setFailed(true);
        setCopied(null);
      }
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setCopied(null);
        setFailed(false);
      }, ms);
    },
    [ms],
  );

  return { copy, copied, failed };
}
