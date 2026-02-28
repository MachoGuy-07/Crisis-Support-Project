import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sora.variable} ${dmSans.variable} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
