import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import {
  AccessibilityProvider,
  accessibilityInitScript,
} from "@/components/a11y/accessibility-provider";
import { AppStoreProvider } from "@/lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
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
