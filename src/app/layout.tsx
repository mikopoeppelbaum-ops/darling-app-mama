import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Fraunces } from "next/font/google";
import "./globals.css";
import {
  AccessibilityProvider,
  accessibilityInitScript,
} from "@/components/a11y/accessibility-provider";
import { AppStoreProvider } from "@/lib/store";

const bodyFont = Atkinson_Hyperlegible_Next({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  // Für diese Schrift liefert Next.js keine Metrik-Werte; Fallback ohne Anpassung.
  adjustFontFallback: false,
});

const displayFont = Fraunces({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "EchtNah — Dating, das dich als ganzen Menschen sieht",
    template: "%s | EchtNah",
  },
  description:
    "Lerne Menschen kennen, die zu deinem Alltag, deinen Werten und deiner Art zu kommunizieren passen. Barrierearm, sicher und ohne Druck.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#131816" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Wendet gespeicherte Barrierefreiheits-Einstellungen vor dem ersten Rendern an */}
        <script dangerouslySetInnerHTML={{ __html: accessibilityInitScript }} />
        <a
          href="#hauptinhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Zum Inhalt springen
        </a>
        <AccessibilityProvider>
          <AppStoreProvider>{children}</AppStoreProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
