"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home,
    BookOpen,
    Target,
    Settings,
    Menu,
    X,
    Search,
    MapPin,
    Phone,
    Globe,
    Star,
    Trash2,
    ArrowDownWideNarrow,
    CheckCircle2,
    XCircle,
    Download,
    ArrowLeft
} from 'lucide-react';

// --- Types (Mirrored from finder/page.tsx) ---

interface Business {
    position?: number;
    title: string;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    reviews?: number;
    type?: string;
    open_state?: string;
    hours?: string;
    gps_coordinates?: {
        latitude: number;
        longitude: number;
    };
    email?: string;
    socials?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    opportunity_score?: number;
    opportunity_factors?: string[];
}

interface CRMEntry {
    business: Business;
    status: 'New' | 'Contacted' | 'Call Later' | 'Good Lead' | 'High Value';
    notes: string;
    savedAt: number;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Record<string, CRMEntry>>({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('bf_crm_data');
        if (savedData) {
            try {
                setLeads(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to load leads", e);
            }
        }
        setLoading(false);
    }, []);

    const updateLead = (id: string, field: 'status' | 'notes', value: string) => {
        setLeads(prev => {
            const entry = prev[id];
            if (!entry) return prev;

            const newData = {
                ...prev,
                [id]: { ...entry, [field]: value }
            };
            localStorage.setItem('bf_crm_data', JSON.stringify(newData));
            return newData;
        });
    };

    const deleteLead = (id: string) => {
        if (!confirm('Are you sure you want to remove this lead?')) return;

        setLeads(prev => {
            const newData = { ...prev };
            delete newData[id];
            localStorage.setItem('bf_crm_data', JSON.stringify(newData));
            return newData;
        });
    };

    const handleExport = () => {
        const rows = Object.values(leads).map(entry => {
            const b = entry.business;
            return [
                `"${b.title.replace(/"/g, '""')}"`,
                entry.status,
                `"${entry.notes.replace(/"/g, '""')}"`,
                `"${b.phone || ''}"`,
                `"${b.email || ''}"`,
                `"${b.website || ''}"`,
                b.rating || '',
                new Date(entry.savedAt || Date.now()).toLocaleDateString()
            ];
        });

        const headers = ['Business Name', 'Status', 'Notes', 'Phone', 'Email', 'Website', 'Rating', 'Date Added'];
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `my_leads_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const leadsList = Object.entries(leads)
        .filter(([_, entry]) => !!entry.business) // Filter out legacy data or corrupted entries
        .sort((a, b) => (b[1].savedAt || 0) - (a[1].savedAt || 0));

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans pb-20 selection:bg-blue-500 selection:text-white overflow-x-hidden">

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
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

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-slate-400 hover:text-white transition-colors font-medium text-sm flex items-center gap-2">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                        <Link href="/leads" className="text-white font-medium text-sm flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                            <Target className="w-4 h-4" /> My Leads
                        </Link>
                        <Link href="/guide" className="text-slate-400 hover:text-white transition-colors font-medium text-sm flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> How to Use
                        </Link>
                    </div>

                    <button className="md:hidden text-slate-300 hover:text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
                        <Link href="/" className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
                            <Home className="w-5 h-5" /> Home
                        </Link>
                        <Link href="/leads" className="flex items-center gap-3 p-3 text-white bg-slate-800 rounded-xl transition-colors font-medium">
                            <Target className="w-5 h-5" /> My Leads
                        </Link>
                        <Link href="/guide" className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors font-medium">
                            <BookOpen className="w-5 h-5" /> How to Use
                        </Link>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <div className="mb-6">
                    <Link href="/finder" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Finder
                    </Link>
                </div>
                <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">My Saved Leads</h1>
                        <p className="text-slate-400">Manage and track your business opportunities.</p>
                    </div>
                    {leadsList.length > 0 && (
                        <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 text-sm">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading...</div>
                ) : leadsList.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
                        <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No leads saved yet</h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto">Start searching for businesses and change their status or add a note to save them here.</p>
                        <Link href="/finder" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 inline-flex items-center gap-2">
                            <Search className="w-4 h-4" /> Find Leads
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {leadsList.map(([id, entry], idx) => (
                            <div
                                key={id}
                                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors shadow-lg group animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Business Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{entry.business.title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <span className="bg-slate-700/50 px-2 py-0.5 rounded text-xs border border-slate-600/50">{entry.business.type || 'Business'}</span>
                                                    <span>•</span>
                                                    <MapPin className="w-3.5 h-3.5" /> {entry.business.address}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-300">
                                            {entry.business.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-blue-400" />
                                                    <span className="select-all hover:text-white">{entry.business.phone}</span>
                                                </div>
                                            )}
                                            {entry.business.website && (
                                                <a href={entry.business.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline">
                                                    <Globe className="w-4 h-4" /> Website
                                                </a>
                                            )}
                                            {entry.business.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    <span className="font-bold text-white">{entry.business.rating}</span>
                                                    <span className="text-slate-500">({entry.business.reviews})</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CRM Controls */}
                                    <div className="w-full md:w-80 flex flex-col gap-3 bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                            <button onClick={() => deleteLead(id)} className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Lead">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <select
                                                value={entry.status}
                                                onChange={(e) => updateLead(id, 'status', e.target.value as any)}
                                                className={`w-full text-sm font-bold px-3 py-2.5 rounded-lg border-none ring-1 transition-all appearance-none cursor-pointer focus:ring-2
                                                    ${(entry.status === 'Contacted') ? 'bg-blue-500/20 text-blue-300 ring-blue-500/50 focus:ring-blue-500' :
                                                        (entry.status === 'Call Later') ? 'bg-amber-500/20 text-amber-300 ring-amber-500/50 focus:ring-amber-500' :
                                                            (entry.status === 'Good Lead') ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/50 focus:ring-emerald-500' :
                                                                (entry.status === 'High Value') ? 'bg-violet-500/20 text-violet-300 ring-violet-500/50 focus:ring-violet-500' :
                                                                    'bg-slate-700 text-slate-400 ring-slate-600 focus:ring-slate-500'
                                                    }`}
                                            >
                                                <option value="New">⚡ New Lead</option>
                                                <option value="Contacted">✉️ Contacted</option>
                                                <option value="Call Later">📞 Call Later</option>
                                                <option value="Good Lead">✅ Good Lead</option>
                                                <option value="High Value">💎 High Value</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-current opacity-70">
                                                <ArrowDownWideNarrow className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <textarea
                                            value={entry.notes}
                                            onChange={(e) => updateLead(id, 'notes', e.target.value)}
                                            placeholder="Lead notes..."
                                            className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder-slate-600"
                                        />
                                        <div className="text-right text-[10px] text-slate-600">
                                            Saved: {new Date(entry.savedAt || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
