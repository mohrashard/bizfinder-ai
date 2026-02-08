import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thebizfinderai.vercel.app'),
  title: {
    default: "BizFinder AI - #1 AI Business Lead Finder & Scraper",
    template: "%s | BizFinder AI"
  },
  description: "Instantly find high-value business leads from Google Maps using AI. The ultimate tool for Digital Marketing Agencies to find clients without websites or social media.",
  keywords: ["business lead finder", "google maps scraper", "b2b lead generation", "ai marketing tool", "agency client finder", "digital audit tool", "small business leads", "bizfinder ai"],
  authors: [{ name: "Mr² Labs", url: "https://mohamedrashard.vercel.app/" }],
  creator: "Mr² Labs",
  publisher: "BizFinder AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "BizFinder AI - Smarter Lead Generation",
    description: "Stop wasting time manually searching. Find targeted business leads with AI analysis in seconds.",
    url: "https://thebizfinderai.vercel.app",
    siteName: "BizFinder AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // We will need to ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "BizFinder AI Dashboard Preview",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizFinder AI - AI-Powered Business Search",
    description: "Find your next B2B client in seconds. Filter by 'No Website', 'Low Rating', and more.",
    images: ["/og-image.png"],
    creator: "@mohamedrashard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "v27FCR5J3XGYK0EjtOjh47hthxOwSHXi8Lg7yIwkdT8",
  },
  alternates: {
    canonical: "https://thebizfinderai.vercel.app",
  },
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-900 overflow-x-hidden`}
      >
        <Navbar />
        <div className="flex-grow bg-slate-900">
          {children}
        </div>

        <SpeedInsights />

        <footer className="border-t border-white/10 bg-slate-900 py-8 relative z-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} BizFinder AI. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm mt-2 font-medium flex items-center justify-center gap-4">
              <span>Developed by <a href="https://www.mohamedrashard.dev/labs" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">Mr² Labs</a></span>


            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
