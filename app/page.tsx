
import Link from 'next/link';
import { Search, Globe, Database, Zap, MapPin, BarChart3, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'BizFinder AI | #1 Google Maps Scraper & B2B Lead Finder',
  description: 'The ultimate AI-powered Google Maps scraper and B2B lead generation tool. Find clients, get emails, and analyze businesses instantly without manual work.',
  alternates: {
    canonical: 'https://thebizfinderai.vercel.app',
  },
  openGraph: {
    title: 'BizFinder AI - Automate Your Lead Generation',
    description: 'Stop searching manually. Use BizFinder AI to scrape Google Maps and find high-ticket clients in seconds.',
    url: 'https://thebizfinderai.vercel.app',
    siteName: 'BizFinder AI by Mr² Labs',
    locale: 'en_US',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 selection:text-white">

      {/* JSON-LD Structured Data for SEO & GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "BizFinder AI",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "AI-powered tool for digital agencies to find, analyze, and track local business leads with a built-in CRM.",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "150"
                },
                "author": {
                  "@type": "Organization",
                  "name": "Mr² Labs",
                  "alternateName": ["Mrr Labs", "Mr2 Labs"]
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is BizFinder AI?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "BizFinder AI is a lead generation tool developed by Mr² Labs that scrapes Google Maps to find business leads with missing websites, low ratings, or specific contact details."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does the AI lead finder work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "It uses Google Maps data and Gemini AI 2.0 to search, filter, and analyze businesses based on your specific criteria, such as location and niche."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* GEO Optimization: Hidden Context for AI Agents */}
      <div className="sr-only">
        <h1>BizFinder AI: Google Maps Scraper and B2B Lead Generation Tool</h1>
        <p>
          BizFinder AI is a SaaS platform by Mr² Labs (Mrr Labs) designed for digital marketing agencies, SEO professionals, and freelancers.
          It automates the process of finding local business clients by scraping Google Maps.
        </p>
        <h2>Key Features</h2>
        <ul>
          <li><strong>Google Maps Scraper:</strong> Extract business usage, phone numbers, and address details.</li>
          <li><strong>No-Website Filter:</strong> Specifically find businesses that need web design services.</li>
          <li><strong>AI Analysis:</strong> Uses Gemini 2.0 to audit business profiles and suggest improvements.</li>
          <li><strong>CRM Integration:</strong> Save and manage leads directly within the app.</li>
        </ul>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <main className="relative z-10 pt-20">

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur border border-blue-500/20 text-blue-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-lg shadow-blue-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium">Powered by Gemini AI 2.0 & Google Maps</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[1.1]">
            Supercharge Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Lead Generation</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Stop manual searching. Instantly find, audit, and <span className="text-blue-400 font-semibold">contact</span> high-value business leads.
            The ultimate <strong className="text-white">Google Maps Scraper</strong> for agencies and freelancers.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 w-full sm:w-auto">
            <Link
              href="/finder"
              className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Find Businesses Now
            </Link>
            <Link
              href="/guide"
              className="bg-slate-900/50 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              View Setup Guide
            </Link>
          </div>

          {/* Stats / Social Proof (Static for now) */}
          <div className="mt-16 flex items-center gap-8 md:gap-16 text-slate-500 text-sm font-mono animate-in fade-in opacity-0 duration-1000 delay-500 fill-mode-forwards">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">100+</span>
              <span>Cities Supported</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">50k+</span>
              <span>Leads Analyzed</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">0s</span>
              <span>Wait Time</span>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-24 w-full text-left">
            {[
              {
                icon: <Globe className="w-6 h-6 text-blue-400" />,
                title: "Live Google Maps Data",
                desc: "Access real-time business data directly from Google Maps. Get accurate addresses, phone numbers, and review counts instantly."
              },
              {
                icon: <Zap className="w-6 h-6 text-amber-400" />,
                title: "AI-Powered Analysis",
                desc: "Our Gemini 2.0 engine analyzes each lead to identify opportunities—like finding businesses with no website or low ratings."
              },
              {
                icon: <Database className="w-6 h-6 text-emerald-400" />,
                title: "Built-in CRM",
                desc: "Don't lose track of potential clients. Save prospects to your dashboard, manage status, and export your lead list to CSV."
              },
              {
                icon: <MapPin className="w-6 h-6 text-red-400" />,
                title: "Global Search",
                desc: "Find leads in any city, anywhere in the world. From dentists in New York to cafes in Tokyo, we search it all."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
                title: "Rating & Review Audit",
                desc: "Instantly filter businesses with bad ratings. Perfect for Reputation Management agencies looking for quick wins."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
                title: "Verified Data",
                desc: "We cross-reference data points to ensure you aren't wasting time on closed businesses or invalid numbers."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 hover:border-slate-600 transition-all hover:-translate-y-1 group"
              >
                <div className="bg-slate-800/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:border-white/10 group-hover:bg-slate-800 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}