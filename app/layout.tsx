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
      path: '../public/fonts/Brown-Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cyan-font-brown',
});

const cyanFontTwo = localFont({
  src: [
    {
      path: '../public/fonts/Akkurat-Normal.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cyan-font-akkurat',
});

const cyanFontThree = localFont({
  src: [
    {
      path: '../public/fonts/CircularStd-Book.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cyan-font-circular',
});

const cyanFontFour = localFont({
  src: [
    {
      path: '../public/fonts/GT-Haptik-Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cyan-font-gt-haptik',
});

const cyanFontFive = localFont({
  src: [
    {
      path: '../public/fonts/Graphik-Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cyan-font-grafik',
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
