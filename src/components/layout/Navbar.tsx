"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navItems, site } from "@/config/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useIntro } from "@/components/providers/IntroProvider";
import { BrandIcon } from "@/lib/brand-icons";
import { ease, spring } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";

const ids = navItems.map((n) => n.id);
/** Desktop shows the middle sections as links; Home is the logo and Contact is the blue button. */
const desktopItems = navItems.filter((n) => n.id !== "home" && n.id !== "contact");

/** Two lines that fold into an X. */
function MenuIcon({ open }: { open: boolean }) {
  const line = "absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-full bg-current transition-transform duration-500 ease-out-expo";
  return (
    <span aria-hidden className="relative block size-5">
      <span className={cn(line, "top-[7px]", open && "translate-y-[3px] rotate-45")} />
      <span className={cn(line, "top-[13px]", open && "-translate-y-[3px] -rotate-45")} />
    </span>
  );
}

export function Navbar() {
  const active = useActiveSection(ids);
  const { done } = useIntro();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const darkSections = useRef<HTMLElement[]>([]);

  useEffect(() => {
    darkSections.current = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme='dark']"));
  }, []);

  // Frosted once you leave the top, tucks away while scrolling down, and switches to the
  // dark palette while it sits over a dark section.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 640 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
    setOverDark(
      darkSections.current.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 24 && r.bottom >= 24;
      }),
    );
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
        className={cn("fixed inset-x-0 top-0 z-50 text-fg", overDark && !open && "dark")}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: hidden ? -60 : 0, opacity: done ? 1 : 0 }}
        transition={{ duration: 0.6, ease: ease.out, delay: done && !scrolled ? 0.9 : 0 }}
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color] duration-500",
            scrolled || open ? "glass border-line/60" : "border-transparent bg-transparent",
            open && "bg-bg",
          )}
        >
          <nav aria-label="Primary" className="mx-auto flex h-12 max-w-[1080px] items-center justify-between px-4 sm:px-6">
            <a
              href="#home"
              onClick={(e) => go(e, "home")}
              className="group flex items-center gap-2"
              aria-label={`${site.name}, back to top`}
            >
              <span className="grid size-6 place-items-center rounded-[7px] bg-fg text-[10px] font-bold text-bg transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-110">
                {site.shortName}
              </span>
              <span className="text-[14px] font-semibold tracking-[-0.01em]">{site.name}</span>
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {desktopItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => go(e, item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative block px-3 py-1.5 text-[13px] transition-colors duration-300",
                        isActive ? "text-fg" : "text-fg/65 hover:text-fg",
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-px h-px rounded-full bg-fg"
                          transition={spring.snappy}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-0.5">
              <a
                href={site.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden size-9 place-items-center rounded-full text-fg/70 transition-colors hover:bg-fg/5 hover:text-fg sm:grid"
                aria-label="GitHub profile (opens in a new tab)"
              >
                <BrandIcon name="github" className="size-4" />
              </a>
              <ThemeToggle />
              <a
                href="#contact"
                onClick={(e) => go(e, "contact")}
                className="ml-2 hidden h-7 items-center rounded-full bg-cta px-3.5 text-[12px] font-medium text-white transition-colors hover:bg-cta-hover sm:inline-flex"
              >
                Contact
              </a>
              <button
                type="button"
                className="-mr-2 ml-1 grid size-10 place-items-center rounded-full lg:hidden"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <MenuIcon open={open} />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg px-8 pb-10 pt-20 text-fg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="flex flex-col gap-1"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
              }}
            >
              {navItems.map((item) => (
                <li key={item.id}>
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, item.id)}
                    className={cn(
                      "block py-1.5 text-[28px] font-semibold tracking-[-0.02em] transition-colors",
                      active === item.id ? "text-fg" : "text-fg/60 hover:text-fg",
                    )}
                    variants={{
                      hidden: { opacity: 0, y: -8, filter: "blur(4px)" },
                      show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: ease.out } },
                    }}
                  >
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </motion.ul>
            <motion.div
              className="mt-auto flex flex-col gap-2 pt-10 text-[13px] text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              exit={{ opacity: 0 }}
            >
              <a href={site.github.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                GitHub
              </a>
              <a href={`mailto:${site.email}`} className="hover:text-fg">
                {site.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
