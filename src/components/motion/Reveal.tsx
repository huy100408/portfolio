"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, inView, staggerParent } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "li" | "ul" | "p" | "span" | "article";
};

/** Fades/slides its content in the first time it enters the viewport. */
export function Reveal({ children, className, variants = fadeUp, delay = 0, as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay }}
      data-reveal
    >
      {children}
    </Tag>
  );
}

/** Parent that staggers any <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  each,
  delay,
  as = "div",
}: Omit<Props, "variants"> & { each?: number }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={staggerParent(each, delay)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, variants = fadeUp, as = "div" }: Omit<Props, "delay">) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={variants} data-reveal>
      {children}
    </Tag>
  );
}
