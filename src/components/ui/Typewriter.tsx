"use client";

import { useEffect, useState } from "react";
import { useReducedMotionPref } from "@/hooks/useMedia";

/**
 * Types `text` once, character by character, then leaves a blinking caret.
 * The full sentence is always in the DOM for screen readers and no-JS visitors;
 * the typing is purely visual (the untyped part is transparent, so nothing shifts).
 */
export function Typewriter({
  text,
  start,
  speed = 34,
  className,
}: {
  text: string;
  start: boolean;
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotionPref();
  const [count, setCount] = useState(0);
  const shown = reduce ? text.length : count;

  useEffect(() => {
    if (!start || reduce) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      i++;
      setCount(i);
      if (i < text.length) {
        // Small pauses after punctuation read more naturally.
        const ch = text[i - 1];
        timer = setTimeout(step, ch === "," || ch === "." ? speed * 6 : speed + Math.random() * 30);
      }
    };
    timer = setTimeout(step, 250);
    return () => clearTimeout(timer);
  }, [start, reduce, text, speed]);

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.slice(0, shown)}
        <span className="relative">
          <span className="animate-caret absolute -left-px top-[0.1em] h-[1.05em] w-[2px] bg-accent" />
        </span>
        <span className="text-transparent">{text.slice(shown)}</span>
      </span>
    </p>
  );
}
