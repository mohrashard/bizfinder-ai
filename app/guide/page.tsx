/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ExternalLink, CheckCircle2, Key, Globe, ArrowRight, Menu, X, Home, BookOpen } from 'lucide-react';
import Image from 'next/image';


export default function GuidePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            {/* Navbar */}
            {/* Navbar */}
            <nav className="border-b border-white/10 sticky top-0 z-20 backdrop-blur-md bg-slate-900/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

                    {/* Left: Back Link (Desktop: Text, Mobile: Icon Only) */}
                    <div className="flex-1 flex justify-start items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium group">
                            <Home className="w-5 h-5" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    </div>

                    {/* Center: Title & Logo */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden group">
                            <Image
                                src="/real_logo.png"
                                alt="BizFinder AI Logo"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <span className="font-bold text-white tracking-wide text-sm sm:text-base">Setup Guide</span>
                    </div>

                    {/* Right: Spacer (Desktop) / Menu (Mobile) */}
                    <div className="flex-1 flex justify-end">
                        {/* Desktop: Empty to balance center */}
                        <div className="hidden sm:block w-20"></div>

                        {/* Mobile: Hamburger */}
                        <button
                            className="sm:hidden text-slate-300 hover:text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
                        <Link
                            href="/"
                            className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Home className="w-5 h-5" /> Home
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

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative z-10">

                <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">How to Configure BizFinder AI</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Follow these simple steps to get your free API keys and start searching.
                    </p>
                </div>

                <div className="space-y-8">

                    {/* Step 1: Gemini API */}
                    <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 hover:bg-slate-800/80 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Key className="w-32 h-32 text-blue-500 transform rotate-12" />
                        </div>

                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="bg-blue-600/20 text-blue-400 font-bold text-xl w-12 h-12 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">1</div>
                            <h2 className="text-2xl font-bold text-white">Get Gemini API Key (Free)</h2>
                        </div>

                        <div className="space-y-4 text-slate-300 relative">
                            <p>Google's Gemini API powers the natural language understanding. It's free for general use.</p>

                            <ol className="list-decimal list-inside space-y-3 ml-2 marker:font-bold marker:text-blue-500">
                                <li className="pl-2">Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-400 font-medium hover:text-blue-300 hover:underline inline-flex items-center gap-1 transition-colors">Google AI Studio <ExternalLink className="w-3 h-3" /></a>.</li>
                                <li className="pl-2">Sign in with your Google Account.</li>
                                <li className="pl-2">Click on <strong className="text-white">"Create API key"</strong>.</li>
                                <li className="pl-2">Copy the generated key (starts with <code className="bg-slate-900/50 px-1 py-0.5 rounded text-blue-300">AIzaSy...</code>).</li>
                            </ol>

                            <div className="mt-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between group">
                                <code className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">AIzaSy...</code>
                                <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-1 rounded border border-slate-700">Example Key</span>
                            </div>
                        </div>
                    </section>

                    {/* Step 2: SerpAPI */}
                    <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 hover:bg-slate-800/80 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Globe className="w-32 h-32 text-emerald-500 transform -rotate-12" />
                        </div>

                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="bg-emerald-600/20 text-emerald-400 font-bold text-xl w-12 h-12 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">2</div>
                            <h2 className="text-2xl font-bold text-white">Get SerpAPI Key</h2>
                        </div>

                        <div className="space-y-4 text-slate-300 relative">
                            <p>SerpAPI connects us to Google Maps results in real-time.</p>

                            <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl text-emerald-300 text-sm font-medium flex items-center gap-3 mb-4">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span>Includes 250 free searches per month.</span>
                            </div>

                            <ol className="list-decimal list-inside space-y-3 ml-2 marker:font-bold marker:text-emerald-500">
                                <li className="pl-2">Register at <a href="https://serpapi.com/users/sign_up" target="_blank" className="text-emerald-400 font-medium hover:text-emerald-300 hover:underline inline-flex items-center gap-1 transition-colors">SerpAPI.com <ExternalLink className="w-3 h-3" /></a>.</li>
                                <li className="pl-2">Verify your email address.</li>
                                <li className="pl-2">Navigate to the <strong className="text-white">Dashboard</strong>.</li>
                                <li className="pl-2">Copy your <strong className="text-white">API Key</strong>.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Step 3: Configure App */}
                    <section className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <h2 className="text-2xl font-bold mb-4 text-white">Ready to Search?</h2>
                        <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                            Once you have both keys, go to the app settings and paste them in. You'll be ready to find business leads in seconds.
                        </p>

                        <Link
                            href="/finder"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:-translate-y-1"
                        >
                            Open App & Configure <ArrowRight className="w-5 h-5" />
                        </Link>
                    </section>

                </div>
            </main>
        </div>
    );
}
