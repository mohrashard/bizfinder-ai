"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Menu, X, Home, BookOpen, Target, Info, Search, Zap, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            {/* Navbar */}
            <nav className="border-b border-white/10 sticky top-0 z-20 backdrop-blur-md bg-slate-900/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="relative w-12 h-12 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform hover:shadow-blue-500/20 group">
                            <Image src="/real_logo.png" alt="BizFinder AI Logo" fill className="object-cover" />
                        </Link>
                        <Link href="/" className="font-bold text-xl text-white hover:text-blue-200 transition-colors">BizFinder AI</Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-slate-400 hover:text-white transition-colors font-medium text-sm flex items-center gap-2">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                        <Link href="/leads" className="text-slate-400 hover:text-white transition-colors font-medium text-sm flex items-center gap-2">
                            <Target className="w-4 h-4" /> My Leads
                        </Link>
                        <Link href="/guide" className="text-slate-400 hover:text-white transition-colors font-medium text-sm flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> User Guide
                        </Link>
                        <Link href="/about" className="text-white font-medium text-sm flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                            <Info className="w-4 h-4" /> About Us
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-slate-300 hover:text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
                        <Link href="/" className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
                            <Home className="w-5 h-5" /> Home
                        </Link>
                        <Link href="/leads" className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
                            <Target className="w-5 h-5" /> My Leads (CRM)
                        </Link>
                        <Link href="/guide" className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
                            <BookOpen className="w-5 h-5" /> User Guide
                        </Link>
                        <Link href="/about" className="flex items-center gap-3 p-3 text-white bg-slate-800 rounded-xl transition-colors font-medium">
                            <Info className="w-5 h-5" /> About Us
                        </Link>
                    </div>
                )}
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">

                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">About <span className="text-blue-500">BizFinder AI</span></h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We are revolutionizing how digital agencies find their next client. No more manual searching on Google Maps.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* The Problem */}
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-rose-500 select-none">?</div>
                            <h2 className="text-2xl font-bold text-rose-400 mb-4 flex items-center gap-3">
                                <Search className="w-6 h-6" /> The Problem
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                Finding local businesses that <strong>actually need services</strong> is hard. You type "electrician" into Google Maps and get hundreds of results.
                                Most have websites. Most have good ratings.
                            </p>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Manually clicking through each one to find the ones with <strong>no website</strong>, <strong>missing social media</strong>, or <strong>poor SEO</strong> takes hours. It's boring, repetitive, and inefficient.
                            </p>
                        </div>
                    </section>

                    {/* The Solution */}
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-blue-500 select-none">!</div>
                            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-3">
                                <Zap className="w-6 h-6" /> The Solution
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8">
                                BizFinder AI automates the entire process. We connect directly to Google Maps live data and use AI to filter the results instantly.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Smart Filters</h3>
                                    <p className="text-slate-400 text-sm">Target specifically businesses with "No Website" or "Low Ratings" in one click.</p>
                                </div>
                                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Audit</h3>
                                    <p className="text-slate-400 text-sm">Generate instant digital presence audits to send to clients as a pitch.</p>
                                </div>
                                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Built-in CRM</h3>
                                    <p className="text-slate-400 text-sm">Track your leads from "New" to "Contacted" without leaving the app.</p>
                                </div>
                                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Natural Search</h3>
                                    <p className="text-slate-400 text-sm">Just type "dentists in miami with no social media" and let our AI do the rest.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mission */}
                    <section className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
                            "To empower digital agencies and freelancers with the data they need to grow their business, automating the busywork so they can focus on closing deals."
                        </p>
                    </section>
                </div>

                <div className="mt-20 flex justify-center">
                    <Link href="/finder" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
                        Start Finding Leads
                    </Link>
                </div>

            </main>

            <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur text-slate-500 py-8 relative z-10 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm">
                    &copy; {new Date().getFullYear()} BizFinder AI. Built for Agencies.
                </div>
            </footer>
        </div>
    );
}
