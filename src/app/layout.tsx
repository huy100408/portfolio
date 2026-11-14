import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Providers } from "@/components/providers/Providers";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { site } from "@/config/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = `${site.name} | ${site.title}`;

export const metadata: Metadata = {
  // Origin only: Next adds the base path to file-based metadata (OG image, icon) itself.
  metadataBase: new URL(new URL(site.url).origin),
  title,
  description: site.description,
  authors: [{ name: site.name, url: site.github.url }],
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
};

// Runs before first paint: hides the intro loader for visitors who already saw it this session.
const introScript = `try{if(sessionStorage.getItem("intro-seen"))document.documentElement.dataset.intro="seen"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`#intro-loader{display:none!important}[data-reveal],[data-reveal] *{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Providers>
          <LoadingScreen />
          <ScrollProgress />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
