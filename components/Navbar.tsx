
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, BookOpen, Info, Database, ArrowRight, Menu, X, Dice5 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Highlight active link helper
    const isActive = (path: string) => pathname === path ? "text-blue-400" : "text-slate-300 hover:text-white";

    return (
        <nav className="relative z-50 border-b border-white/10 backdrop-blur-md bg-slate-900/70 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden group-hover:shadow-blue-500/20 transition-all duration-300">
                        <Image
                            src="/real_logo.png"
                            alt="BizFinder AI Logo"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <span className="font-bold text-xl sm:text-2xl tracking-tight text-white group-hover:text-blue-100 transition-colors">BizFinder AI</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    <Link href="/" className={`${isActive('/')} transition-colors font-medium text-sm lg:text-base flex items-center gap-2`}>
                        <Home className="w-4 h-4" /> Home
                    </Link>
                    <Link href="/guide" className={`${isActive('/guide')} transition-colors font-medium text-sm lg:text-base flex items-center gap-2`}>
                        <BookOpen className="w-4 h-4" /> How to Use
                    </Link>
                    <Link href="/about" className={`${isActive('/about')} transition-colors font-medium text-sm lg:text-base flex items-center gap-2`}>
                        <Info className="w-4 h-4" /> About Us
                    </Link>
                    <Link href="/leads" className={`${isActive('/leads')} transition-colors font-medium text-sm lg:text-base flex items-center gap-2`}>
                        <Database className="w-4 h-4" /> My Leads
                    </Link>
                    <Link href="/generator" className={`${isActive('/generator')} transition-colors font-medium text-sm lg:text-base flex items-center gap-2`}>
                        <Dice5 className="w-4 h-4" /> Generator
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
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 h-screen">
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
                        href="/generator"
                        className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium text-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Dice5 className="w-5 h-5" /> Generator
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
    );
}
