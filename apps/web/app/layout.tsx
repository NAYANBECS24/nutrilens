import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "NutriLens", template: "%s | NutriLens" },
  description: "AI-powered food coach. Snap a photo, log your meal, hit your goals.",
  applicationName: "NutriLens",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "NutriLens" },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
