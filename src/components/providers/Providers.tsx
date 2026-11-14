"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { IntroProvider } from "./IntroProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
      {/* reducedMotion="user": Framer drops transform animations when the OS asks for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <IntroProvider>{children}</IntroProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
