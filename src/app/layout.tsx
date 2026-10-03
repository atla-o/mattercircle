import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.publisher }],
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${sourceSans.variable} h-full antialiased`}
      style={{ colorScheme: "only light" }}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-paper font-serif text-ink">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
