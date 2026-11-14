"use client";

import { useSyncExternalStore } from "react";
import { soundtrack } from "@/config/music";
import { site } from "@/config/site";
import { scrollToSection } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";

/** Current year, read in the browser so a static build never shows a stale year. */
const useYear = () =>
  useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => new Date().getFullYear(),
  );

const link = "transition-colors hover:text-fg hover:underline hover:underline-offset-2";

export function Footer() {
  const year = useYear();
  return (
    <footer className="bg-bg-2 text-[12px] leading-[1.4] text-muted">
      <div className="mx-auto max-w-[1080px] px-4 pb-24 pt-6 sm:px-6">
        <p className="border-b border-line pb-4">
          Music: “{soundtrack.title}” by {soundtrack.artist}, embedded from{" "}
          <a href={soundtrack.url} target="_blank" rel="noopener noreferrer" className={link}>
            YouTube
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          . This site was designed and built by {site.name}.
        </p>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © <span suppressHydrationWarning>{year}</span> {site.name}. {site.title}.
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <li>
              <a href={site.github.url} target="_blank" rel="noopener noreferrer" className={link}>
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
            </li>
            <li>
              <CopyButton value={site.discord} label={`Copy Discord username ${site.discord}`} bare className={`${link} gap-1`}>
                Discord: {site.discord}
              </CopyButton>
            </li>
            <li>
              <button type="button" onClick={() => scrollToSection("home")} className={link}>
                Back to top
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
