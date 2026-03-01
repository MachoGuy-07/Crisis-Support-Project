import type { Metadata } from "next";
import type React from "react";
import { DM_Sans, Sora } from "next/font/google";
import "leaflet/dist/leaflet.css";

import { DataProvider } from "@/context/DataContext";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Crisis Support - Realtime Help & Updates",
  description:
    "A platform for providing and requesting real-time assistance for food, water, and shelter in times of crisis.",
  themeColor: "#09080d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.openstreetmap.org" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className={`${sora.variable} ${dmSans.variable} min-h-screen font-sans antialiased`}>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
