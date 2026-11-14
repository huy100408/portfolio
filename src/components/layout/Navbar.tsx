"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navItems, site } from "@/config/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useIntro } from "@/components/providers/IntroProvider";
import { BrandIcon } from "@/lib/brand-icons";
import { ease, spring } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";

const ids = navItems.map((n) => n.id);

export function Navbar() {
  const active = useActiveSection(ids);
  const { done } = useIntro();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll-aware: solid background once you leave the top, tucks away while scrolling down.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 640 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // Let the mobile menu start closing before scrolling.
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: done ? 1 : 0 }}
        transition={{ duration: 0.6, ease: ease.out, delay: done && !scrolled ? 0.9 : 0 }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 items-center justify-between rounded-full border pl-4 pr-2 transition-[max-width,background-color,border-color,box-shadow] duration-500 ease-out-expo sm:pl-5",
            scrolled
              ? "max-w-5xl border-line bg-bg/75 shadow-soft backdrop-blur-xl backdrop-saturate-150"
              : "max-w-7xl border-transparent bg-transparent",
          )}
        >
          <a href="#home" onClick={(e) => go(e, "home")} className="group flex items-center gap-2.5" aria-label={`${site.name}, back to top`}>
            <span className="grid size-7 place-items-center rounded-lg bg-fg font-mono text-[11px] font-semibold text-bg transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]">
              {site.shortName}
            </span>
            <span className="hidden text-[15px] font-semibold tracking-tight sm:inline">{site.name}</span>
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-bg-3"
                        transition={spring.snappy}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <a
              href={site.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden size-9 place-items-center rounded-full text-muted transition-colors hover:bg-bg-2 hover:text-fg sm:grid"
              aria-label="GitHub profile (opens in a new tab)"
            >
              <BrandIcon name="github" className="size-4" />
            </a>
            <ThemeToggle />
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-bg-2 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "m"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <motion.ul
              className="flex flex-col"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
            >
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    className="flex items-baseline justify-between py-3.5"
                    variants={{ hidden: { y: "100%" }, show: { y: "0%", transition: { duration: 0.6, ease: ease.out } } }}
                  >
                    <span className={cn("text-4xl font-semibold tracking-[-0.04em]", active === item.id ? "text-fg" : "text-fg/50")}>
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  </motion.a>
                </li>
              ))}
            </motion.ul>
            <motion.div
              className="mt-auto flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href={site.github.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg">GitHub</a>
              <a href={`mailto:${site.email}`} className="hover:text-fg">{site.email}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
