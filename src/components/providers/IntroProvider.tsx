"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Tracks whether the intro loader has finished, so the hero can start its
 * entrance exactly as the loader leaves. Returning visitors (same session) and
 * reduced-motion users skip the loader, and the hero starts right away.
 */
const IntroContext = createContext<{ done: boolean; finish: () => void }>({
  done: true,
  finish: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const skip =
      document.documentElement.dataset.intro === "seen" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reading browser-only state after hydration; one extra render is intended here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (skip) setDone(true);
  }, []);

  const finish = useCallback(() => {
    setDone(true);
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    document.documentElement.dataset.intro = "seen";
  }, []);

  return <IntroContext.Provider value={{ done, finish }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
