import type { Metadata, Viewport } from "next";
import { Space_Mono, Space_Grotesk, Baloo_2, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const baloo = Baloo_2({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Hacker House Goa 2026 — Builder Passport",
  description: "Discover your Hacker House identity. Generate your Builder Passport for Hacker House Goa 2026.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0b2a1f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${spaceGrotesk.variable} ${baloo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-x-hidden bg-[#0b2a1f] font-mono text-white">{children}</body>
    </html>
  );
}
