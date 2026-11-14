"use client";

import { ArrowUp } from "lucide-react";
import { useSyncExternalStore } from "react";
import { site } from "@/config/site";
import { BrandIcon } from "@/lib/brand-icons";
import { scrollToSection } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";

/** Current year, read in the browser so a static build never shows a stale year. */
const useYear = () =>
  useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => new Date().getFullYear(),
  );

export function Footer() {
  const year = useYear();
  return (
    <footer className="border-t border-line">
      <div className="container-page py-12 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em]">{site.name}</p>
            <p className="mt-1 text-muted">{site.title}</p>
          </div>
          <ul className="flex flex-wrap items-center gap-2 text-sm">
            <li>
              <a
                href={site.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 font-medium transition-colors hover:border-line-strong hover:bg-bg-2"
              >
                <BrandIcon name="github" className="size-4" /> GitHub
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center rounded-full border border-line px-3.5 py-2 font-medium transition-colors hover:border-line-strong hover:bg-bg-2"
              >
                {site.email}
              </a>
            </li>
            <li>
              <CopyButton value={site.discord} label={`Copy Discord username ${site.discord}`}>
                <span className="inline-flex items-center gap-2">
                  <BrandIcon name="discord" className="size-4" /> {site.discord}
                </span>
              </CopyButton>
            </li>
          </ul>
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-line pt-6 font-mono text-xs text-muted">
          <p>
            © <span suppressHydrationWarning>{year}</span> {site.name}
          </p>
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
          >
            Back to top <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
