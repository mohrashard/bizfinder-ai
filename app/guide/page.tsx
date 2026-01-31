/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Key, ExternalLink, CheckCircle2, Globe } from 'lucide-react';
import Image from 'next/image';


export default function GuidePage() {


    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            {/* Navbar */}


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
