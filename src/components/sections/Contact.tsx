"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { CopyButton } from "@/components/ui/CopyButton";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { BrandIcon } from "@/lib/brand-icons";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="animated-border flex h-full flex-col rounded-2xl border border-line bg-bg p-6 transition-shadow duration-500 hover:shadow-lift sm:p-7">
      {children}
    </div>
  );
}

export function Contact({ index = "06" }: { index?: string }) {
  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-40">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-page relative">
        <div className="mb-10 flex items-center gap-4">
          <span className="eyebrow tabular-nums text-fg">{index}</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <span className="eyebrow">Contact</span>
        </div>

        <SplitText as="h2" by="chars" text="Let's build something." className="text-display max-w-[12ch] text-balance" />

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-pretty text-lg leading-relaxed text-muted">
            Have a project, an idea or a question? Email is the best way to reach me.
          </p>
          <Magnetic>
            <ButtonLink href={`mailto:${site.email}`} size="lg" icon={<ArrowUpRight className="size-4" />}>
              Send an email
            </ButtonLink>
          </Magnetic>
        </div>

        <RevealGroup className="mt-16 grid gap-4 md:grid-cols-3" each={0.08}>
          <RevealItem>
            <Card>
              <Mail className="size-5" strokeWidth={1.75} />
              <p className="eyebrow mt-8">Email</p>
              <a href={`mailto:${site.email}`} className="mt-2 break-all text-lg font-medium underline-offset-4 hover:underline">
                {site.email}
              </a>
              <div className="mt-auto pt-6">
                <CopyButton value={site.email} label="Copy email address">
                  Copy email
                </CopyButton>
              </div>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <BrandIcon name="discord" className="size-5" />
              <p className="eyebrow mt-8">Discord</p>
              <p className="mt-2 text-lg font-medium">{site.discord}</p>
              <div className="mt-auto pt-6">
                <CopyButton value={site.discord} label={`Copy Discord username ${site.discord}`}>
                  Copy username
                </CopyButton>
              </div>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <BrandIcon name="github" className="size-5" />
              <p className="eyebrow mt-8">GitHub</p>
              <p className="mt-2 text-lg font-medium">@{site.github.username}</p>
              <div className="mt-auto pt-6">
                <a
                  href={site.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-bg-2"
                >
                  View profile <ArrowUpRight className="size-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </Card>
          </RevealItem>
        </RevealGroup>

        {site.linkedin && (
          <p className="mt-6 text-sm text-muted">
            Also on{" "}
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-fg underline underline-offset-4">
              LinkedIn
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
