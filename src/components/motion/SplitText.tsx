"use client";

import { motion } from "framer-motion";
import { duration, ease, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  by?: "chars" | "words";
  className?: string;
  /** Delay before the first piece starts. */
  delay?: number;
  /** Animate on mount (controlled by `play`) instead of on scroll into view. */
  play?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

/**
 * Splits text into masked words (and optionally characters) that slide up in sequence.
 * Screen readers get the plain string via aria-label; the pieces are aria-hidden.
 */
export function SplitText({ text, by = "words", className, delay = 0, play, as = "span" }: Props) {
  const Tag = motion[as];
  const words = text.split(" ");
  const each = by === "chars" ? stagger.chars : stagger.words;

  const trigger =
    play === undefined
      ? { initial: "hidden" as const, whileInView: "show" as const, viewport: inView }
      : { initial: "hidden" as const, animate: play ? ("show" as const) : ("hidden" as const) };

  let index = 0;
  return (
    <Tag
      className={cn("inline-block", className)}
      aria-label={text}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: each, delayChildren: delay } } }}
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden className="inline-block whitespace-nowrap overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          {(by === "chars" ? word.split("") : [word]).map((piece) => {
            index++;
            return (
              <motion.span
                key={index}
                className="inline-block will-change-transform"
                data-reveal
                variants={{
                  hidden: { y: "105%", rotate: by === "chars" ? 6 : 0, opacity: 0 },
                  show: {
                    y: "0%",
                    rotate: 0,
                    opacity: 1,
                    transition: { duration: duration.cinematic, ease: ease.out },
                  },
                }}
              >
                {piece}
              </motion.span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
