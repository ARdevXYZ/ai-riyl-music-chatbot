// layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import localFont from 'next/font/local';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const cyanFont = localFont({
  src: [
    {
      path: "../public/fonts/GT-Flexa-Mono-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Thin-Italic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Light-Italic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Regular-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Medium-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/GT-Flexa-Mono-Bold-Italic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: '--font-cyan-font-gt-flexa',
});

export const metadata: Metadata = {
  title: "AI Music Recommendations Generator",
  description: "by Cyan NYC",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AI Music Recommendations",
    description: "Discover new music with AI-powered recommendations.",
    url: "https://ai-music-recommendations.vercel.app/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Music Recommendations - Dolphin Playing Saxophone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Music Recommendations",
    description: "Discover new music with AI-powered recommendations.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cyanFont.className} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:ring-2 focus:ring-emerald-500"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
