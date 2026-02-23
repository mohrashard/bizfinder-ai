"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Target, Download, Search, MapPin, Phone, Globe, Star,
    Trash2, ArrowDownWideNarrow, XCircle, Linkedin, Facebook, Instagram, Code, Megaphone,
    ExternalLink, Eye, Mail, Send, X, CheckCircle2, AlertTriangle, MessageSquare, Loader2, Sparkles
} from 'lucide-react';

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
    data_id?: string;
    gps_coordinates?: { latitude: number; longitude: number; };
    email?: string;
    socials?: { facebook?: string; instagram?: string; twitter?: string; linkedin?: string; };
    opportunity_score?: number;
    opportunity_factors?: string[];
}

interface CRMEntry {
    business: Business;
    status: 'New' | 'Contacted' | 'Call Later' | 'Good Lead' | 'High Value';
    notes: string;
    savedAt: number;
}

// --- Pitch Types ---
type PitchType = 'webdev' | 'smma';

// --- AI Email Generator ---
function generateColdEmail(biz: Business, pitchType: PitchType): { subject: string; body: string } {
    const location = biz.address.split(',').pop()?.trim() || "your area";
    const bizType = biz.type || "Local Business";
    const hasWebsite = !!biz.website;
    const hasSocials = biz.socials && Object.values(biz.socials).some(v => !!v);
    const hash = biz.title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    if (pitchType === 'webdev') {
        const strategies = [
            { subject: `I built a prototype for ${biz.title} — want a look?`, hook: `I took the liberty of designing a premium landing page concept for ${biz.title}` },
            { subject: `${biz.title}'s website is costing you customers`, hook: `I've analyzed the ${bizType} market in ${location} and found that your competitors are winning customers online that should be yours` },
            { subject: `Quick idea to double ${biz.title}'s online bookings`, hook: `I specialize in building ultra-fast, conversion-optimized websites for ${bizType} businesses in ${location}` },
            { subject: `${biz.title} — a website that actually brings you customers`, hook: `I noticed ${biz.title} ${!hasWebsite ? "doesn't have a website yet" : "could benefit from a modern website redesign"} and I'd love to help change that` },
        ];
        const s = strategies[hash % strategies.length];
        const body = `Hi ${biz.title} Team,

${s.hook}.

${!hasWebsite
                ? `Right now, ${biz.title} doesn't have a website — which means every potential customer searching for "${bizType} near me" in ${location} is going to your competitors instead. That's a massive revenue leak.`
                : `Your current online presence isn't capturing the high-value leads you deserve. In today's market, a modern, fast-loading website is the difference between growing and getting left behind.`}

Here's what I'd build for ${biz.title}:

✅ A stunning, mobile-first website that loads in under 1 second
✅ Built-in SEO so you rank #1 for "${bizType} in ${location}"
✅ Online booking/contact system that captures leads 24/7
✅ Google Business integration to boost your local visibility
✅ Professional design that builds instant trust with customers

I use modern tech (Next.js, React) that makes your site 10x faster than WordPress — which means better Google rankings and more customers finding you.

I've already sketched out some ideas specifically for ${biz.title}. Would you be open to a quick 5-minute walkthrough? No commitment, no pressure.

Best regards,
[Your Name]
Senior Web Developer | [Your Company]
[Your Phone] | [Your Portfolio URL]`;
        return { subject: s.subject, body };
    } else {
        const strategies = [
            { subject: `${biz.title}'s 30-Day Social Media Domination Plan is ready`, hook: `I've mapped out a complete social media growth strategy specifically for ${biz.title}` },
            { subject: `Your competitors in ${location} are going viral — here's how`, hook: `I've been studying the ${bizType} market in ${location} and noticed a massive gap in ${biz.title}'s social media presence` },
            { subject: `5 viral video ideas for ${biz.title} (ready to film today)`, hook: `I specialize in helping ${bizType} businesses explode on social media with short-form video content` },
            { subject: `${biz.title} could be getting 10x more customers from social media`, hook: `Local ${bizType} businesses that invest in social media marketing see an average 300% increase in customer inquiries` },
        ];
        const s = strategies[hash % strategies.length];
        const body = `Hi ${biz.title} Team,

${s.hook}.

${!hasSocials
                ? `Right now, ${biz.title} has virtually no social media presence — which means you're invisible to the 80% of customers who check social media before choosing a local ${bizType}. Your competitors are filling that gap.`
                : `While ${biz.title} has some social media presence, it's not optimized for growth. The right strategy can turn your social accounts into your #1 source of new customers.`}

Here's my proven approach for ${bizType} businesses:

✅ 30-day content calendar with daily post ideas tailored to ${biz.title}
✅ 5 viral short-form video scripts you can film on your phone today
✅ Instagram/TikTok/Facebook strategy to dominate ${location}
✅ Targeted ad campaigns to reach every potential customer in your area
✅ Review generation system to boost your online reputation
✅ Monthly analytics & optimization to keep the growth going

My recent clients in similar industries went from 0 to 10K+ local followers and saw a 60% increase in walk-ins within 60 days.

I have a strategic brief and content roadmap ready for ${biz.title}. Would you like me to send it over? It's completely free — no strings attached.

Cheers,
[Your Name]
Social Media Growth Strategist | [Your Agency]
[Your Phone] | [Your Website]`;
        return { subject: s.subject, body };
    }
}

function generateBulkEmail(pitchType: PitchType): { subject: string; body: string } {
    if (pitchType === 'webdev') {
        return {
            subject: `A website that actually brings you customers — quick idea`,
            body: `Hi there,

I'm a web developer who specializes in building modern, high-performance websites for local businesses.

I've been researching businesses in your area and I see a huge opportunity to help you capture more customers online.

Here's what I can build for you:

✅ A stunning, mobile-first website that loads in under 1 second
✅ Built-in SEO so you rank #1 for your services in your area
✅ Online booking/contact system that captures leads 24/7
✅ Google Business integration for maximum local visibility
✅ Professional design that builds instant customer trust

I use cutting-edge tech (Next.js, React) that makes your site 10x faster than WordPress — which means better Google rankings and more customers.

My recent clients have seen a 40-60% increase in customer inquiries within 30 days of launching.

Would you be open to a quick 5-minute chat? I'd love to show you what I have in mind — no commitment required.

Best regards,
[Your Name]
Senior Web Developer | [Your Company]
[Your Phone] | [Your Portfolio URL]`
        };
    } else {
        return {
            subject: `Your business could be getting 10x more customers from social media`,
            body: `Hi there,

I'm a social media growth strategist who helps local businesses dominate their market through strategic content and targeted advertising.

I've been researching businesses in your area and I believe there's a massive untapped opportunity in your social media presence.

Here's my proven approach:

✅ Custom 30-day content calendar tailored to your business
✅ Viral short-form video scripts you can film on your phone
✅ Instagram/TikTok/Facebook strategy for local dominance
✅ Targeted ad campaigns to reach every potential customer nearby
✅ Review generation to boost your online reputation
✅ Monthly analytics & optimization for sustained growth

My recent clients went from minimal social presence to 10K+ local followers and a 60% increase in walk-ins within 60 days.

I'd love to offer you a free content strategy session — no strings attached. Would you be open to a quick chat?

Cheers,
[Your Name]
Social Media Growth Strategist | [Your Agency]
[Your Phone] | [Your Website]`
        };
    }
}

// --- Daily Email Tracker ---
const DAILY_LIMIT = 20;
const TRACKER_KEY = 'bf_email_tracker';

function getEmailTracker(): { date: string; count: number; sentIds: string[] } {
    const today = new Date().toISOString().slice(0, 10);
    try {
        const raw = localStorage.getItem(TRACKER_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            if (data.date === today) return data;
        }
    } catch { /* ignore */ }
    return { date: today, count: 0, sentIds: [] };
}

function incrementEmailTracker(bizId: string) {
    const tracker = getEmailTracker();
    tracker.count += 1;
    tracker.sentIds.push(bizId);
    localStorage.setItem(TRACKER_KEY, JSON.stringify(tracker));
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Record<string, CRMEntry>>({});
    const [loading, setLoading] = useState(true);
    const [emailModal, setEmailModal] = useState<{ id: string; biz: Business; subject: string; body: string } | null>(null);
    const [emailsSentToday, setEmailsSentToday] = useState(0);
    const [sentIds, setSentIds] = useState<string[]>([]);
    const [bulkToast, setBulkToast] = useState<string | null>(null);
    const [pitchChooser, setPitchChooser] = useState<{ mode: 'single'; id: string; biz: Business } | { mode: 'bulk' } | null>(null);
    const [apiKeys, setApiKeys] = useState({ gemini: '', serpApi: '' });
    const [analysisModal, setAnalysisModal] = useState<{ id?: string; biz: Business; analysis: string; loading: boolean; model?: string } | null>(null);

    useEffect(() => {
        const savedData = localStorage.getItem('bf_crm_data');
        if (savedData) {
            try { setLeads(JSON.parse(savedData)); } catch (e) { console.error("Failed to load leads", e); }
        }
        const tracker = getEmailTracker();
        setEmailsSentToday(tracker.count);
        setSentIds(tracker.sentIds);

        const savedGemini = localStorage.getItem('bf_gemini_key');
        const savedSerp = localStorage.getItem('bf_serp_key');
        if (savedGemini || savedSerp) {
            setApiKeys({
                gemini: savedGemini || '',
                serpApi: savedSerp || ''
            });
        }

        setLoading(false);
    }, []);

    const updateLead = (id: string, field: 'status' | 'notes', value: string) => {
        setLeads(prev => {
            const entry = prev[id];
            if (!entry) return prev;
            const newData = { ...prev, [id]: { ...entry, [field]: value } };
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
                `"${b.title.replace(/"/g, '""')}"`, entry.status,
                `"${entry.notes.replace(/"/g, '""')}"`, `"${b.phone || ''}"`,
                `"${b.email || ''}"`, `"${b.website || ''}"`,
                b.rating || '', new Date(entry.savedAt || Date.now()).toLocaleDateString()
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

    const openEmailForBiz = (id: string, biz: Business) => {
        if (!biz.email) return;
        if (emailsSentToday >= DAILY_LIMIT) {
            alert(`Daily limit reached! You've sent ${DAILY_LIMIT} emails today. Come back tomorrow.`);
            return;
        }
        setPitchChooser({ mode: 'single', id, biz });
    };

    const handlePitchChoice = (pitchType: PitchType) => {
        if (!pitchChooser) return;

        if (pitchChooser.mode === 'single') {
            const { id, biz } = pitchChooser;
            const { subject, body } = generateColdEmail(biz, pitchType);
            setPitchChooser(null);
            setEmailModal({ id, biz, subject, body });
        } else {
            // Bulk email flow
            setPitchChooser(null);
            executeBulkEmail(pitchType);
        }
    };

    const sendViaGmail = () => {
        if (!emailModal) return;
        const toEmail = emailModal.biz.email || '';
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(emailModal.subject)}&body=${encodeURIComponent(emailModal.body)}`;
        window.open(gmailUrl, '_blank');
        incrementEmailTracker(emailModal.id);
        setEmailsSentToday(prev => prev + 1);
        setSentIds(prev => [...prev, emailModal.id]);
        updateLead(emailModal.id, 'status', 'Contacted');
        setEmailModal(null);
    };

    const handleBulkEmail = () => {
        const tracker = getEmailTracker();
        const rem = DAILY_LIMIT - tracker.count;
        if (rem <= 0) {
            setBulkToast("Daily limit reached! Come back tomorrow.");
            setTimeout(() => setBulkToast(null), 3000);
            return;
        }
        const eligible = leadsList.filter(([id, entry]) => !tracker.sentIds.includes(id) && !!entry.business.email);
        if (eligible.length === 0) {
            setBulkToast("No more leads with emails to send!");
            setTimeout(() => setBulkToast(null), 3000);
            return;
        }
        setPitchChooser({ mode: 'bulk' });
    };

    const handleAnalyze = async (id: string, biz: Business) => {
        if (!apiKeys.serpApi) {
            alert("Please configure your SerpAPI key in the Finder Settings first.");
            return;
        }

        setAnalysisModal({ id, biz, analysis: '', loading: true } as any);

        try {
            const params = new URLSearchParams();
            if (biz.data_id) params.set('data_id', biz.data_id);
            params.set('q', `${biz.title} ${biz.address}`);

            const res = await fetch(`/api/analyze-reviews?${params.toString()}`, {
                headers: { 'x-serp-key': apiKeys.serpApi }
            });
            const data = await res.json();

            if (data.error) {
                setAnalysisModal({ id, biz, analysis: `\u26a0\ufe0f ${data.error}`, loading: false } as any);
                return;
            }

            const reviewTexts: string[] = data.reviews || [];
            if (reviewTexts.length === 0) {
                setAnalysisModal({ id, biz, analysis: "No reviews found for this business. They may not have any Google reviews yet.", loading: false } as any);
                return;
            }

            if (!apiKeys.gemini) {
                const rawDisplay = `Found ${reviewTexts.length} reviews (no Gemini key for AI analysis):\n\n${reviewTexts.slice(0, 5).map((t: string, i: number) => `${i + 1}. "${t}"`).join('\n\n')}`;
                setAnalysisModal({ id, biz, analysis: rawDisplay, loading: false } as any);
                return;
            }

            const prompt = `You are a business consultant. Analyze these ${reviewTexts.length} customer reviews and provide a structured report.\n\n## Instructions:\n1. Identify the Top 3-5 specific **Pain Points** customers are complaining about. Be very specific.\n2. Identify the Top 2-3 **Strengths** that customers love.\n3. Write a **Cold Outreach Hook** \u2014 a single powerful sentence for a cold email that references a specific pain point.\n\n## Format:\n\n\ud83d\udd34 **PAIN POINTS:**\n1. [Specific complaint] \u2014 mentioned by X reviewers\n2. ...\n\n\ud83d\udfe2 **STRENGTHS:**\n1. [What they love]\n2. ...\n\n\ud83c\udfaf **COLD OUTREACH HOOK:**\n"[A single sentence pitch referencing a specific pain point]"\n\n## Reviews:\n${reviewTexts.map((t: string, i: number) => `Review ${i + 1}: "${t}"`).join('\n\n')}`;

            // These are the ACTUAL model names from ListModels API (Feb 2026)
            const models = [
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite',
                'gemini-2.5-pro',
            ];

            const trimmedKey = apiKeys.gemini.trim();
            console.log("Analyzing reviews with Gemini... (Version 3.0 - Verified Models)");
            let geminiData: any = null;
            let usedModel = '';

            for (const model of models) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${trimmedKey}`;
                    console.log(`Trying model: ${model}...`);
                    const geminiRes = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });
                    geminiData = await geminiRes.json();

                    if (!geminiData.error) {
                        usedModel = model;
                        console.log(`✅ Success with model: ${model}`);
                        break;
                    }
                    console.warn(`Model ${model} failed:`, geminiData.error?.message);
                } catch (e) {
                    console.warn(`Model ${model} network error:`, e);
                }
            }

            if (!geminiData || geminiData.error) {
                setAnalysisModal({ id, biz, analysis: `\u26a0\ufe0f All Gemini models failed. Last error: ${geminiData?.error?.message || 'Unknown error'}`, loading: false } as any);
                return;
            }

            const analysis = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!analysis) {
                setAnalysisModal({ id, biz, analysis: "\u26a0\ufe0f Gemini returned an empty response. The reviews may have triggered a content filter.", loading: false } as any);
                return;
            }

            const displayText = analysis + `\n\n\ud83d\udcca Analyzed ${reviewTexts.length} of ${data.reviews_count} total reviews.`;
            setAnalysisModal({ id, biz, analysis: displayText, loading: false, model: usedModel } as any);
        } catch (err: any) {
            console.error("Analysis error:", err);
            setAnalysisModal({ id, biz, analysis: `\u26a0\ufe0f Error: ${err.message || 'Something went wrong.'}`, loading: false } as any);
        }
    };

    const executeBulkEmail = (pitchType: PitchType) => {
        const tracker = getEmailTracker();
        const rem = DAILY_LIMIT - tracker.count;
        const eligible = leadsList.filter(([id, entry]) => !tracker.sentIds.includes(id) && !!entry.business.email);
        const batch = eligible.slice(0, rem);
        if (batch.length === 0) return;

        const allEmails = batch.map(([, entry]) => entry.business.email!).join(',');
        const { subject, body } = generateBulkEmail(pitchType);

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(allEmails)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');

        batch.forEach(([id]) => {
            incrementEmailTracker(id);
            updateLead(id, 'status', 'Contacted');
        });
        setEmailsSentToday(prev => prev + batch.length);
        setSentIds(prev => [...prev, ...batch.map(([id]) => id)]);

        setBulkToast(`Opened Gmail with ${batch.length} recipients!`);
        setTimeout(() => setBulkToast(null), 3000);
    };

    const leadsList = Object.entries(leads)
        .filter(([, entry]) => !!entry.business)
        .sort((a, b) => (b[1].savedAt || 0) - (a[1].savedAt || 0));

    const remaining = DAILY_LIMIT - emailsSentToday;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans pb-20 selection:bg-blue-500 selection:text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            {/* Bulk Toast */}
            {bulkToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-2xl shadow-blue-500/30 text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <Send className="w-4 h-4" /> {bulkToast}
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <div className="mb-6">
                    <Link href="/finder" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Finder
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">My Saved Leads</h1>
                        <p className="text-slate-400">Manage and track your business opportunities.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Daily Email Counter */}
                        {leadsList.length > 0 && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold ${remaining > 5 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : remaining > 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                <Mail className="w-3.5 h-3.5" />
                                {remaining}/{DAILY_LIMIT} emails left today
                            </div>
                        )}
                        {/* Bulk Email Button */}
                        {leadsList.length > 0 && (
                            <button onClick={handleBulkEmail} disabled={remaining <= 0}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 text-sm hover:scale-105 active:scale-95">
                                <Send className="w-4 h-4" /> Bulk Email ({Math.min(remaining, leadsList.filter(([id, entry]) => !sentIds.includes(id) && !!entry.business.email).length)})
                            </button>
                        )}
                        {leadsList.length > 0 && (
                            <button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 text-sm">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        )}
                    </div>
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
                        {leadsList.map(([id, entry], idx) => {
                            const alreadySent = sentIds.includes(id);
                            return (
                                <div key={id}
                                    className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors shadow-lg group animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                                    style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Business Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{entry.business.title}</h3>
                                                        <div className="relative group/verify">
                                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-slate-700 hover:bg-blue-600 hover:text-white rounded-md text-slate-400 flex items-center gap-1.5 px-2" title="Deep Dive Verification">
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span className="text-[10px] font-bold uppercase tracking-wider">Verify</span>
                                                            </button>
                                                            <div className="absolute left-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 invisible group-hover/verify:visible opacity-0 group-hover/verify:opacity-100 transition-all transform origin-top-left scale-95 group-hover/verify:scale-100">
                                                                <div className="px-3 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700/50 mb-1">Verification Suite</div>
                                                                <a href={`https://www.google.com/search?q=${encodeURIComponent(entry.business.title + " " + entry.business.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"><Search className="w-3.5 h-3.5 text-blue-400" /> Google Search</a>
                                                                <a href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(entry.business.title + " " + entry.business.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"><Linkedin className="w-3.5 h-3.5 text-blue-500" /> LinkedIn Profile</a>
                                                                <a href={`https://www.facebook.com/search/top/?q=${encodeURIComponent(entry.business.title + " " + entry.business.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"><Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook Page</a>
                                                                <a href={`https://www.instagram.com/explore/tags/${encodeURIComponent(entry.business.title.replace(/\s+/g, '').toLowerCase())}/`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"><Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram Tag</a>
                                                                <a href={`https://www.yelp.com/search?find_desc=${encodeURIComponent(entry.business.title)}&find_loc=${encodeURIComponent(entry.business.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"><ExternalLink className="w-3.5 h-3.5 text-rose-500" /> Yelp Business</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                                        <span className="bg-slate-700/50 px-2 py-0.5 rounded text-xs border border-slate-600/50">{entry.business.type || 'Business'}</span>
                                                        <span>•</span>
                                                        <MapPin className="w-3.5 h-3.5" /> {entry.business.address}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-300">
                                                {entry.business.phone && (
                                                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /><span className="select-all hover:text-white">{entry.business.phone}</span></div>
                                                )}
                                                {entry.business.website && (
                                                    <a href={entry.business.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline"><Globe className="w-4 h-4" /> Website</a>
                                                )}
                                                {entry.business.rating && (
                                                    <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="font-bold text-white">{entry.business.rating}</span><span className="text-slate-500">({entry.business.reviews})</span></div>
                                                )}
                                            </div>

                                            {/* EMAIL BUTTON */}
                                            <div className="mt-4 flex items-center gap-3">
                                                {entry.business.email ? (
                                                    <>
                                                        <button
                                                            onClick={() => openEmailForBiz(id, entry.business)}
                                                            disabled={remaining <= 0 && !alreadySent}
                                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-105 active:scale-95 ${alreadySent
                                                                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                                                                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/20 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:shadow-none'
                                                                }`}
                                                        >
                                                            {alreadySent ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                                            {alreadySent ? 'Email Sent' : 'Send Cold Email'}
                                                        </button>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <span className="text-emerald-400 font-bold">@</span> {entry.business.email}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800/50 border border-slate-700/50 text-slate-500">
                                                        <XCircle className="w-4 h-4 text-slate-600" />
                                                        No Email on File
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => handleAnalyze(id, entry.business)}
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
                                                >
                                                    <Sparkles className="w-4 h-4 text-violet-400" />
                                                    Analyze Pain Points
                                                </button>
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
                                                <select value={entry.status} onChange={(e) => updateLead(id, 'status', e.target.value as CRMEntry['status'])}
                                                    className={`w-full text-sm font-bold px-3 py-2.5 rounded-lg border-none ring-1 transition-all appearance-none cursor-pointer focus:ring-2
                                                    ${(entry.status === 'Contacted') ? 'bg-blue-500/20 text-blue-300 ring-blue-500/50 focus:ring-blue-500' :
                                                            (entry.status === 'Call Later') ? 'bg-amber-500/20 text-amber-300 ring-amber-500/50 focus:ring-amber-500' :
                                                                (entry.status === 'Good Lead') ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/50 focus:ring-emerald-500' :
                                                                    (entry.status === 'High Value') ? 'bg-violet-500/20 text-violet-300 ring-violet-500/50 focus:ring-violet-500' :
                                                                        'bg-slate-700 text-slate-400 ring-slate-600 focus:ring-slate-500'}`}>
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
                                            <textarea value={entry.notes} onChange={(e) => updateLead(id, 'notes', e.target.value)} placeholder="Lead notes..."
                                                className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder-slate-600" />
                                            <div className="text-right text-[10px] text-slate-600">
                                                Saved: {new Date(entry.savedAt || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* Email Preview Modal */}
            {emailModal && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEmailModal(null)} />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Cold Email Preview</h3>
                                    <p className="text-xs text-slate-400">for {emailModal.biz.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setEmailModal(null)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {/* To */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">To</label>
                                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
                                    {emailModal.biz.email || <span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> No email on file — you&apos;ll need to add it in Gmail</span>}
                                </div>
                            </div>
                            {/* Subject */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Subject</label>
                                <input type="text" value={emailModal.subject}
                                    onChange={(e) => setEmailModal({ ...emailModal, subject: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>
                            {/* Body */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Email Body</label>
                                <textarea value={emailModal.body}
                                    onChange={(e) => setEmailModal({ ...emailModal, body: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                                    rows={16} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-5 border-t border-slate-700/50 bg-slate-800/30">
                            <p className="text-xs text-slate-500">You can edit the email before opening Gmail</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setEmailModal(null)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">Cancel</button>
                                <button onClick={sendViaGmail}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
                                    <Send className="w-4 h-4" /> Open in Gmail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pitch Type Chooser Modal */}
            {pitchChooser && (
                <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPitchChooser(null)} />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-violet-600/10 to-blue-600/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Choose Your Pitch</h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {pitchChooser.mode === 'single'
                                            ? `Crafting email for ${(pitchChooser as { mode: 'single'; biz: Business }).biz.title}`
                                            : 'Select the service to pitch in your bulk email'}
                                    </p>
                                </div>
                                <button onClick={() => setPitchChooser(null)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 grid gap-4">
                            <button
                                onClick={() => handlePitchChoice('webdev')}
                                className="group relative flex items-start gap-4 p-5 rounded-xl border-2 border-slate-700/50 hover:border-blue-500/50 bg-slate-800/30 hover:bg-blue-600/10 transition-all text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">Web Development</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">Pitch a modern, high-converting website — landing pages, SEO, booking systems, and premium web design.</p>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">
                                    <Send className="w-4 h-4" />
                                </div>
                            </button>
                            <button
                                onClick={() => handlePitchChoice('smma')}
                                className="group relative flex items-start gap-4 p-5 rounded-xl border-2 border-slate-700/50 hover:border-violet-500/50 bg-slate-800/30 hover:bg-violet-600/10 transition-all text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Megaphone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">Social Media Marketing</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">Pitch social media management — content strategy, viral videos, targeted ads, and local brand domination.</p>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-violet-400">
                                    <Send className="w-4 h-4" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Review Analysis Modal */}
            {analysisModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setAnalysisModal(null)} />
                    <div className="relative bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-400">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-violet-600/10 to-indigo-600/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">AI Pain-Point Analysis</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Scanned reviews for {analysisModal.biz.title}</p>
                                </div>
                            </div>
                            <button onClick={() => setAnalysisModal(null)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            {analysisModal.loading ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-violet-400 animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">Extracting Deep Insights...</p>
                                        <p className="text-sm text-slate-500 mt-1 italic">Analyzing reviews to find the perfect hook</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 leading-relaxed text-slate-200">
                                        <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm md:text-base selection:bg-violet-500/30">
                                            {analysisModal.analysis}
                                        </div>
                                    </div>

                                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5">
                                        <div className="flex items-start gap-3">
                                            <Target className="w-5 h-5 text-blue-400 mt-1" />
                                            <div>
                                                <h4 className="text-sm font-bold text-blue-300 uppercase tracking-widest mb-1">PRO TIP</h4>
                                                <p className="text-xs text-blue-200/70 leading-relaxed">
                                                    Use the "Pain Points" found above to personalize your cold email. Mentioning a specific customer complaint makes your offer 10x more compelling.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-slate-800/30 flex items-center justify-between">
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">
                                Powered by {analysisModal.model || 'Gemini'}
                            </p>
                            <button
                                onClick={() => {
                                    setAnalysisModal(null);
                                    setEmailModal({
                                        id: (analysisModal as any).id,
                                        biz: analysisModal.biz,
                                        subject: `Regarding the reviews for ${analysisModal.biz.title}`,
                                        body: `Hi ${analysisModal.biz.title} team,\n\nI was just looking over your recent customer reviews and noticed a recurring theme...\n\n---\nAI ANALYSIS OF YOUR REVIEWS:\n${analysisModal.analysis}\n---\n\nI specialize in fixing these exact issues. Are you open to a quick chat?\n\nBest,\n[Your Name]`
                                    });
                                }}
                                disabled={analysisModal.loading}
                                className="px-6 py-3 rounded-xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/20"
                            >
                                Use in Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
