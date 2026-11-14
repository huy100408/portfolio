"use client";

import { motion, type Variants } from "framer-motion";
import { duration, ease, inView, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  by?: "chars" | "words";
  /** "rise": pieces slide up out of a mask. "blur": pieces fade in from a soft blur (the Apple keynote look). */
  effect?: "rise" | "blur";
  className?: string;
  /** Delay before the first piece starts. */
  delay?: number;
  /** Animate on mount (controlled by `play`) instead of on scroll into view. */
  play?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
};

const pieceVariants = (effect: "rise" | "blur", chars: boolean): Variants =>
  effect === "blur"
    ? {
        hidden: { opacity: 0, y: chars ? "0.35em" : "0.25em", filter: `blur(${chars ? 16 : 10}px)` },
        show: {
          opacity: 1,
          y: "0em",
          filter: "blur(0px)",
          transition: { duration: duration.cinematic, ease: ease.out },
        },
      }
    : {
        hidden: { y: "105%", rotate: chars ? 6 : 0, opacity: 0 },
        show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: duration.cinematic, ease: ease.out } },
      };

/**
 * Splits text into words (and optionally characters) that animate in sequence.
 * Screen readers get the plain string via aria-label; the pieces are aria-hidden.
 */
export function SplitText({ text, by = "words", effect = "rise", className, delay = 0, play, as = "span", id }: Props) {
  const Tag = motion[as];
  const words = text.split(" ");
  const chars = by === "chars";
  const each = chars ? stagger.chars : stagger.words;
  const variants = pieceVariants(effect, chars);

  const trigger =
    play === undefined
      ? { initial: "hidden" as const, whileInView: "show" as const, viewport: inView }
      : { initial: "hidden" as const, animate: play ? ("show" as const) : ("hidden" as const) };

  let index = 0;
  return (
    <Tag
      id={id}
      className={cn(as === "span" && "inline-block", className)}
      aria-label={text}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: each, delayChildren: delay } } }}
    >
      {words.map((word, w) => (
        <span
          key={w}
          aria-hidden
          className={cn(
            "inline-block whitespace-nowrap",
            // The rise effect slides out of a mask; the blur effect needs room for the blur to spread.
            effect === "rise" && "overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom",
          )}
        >
          {(chars ? word.split("") : [word]).map((piece) => {
            index++;
            return (
              <motion.span key={index} className="inline-block will-change-transform" data-reveal variants={variants}>
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
