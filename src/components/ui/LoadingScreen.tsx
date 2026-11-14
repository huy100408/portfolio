"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { site } from "@/config/site";
import { ease } from "@/lib/motion";

const HOLD_MS = 1150; // time the wordmark is on screen before the curtain lifts

/**
 * Branded intro, shown once per browser session.
 * - Rendered in the server HTML so the page never flashes underneath it.
 * - Skipped instantly for returning visitors (CSS, before first paint) and with reduced motion.
 * - Click or press any key to skip.
 */
export function LoadingScreen() {
  const { finish } = useIntro();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const skip =
      document.documentElement.dataset.intro === "seen" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }
    const t = setTimeout(() => {
      setVisible(false);
      finish();
    }, HOLD_MS);
    const skipNow = () => {
      clearTimeout(t);
      setVisible(false);
      finish();
    };
    window.addEventListener("keydown", skipNow, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skipNow);
    };
  }, [finish]);

  const letters = site.name.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="intro-loader"
          key="loader"
          aria-hidden
          onClick={() => {
            setVisible(false);
            finish();
          }}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-bg"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.85, ease: ease.inOut }}
        >
          <motion.div
            className="flex flex-col items-center"
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <div className="flex text-[clamp(2.25rem,7vw,4.5rem)] font-bold tracking-[-0.035em]">
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.3em", filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: ease.out, delay: 0.05 + i * 0.03 }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </div>
            <div className="mt-7 h-[3px] w-40 overflow-hidden rounded-full bg-bg-3">
              <motion.div
                className="h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--brand-1),var(--brand-2),var(--brand-3),var(--brand-4))]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000 - 0.1, ease: ease.inOut }}
              />
            </div>
            <motion.p
              className="mt-4 text-[13px] font-semibold text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {site.title}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
