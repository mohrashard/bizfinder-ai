/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Globe, Database, Zap, Menu, X, Home, BookOpen, Info } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "BizFinder AI",
            "operatingSystem": "Web Browser",
            "applicationCategory": "BusinessApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "124"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "AI-powered tool for digital agencies to find local business leads with no websites or social media presence."
          })
        }}
      />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/10 backdrop-blur-md bg-slate-900/70 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden group hover:shadow-blue-500/20 transition-all duration-300">
              <Image
                src="/real_logo.png"
                alt="BizFinder AI Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-white">BizFinder AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base flex items-center gap-2">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link href="/guide" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> How to Use
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base flex items-center gap-2">
              <Info className="w-4 h-4" /> About Us
            </Link>
            <Link href="/leads" className="text-slate-300 hover:text-white transition-colors font-medium text-sm lg:text-base flex items-center gap-2">
              <Database className="w-4 h-4" /> My Leads
            </Link>
            <Link
              href="/finder"
              className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg shadow-white/10 flex items-center gap-2 hover:scale-105 active:scale-95 text-sm lg:text-base"
            >
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {/* We use overflow-hidden and max-h logic for smooth expansion, or just conditional rendering with animation classes */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" /> Home
            </Link>
            <Link
              href="/guide"
              className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="w-5 h-5" /> How to Use
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Info className="w-5 h-5" /> About Us
            </Link>
            <Link
              href="/leads"
              className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Database className="w-5 h-5" /> My Leads
            </Link>
            <Link
              href="/finder"
              className="block p-3 bg-blue-600 text-white text-center rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Launch App
            </Link>
          </div>
        )}
      </nav>

      <main className="relative z-10">

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium">Powered by Gemini AI 2.0 & Google Maps</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-300 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Supercharge Your <br />
            <span className="text-blue-500">Lead Generation</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Instantly find high-value business leads based on specific criteria like "No Website", "Low Ratings", or "Missing Social Media". Perfect for digital marketing agencies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <Link
              href="/finder"
              className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 flex items-center gap-3"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Find Businesses Now
            </Link>
            <Link
              href="/guide"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-slate-700 hover:border-slate-600 flex items-center gap-3"
            >
              View Setup Guide
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
            {[
              {
                icon: <Globe className="w-8 h-8 text-blue-400" />,
                title: "Live Google Maps Data",
                desc: "Access real-time business data directly from Google Maps via SerpAPI."
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-400" />,
                title: "AI-Powered Search",
                desc: "Use natural language like 'find dentists in Texas with no website' to get instant results."
              },
              {
                icon: <Database className="w-8 h-8 text-emerald-400" />,
                title: "Smart Filtering",
                desc: "Filter by ratings, social media presence, and operational status to find the best prospects."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:bg-slate-800/80 transition-all hover:scale-105 group text-left animate-in fade-in zoom-in-50 duration-700"
                style={{ animationDelay: `${300 + idx * 100}ms` }}
              >
                <div className="bg-slate-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:shadow-lg transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
}