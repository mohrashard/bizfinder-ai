/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense, startTransition } from 'react';
import {
    Search,
    MapPin,
    Phone,
    Globe,
    Star,
    Download,
    Settings,
    Loader2,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Filter,
    ArrowDownWideNarrow,
    Plus,
    X,
    Sparkles,
    Target,
    Mail,
    MessageSquare

} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// --- Types ---

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

interface SearchParams {
    category: string;
    location: string;
    filters: {
        noWebsite?: boolean;
        openNow?: boolean;
        minRating?: number;
        noSocials?: boolean;
        hasSocials?: boolean;
    };
}

interface ApiKeys {
    gemini: string;
    serpApi: string;
}

interface PromptData {
    websitePrompt: string;
    websiteEmail: string;
    websiteCallScript: string;
    marketingPrompt: string;
    marketingEmail: string;
    marketingCallScript: string;
}



interface CRMEntry {
    business: Business; // Store full business data so we can display it on the Leads page without searching
    status: 'New' | 'Contacted' | 'Call Later' | 'Good Lead' | 'High Value';
    notes: string;
    savedAt: number;
}

// --- Logic: Opportunity Score Calculation ---

const calculateOpportunity = (biz: Partial<Business>): { score: number, factors: string[] } => {
    let score = 0;
    const factors: string[] = [];

    // 1. Missing Website (+30)
    if (!biz.website) {
        score += 30;
        factors.push("Missing Website");
    }

    // 2. Missing Socials (+20)
    const hasSocials = biz.socials && Object.values(biz.socials).some(v => !!v);
    if (!hasSocials) {
        score += 20;
        factors.push("Missing Social Media");
    }

    // 3. Low Ratings
    const rating = biz.rating || 0;
    if (rating > 0 && rating < 3.5) {
        score += 15;
        factors.push("Low Rating (< 3.5)");
    } else if (rating >= 3.5 && rating < 4.0) {
        score += 5;
        factors.push("Mediocre Rating (< 4.0)");
    }

    // 4. Low Review Count
    const reviews = biz.reviews || 0;
    if (reviews < 10) {
        score += 20;
        factors.push("Very Low Reviews (< 10)");
    } else if (reviews < 50) {
        score += 10;
        factors.push("Low Reviews (< 50)");
    }

    // 5. Missing Email
    if (!biz.email) {
        score += 10;
        factors.push("Missing Email");
    }

    // 6. Poor Online Presence Bonus (No Web + No Socials)
    if (!biz.website && !hasSocials) {
        score += 5;
        factors.push("Poor Online Presence");
    }

    return { score: Math.min(score, 100), factors };
};

// --- Mock Data Service (for Demo Mode) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processSerpResult = (item: any): Business => {
    const socials: NonNullable<Business['socials']> = item.extracted_socials ? { ...item.extracted_socials } : {};
    let website = item.website;
    const links = Array.isArray(item.links) ? item.links : [];

    // Helper to detect domain
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkDomain = (url: any, domain: string) =>
        (typeof url === 'string') && url.toLowerCase().includes(domain);

    // 1. Check main website - if it's actually a social link, move it to socials and clear website
    if (website && typeof website === 'string') {
        let isSocial = false;
        if (checkDomain(website, 'facebook.com')) { socials.facebook = website; isSocial = true; }
        else if (checkDomain(website, 'instagram.com')) { socials.instagram = website; isSocial = true; }
        else if (checkDomain(website, 'twitter.com') || checkDomain(website, 'x.com')) { socials.twitter = website; isSocial = true; }
        else if (checkDomain(website, 'linkedin.com')) { socials.linkedin = website; isSocial = true; }

        if (isSocial) {
            website = undefined;
        }
    }

    // 2. Check "links" array from SerpAPI (sometimes provided)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    links.forEach((link: any) => {
        const url = link.link || link.url;
        if (!url || typeof url !== 'string') return;
        if (checkDomain(url, 'facebook.com')) socials.facebook = url;
        if (checkDomain(url, 'instagram.com')) socials.instagram = url;
        if (checkDomain(url, 'twitter.com') || checkDomain(url, 'x.com')) socials.twitter = url;
        if (checkDomain(url, 'linkedin.com')) socials.linkedin = url;
    });

    const { score, factors } = calculateOpportunity({
        website,
        socials,
        rating: item.rating,
        reviews: item.reviews,
        email: item.email
    });

    return {
        title: item.title,
        address: item.address,
        phone: item.phone,
        website: website, // Use the potentially screened website
        rating: item.rating,
        reviews: item.reviews,
        type: item.type,
        open_state: item.open_state,
        hours: item.hours,
        gps_coordinates: item.gps_coordinates,
        email: item.email,
        socials,
        opportunity_score: score,
        opportunity_factors: factors
    };
};

const MOCK_BUSINESSES: Business[] = [
    {
        title: "Al Safa Electricians",
        address: "Al Rigga Rd, Deira, Dubai, UAE",
        phone: "+971 4 222 1234",
        website: "https://alsafa-electric.ae",
        rating: 4.5,
        reviews: 120,
        type: "Electrician",
        open_state: "Open Now",
        hours: "8:00 AM - 10:00 PM",
        email: "contact@alsafa-electric.ae",
        socials: { facebook: "https://fb.com/alsafa" }
    },
    {
        title: "Quick Fix Home Services",
        address: "Marina Walk, Dubai Marina, Dubai",
        phone: "+971 50 999 8888",
        rating: 4.8,
        reviews: 45,
        type: "Handyman",
        open_state: "Open 24 Hours",
        hours: "24 Hours",
        // No website, no socials -> Ideal lead
    },
    {
        title: "Dubai Tech Solutions",
        address: "Business Bay, Dubai",
        phone: "+971 4 444 5555",
        website: "https://dubaitech.com",
        rating: 3.9,
        reviews: 12,
        type: "IT Support",
        open_state: "Closed",
        hours: "9:00 AM - 6:00 PM",
        email: "info@dubaitech.com",
        socials: { linkedin: "https://linkedin.com/company/dubaitech", twitter: "https://x.com/dubaitech" }
    },
    {
        title: "Old Town Plumbers (No Website)",
        address: "Al Fahidi, Bur Dubai",
        phone: "+971 4 353 1111",
        rating: 4.2,
        reviews: 89,
        type: "Plumber",
        open_state: "Open Now",
        hours: "7:00 AM - 7:00 PM",
        // No website, maybe socials?
        socials: { instagram: "https://instagr.am/oldtownplumbers" }
    },
    {
        title: "City Center Cafe",
        address: "Downtown, Dubai",
        phone: "+971 4 123 9876",
        rating: 4.1,
        reviews: 230,
        type: "Cafe",
        open_state: "Open Now",
        hours: "8:00 AM - 11:00 PM",
        socials: { instagram: "https://instagr.am/citycentercafe" }
    },
    {
        title: "Green Garden Landscaping",
        address: "Jumeirah, Dubai",
        phone: "+971 55 555 1234",
        website: "https://gg-landscape.ae",
        rating: 4.6,
        reviews: 56,
        type: "Landscaping",
        open_state: "Open Now",
        hours: "6:00 AM - 6:00 PM",
        email: "hello@gg-landscape.ae"
    },
    {
        title: "Speedy Motors",
        address: "Al Quoz, Dubai",
        phone: "+971 4 333 4444",
        rating: 3.5,
        reviews: 15,
        type: "Mechanic",
        open_state: "Closed",
        hours: "8:00 AM - 8:00 PM"
    },
    {
        title: "Marina Dental Clinic",
        address: "Dubai Marina",
        phone: "+971 4 444 9999",
        website: "https://marinadental.com",
        rating: 4.9,
        reviews: 300,
        type: "Dentist",
        open_state: "Open Now",
        hours: "9:00 AM - 9:00 PM",
        socials: { facebook: "https://fb.com/marinadental", instagram: "https://instagr.am/marinadental" }
    }
].map(b => ({ ...b, ...calculateOpportunity(b) }));

// --- Helpers ---

const getBusinessId = (biz: Business) => `${biz.title}|${biz.address}`;

// Pre-computed constants for SVG circle
const CIRCLE_RADIUS = 20;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const BusinessRow = React.memo(({
    biz,
    crmEntry,
    idx,
    updateCRM,
    handleGeneratePrompts,
    handleOpenCrm
}: {
    biz: Business;
    crmEntry: CRMEntry | undefined;
    idx: number;
    updateCRM: (biz: Business, field: any, value: any) => void;
    handleGeneratePrompts: (biz: Business) => void;
    handleOpenCrm: (biz: Business) => void;
}) => {
    // Pre-compute expensive values once per render
    const score = biz.opportunity_score || 0;
    const strokeOffset = CIRCLE_CIRCUMFERENCE * (1 - score / 100);
    const scoreColorClass = score > 70 ? 'text-emerald-500' : score > 40 ? 'text-amber-500' : 'text-slate-500';
    const scoreLabelClass = score > 70 ? 'text-emerald-400' : score > 40 ? 'text-amber-400' : 'text-slate-400';
    const isOpen = biz.open_state?.toLowerCase().includes('open');
    const isClosed = biz.open_state?.toLowerCase().includes('close');
    const hasSocials = biz.socials && Object.keys(biz.socials).length > 0;
    const hasStatus = crmEntry?.status && crmEntry.status !== 'New';

    return (
        <tr className="hover:bg-slate-700/30 transition-colors" style={{ contain: 'layout style' }}>
            {/* Business Name Column */}
            <td className="px-6 py-4 align-top">
                <div className="flex items-start gap-2 group/name">
                    <div>
                        <div className="font-bold text-white text-base mb-1">{biz.title}</div>
                        <div className="text-xs text-slate-300 bg-slate-700/50 border border-slate-600 inline-block px-2 py-0.5 rounded-full">
                            {biz.type || 'Business'}
                        </div>
                    </div>
                    <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(biz.title + " " + biz.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-0 group-hover/name:opacity-100 transition-opacity p-1.5 bg-slate-700 hover:bg-blue-600 hover:text-white rounded-md text-slate-400"
                        title="Verify on Google"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </a>
                </div>
            </td>

            {/* Details Column */}
            <td className="px-6 py-4 align-top max-w-xs">
                <div className="flex items-start gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{biz.address}</span>
                </div>
                {biz.hours && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                        <Clock className="w-3 h-3" />
                        {biz.hours}
                    </div>
                )}
            </td>

            {/* Contact Column */}
            <td className="px-6 py-4 align-top">
                <div className="space-y-1">
                    {biz.phone ? (
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <Phone className="w-3.5 h-3.5 text-blue-400" />
                            <span className="select-all hover:text-white transition-colors cursor-pointer">{biz.phone}</span>
                        </div>
                    ) : (
                        <span className="text-slate-600 italic text-xs">No phone</span>
                    )}
                    {biz.email ? (
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <span className="text-xs font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1 rounded">@</span>
                            <span className="select-all hover:text-white transition-colors cursor-pointer">{biz.email}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                            <span className="opacity-50">@</span>
                            <span className="italic">No Email</span>
                        </div>
                    )}
                </div>
            </td>

            {/* Status & Socials Column */}
            <td className="px-6 py-4 align-top">
                <div className="space-y-3">
                    {/* Open Status */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit
                        ${isOpen
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : isClosed
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-slate-700/50 text-slate-400 border-slate-600'}`}
                    >
                        {isOpen ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {biz.open_state || 'Unknown'}
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-2">
                        {hasSocials ? (
                            <>
                                {biz.socials?.facebook && <a href={biz.socials.facebook} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-transform"><Globe className="w-4 h-4" /></a>}
                                {biz.socials?.instagram && <a href={biz.socials.instagram} target="_blank" rel="noreferrer" className="text-pink-400 hover:text-pink-300 hover:scale-110 transition-transform"><Globe className="w-4 h-4" /></a>}
                                {biz.socials?.twitter && <a href={biz.socials.twitter} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 hover:scale-110 transition-transform"><Globe className="w-4 h-4" /></a>}
                                {biz.socials?.linkedin && <a href={biz.socials.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 hover:scale-110 transition-transform"><Globe className="w-4 h-4" /></a>}
                            </>
                        ) : (
                            <span className="text-xs text-slate-600 italic">No Socials Found</span>
                        )}
                    </div>
                </div>
            </td>

            {/* CRM Column (Button Only) */}
            <td className="px-6 py-4 align-top w-40">
                <button
                    onClick={() => handleOpenCrm(biz)}
                    className={`w-full flex items-center justify-center gap-2 border text-xs font-bold py-2.5 rounded-lg transition-all shadow-sm
                        ${hasStatus
                            ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20'
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'}`}
                >
                    <Target className="w-3.5 h-3.5" />
                    {hasStatus ? crmEntry?.status : 'Manage'}
                </button>
            </td>

            {/* Opportunity Score Column */}
            <td className="px-6 py-4 align-top">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" style={{ contain: 'strict' }}>
                                <circle
                                    cx="24"
                                    cy="24"
                                    r={CIRCLE_RADIUS}
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-slate-700"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r={CIRCLE_RADIUS}
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={CIRCLE_CIRCUMFERENCE}
                                    strokeDashoffset={strokeOffset}
                                    className={scoreColorClass}
                                />
                            </svg>
                            <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreLabelClass}`}>
                                {score}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-300">Potential</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Score</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1 w-32">
                        {(biz.opportunity_factors || []).slice(0, 2).map((f, i) => (
                            <div key={i} className="text-[9px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400 whitespace-nowrap truncate max-w-[120px]" title={f}>
                                {f}
                            </div>
                        ))}
                        {(biz.opportunity_factors?.length || 0) > 2 && (
                            <span className="text-[9px] text-blue-400 cursor-help" title={biz.opportunity_factors?.slice(2).join(', ')}>
                                +{biz.opportunity_factors!.length - 2} more
                            </span>
                        )}
                    </div>
                </div>
            </td>

            {/* Web & Rating Column (Right Aligned) */}
            <td className="px-6 py-4 align-top text-right">
                <div className="flex flex-col items-end gap-2">
                    {biz.website ? (
                        <a
                            href={biz.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 text-xs hover:underline"
                        >
                            {biz.website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]} <Globe className="w-3 h-3" />
                        </a>
                    ) : (
                        <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-xs font-medium border border-rose-500/20">
                            No Website
                        </span>
                    )}

                    <div className="flex items-center gap-1 mt-1 justify-end">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-200">{biz.rating || 'N/A'}</span>
                        <span className="text-xs text-slate-500">({biz.reviews || 0})</span>
                    </div>

                    {/* Prompt Button */}
                    <button
                        onClick={() => handleGeneratePrompts(biz)}
                        className="mt-3 flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg shadow-violet-500/20 transform hover:scale-105 transition-all"
                    >
                        <Sparkles className="w-3 h-3" /> Get Prompt
                    </button>
                </div>
            </td>
        </tr>
    );
}, (prev, next) => {
    return prev.biz === next.biz &&
        prev.crmEntry === next.crmEntry &&
        prev.updateCRM === next.updateCRM &&
        prev.handleOpenCrm === next.handleOpenCrm &&
        prev.handleGeneratePrompts === next.handleGeneratePrompts;
});
BusinessRow.displayName = 'BusinessRow';

// --- Main Component ---

export default function BusinessFinderApp() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<string>('');

    // Results & Pagination
    const [rawResults, setRawResults] = useState<Business[]>([]); // Store all fetched results
    const [nextOffset, setNextOffset] = useState(0); // Pagination cursor
    const [searchParamsState, setSearchParamsState] = useState<SearchParams | null>(null); // Store parsed params for pagination

    // UI State
    const [showSettings, setShowSettings] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    // Filters & Sort
    const [manualFilters, setManualFilters] = useState({
        minRating: 0,
        hasWebsite: false, // false means "All", true means "Must have website"
        noWebsite: false,  // true means "Must NOT have website"
        openNow: false,
        hasSocials: false,
        noSocials: false
    });
    const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'reviews' | 'opportunity'>('opportunity');

    // Prompt Generation State
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [generatedPrompts, setGeneratedPrompts] = useState<PromptData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // CRM Mobile Modal State
    const [editingCrmBiz, setEditingCrmBiz] = useState<Business | null>(null);

    // API Keys state
    const [apiKeys, setApiKeys] = useState<ApiKeys>({
        gemini: '',
        serpApi: ''
    });

    // Get URL search params
    const searchParams = useSearchParams();

    // Load keys from localStorage on mount
    useEffect(() => {
        const savedGemini = localStorage.getItem('bf_gemini_key');
        const savedSerp = localStorage.getItem('bf_serp_key');

        // If localStorage has keys, or if we need to hydrate the state
        if (savedGemini || savedSerp) {
            setApiKeys(prev => ({
                gemini: savedGemini || prev.gemini,
                serpApi: savedSerp || prev.serpApi
            }));
        }
    }, []);

    // Read query from URL params (from Generator page)
    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery && !query) {
            setQuery(urlQuery);
        }
    }, [searchParams, query]);

    // --- CRM State & Logic ---
    const [crmData, setCrmData] = useState<Record<string, CRMEntry>>({});

    // Load CRM data on mount
    useEffect(() => {
        const savedCRM = localStorage.getItem('bf_crm_data');
        if (savedCRM) {
            try {
                setCrmData(JSON.parse(savedCRM));
            } catch (e) {
                console.error("Failed to load CRM data", e);
            }
        }
    }, []);

    const updateCRM = React.useCallback((biz: Business, field: keyof Omit<CRMEntry, 'business' | 'savedAt'>, value: string) => {
        const id = getBusinessId(biz);
        setCrmData(prev => {
            const currentEntry = prev[id] || {
                business: biz,
                status: 'New',
                notes: '',
                savedAt: Date.now()
            };

            // If the entry didn't exist, we just created it with the business data.
            // If it did exist, we update the field.

            const newData = {
                ...prev,
                [id]: {
                    ...currentEntry,
                    [field]: value,
                    savedAt: currentEntry.savedAt || Date.now(), // Preserve original save time or set if missing
                    business: biz // Ensure latest business data is stored
                }
            };
            localStorage.setItem('bf_crm_data', JSON.stringify(newData));
            return newData;
        });
    }, []);

    // --- Text Selection Tooltip Logic (Optimized with debounce) ---
    const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);
    const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleSelection = () => {
            // Debounce selection handling to prevent excessive state updates
            if (selectionTimeoutRef.current) {
                clearTimeout(selectionTimeoutRef.current);
            }
            selectionTimeoutRef.current = setTimeout(() => {
                const selectedText = window.getSelection()?.toString().trim();
                if (selectedText && selectedText.length > 0) {
                    const selectionRange = window.getSelection()?.getRangeAt(0);
                    const rect = selectionRange?.getBoundingClientRect();
                    if (rect) {
                        setSelection({
                            text: selectedText,
                            x: rect.left + window.scrollX + rect.width / 2,
                            y: rect.top + window.scrollY - 10
                        });
                    }
                } else {
                    setSelection(null);
                }
            }, 100);
        };

        // Use passive event listener for better scroll performance
        document.addEventListener('mouseup', handleSelection, { passive: true });
        return () => {
            document.removeEventListener('mouseup', handleSelection);
            if (selectionTimeoutRef.current) {
                clearTimeout(selectionTimeoutRef.current);
            }
        };
    }, []);

    const saveKeys = (newKeys: ApiKeys) => {
        setApiKeys(newKeys);
        localStorage.setItem('bf_gemini_key', newKeys.gemini);
        localStorage.setItem('bf_serp_key', newKeys.serpApi);
        setShowSettings(false);
    };

    // --- Toast State & Logic ---
    const [toast, setToast] = useState<{ message: string, visible: boolean } | null>(null);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        // Hide after 3 seconds
        setTimeout(() => {
            setToast(prev => prev && prev.message === message ? { ...prev, visible: false } : prev);
        }, 3000);
    };

    // --- Logic: 1. Interpret Query with Gemini ---

    const interpretQuery = async (userQuery: string): Promise<SearchParams> => {
        if (!apiKeys.gemini) {
            console.log("No Gemini Key, using basic heuristic parsing");
            const isNoWebsite = userQuery.toLowerCase().includes('without website') || userQuery.toLowerCase().includes('no website');
            return {
                category: userQuery,
                location: '',
                filters: { noWebsite: isNoWebsite }
            };
        }

        try {
            const prompt = `
        You are a search query parser API. 
        Convert this user query into a JSON object: "${userQuery}".
        
        Return ONLY valid JSON. Structure:
        {
          "category": "business type or keyword",
          "location": "extracted location or city",
          "filters": {
            "noWebsite": boolean (true if user specifically asks for businesses WITHOUT websites),
            "openNow": boolean (true if user asks for open now),
            "minRating": number (optional, if specified e.g. 'best' or '4 star'),
            "noSocials": boolean (true if user specifically asks for businesses WITHOUT social media),
            "hasSocials": boolean (true if user specifically asks for businesses WITH social media)
          }
        }
      `;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKeys.gemini}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();

            if (!data.candidates || !data.candidates[0].content) {
                throw new Error("Failed to interpret query with AI.");
            }

            const textBlock = data.candidates[0].content.parts[0].text;
            const jsonString = textBlock.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);

        } catch (err) {
            console.error("Gemini Error:", err);
            return { category: userQuery, location: '', filters: {} };
        }
    };

    // --- Logic: 2. Search Businesses (Backend + Proxy Fallback) ---

    const searchBusinesses = async (params: SearchParams, offset: number = 0) => {
        if (!apiKeys.serpApi) {
            throw new Error("NO_KEY");
        }

        const queryString = `${params.category} ${params.location}`;

        // ------------------------------------------------------------------
        // METHOD A: Try the Backend API Route first (Preferred/Production)
        // ------------------------------------------------------------------
        try {
            const apiRes = await fetch(`/api/search?q=${encodeURIComponent(queryString)}&start=${offset}`, {
                headers: {
                    // Pass the user's key to the backend
                    'x-serp-key': apiKeys.serpApi
                }
            });

            // If 404, it means we are in the Preview (no backend). Throw to trigger fallback.
            if (apiRes.status === 404) throw new Error("BACKEND_NOT_FOUND");

            const apiData = await apiRes.json();

            if (!apiRes.ok) throw new Error(apiData.error || 'Backend Error');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (apiData.local_results || []).map((item: any) => processSerpResult(item));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            // If the backend exists but failed with a real error, stop here.
            if (err.message !== "BACKEND_NOT_FOUND" && err.message !== "Failed to fetch") {
                console.warn("Backend API failed:", err);
                // Only continue to proxy if the error was 404 (route missing) or network failure
            }

            console.log("Backend route unavailable (likely in preview), trying fallback proxies...");

            // ------------------------------------------------------------------
            // METHOD B: Fallback to Client-Side Proxies (For Demo/Preview)
            // ------------------------------------------------------------------

            const url = new URL('https://serpapi.com/search');
            url.searchParams.append('engine', 'google_maps');
            url.searchParams.append('q', queryString);
            url.searchParams.append('api_key', apiKeys.serpApi);
            url.searchParams.append('type', 'search');
            url.searchParams.append('start', offset.toString());

            const proxyStrategies = [
                (target: string) => `https://corsproxy.io/?${encodeURIComponent(target)}`,
                (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}&timestamp=${Date.now()}`
            ];

            for (const strategy of proxyStrategies) {
                try {
                    const proxyUrl = strategy(url.toString());
                    const res = await fetch(proxyUrl);
                    if (!res.ok) continue;
                    const data = await res.json();
                    if (data.error) throw new Error(data.error);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return (data.local_results || []).map((item: any) => processSerpResult(item));
                } catch (proxyErr) {
                    console.error("Proxy strategy failed:", proxyErr);
                }
            }

            // If we reach here, both Backend AND Proxies failed
            throw new Error("Connection failed. Please deploy the Backend API to Vercel.");
        }
    };

    // --- Logic: 3. Handle Search (Initial) ---

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setError(null);
        setRawResults([]); // Clear previous results
        setNextOffset(0);
        setLoading(true);
        setIsUsingFallback(false);

        try {
            // Step 1: Interpret
            setLoadingStep('Consulting Gemini AI to understand your request...');
            const params = await interpretQuery(query);
            setSearchParamsState(params);

            // Sync detected filters to UI state (non-urgent, use transition)
            startTransition(() => {
                setManualFilters({
                    minRating: params.filters.minRating || 0,
                    hasWebsite: false, // Default to all
                    noWebsite: params.filters.noWebsite || false,
                    openNow: params.filters.openNow || false,
                    hasSocials: params.filters.hasSocials || false,
                    noSocials: params.filters.noSocials || false
                });
            });

            // Step 2: Search (Page 0)
            setLoadingStep(`Searching for "${params.category}" in "${params.location || 'detected area'}"...`);
            const data = await searchBusinesses(params, 0);

            setRawResults(data);
            setNextOffset(20); // Prepare for next page

            if (data.length === 0) setError("No results found matching your specific criteria.");

        } catch (err: unknown) {
            handleError(err);
        } finally {
            setLoading(false);
            setLoadingStep('');
        }
    };

    // --- Logic: 4. Load More (Pagination) ---

    const handleLoadMore = async () => {
        if (!searchParamsState) return;

        setLoading(true);
        setLoadingStep('Fetching more results...');

        try {
            if (isUsingFallback) {
                // Mock pagination
                const moreMock = MOCK_BUSINESSES.slice(0, 3).map(b => ({ ...b, title: `${b.title} (Page ${nextOffset / 20 + 1})` }));
                setRawResults(prev => [...prev, ...moreMock]);
                setNextOffset(prev => prev + 20);
            } else {
                // Live pagination
                const data = await searchBusinesses(searchParamsState, nextOffset);
                if (data.length === 0) {
                    setError("No more results available.");
                } else {
                    setRawResults(prev => [...prev, ...data]);
                    setNextOffset(prev => prev + 20);
                }
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
            setLoadingStep('');
        }
    };

    const handleError = (err: unknown) => {
        console.warn("Search failed, falling back to mock data.");

        // Fallback to demo data
        const demoData = [...MOCK_BUSINESSES];
        setRawResults(demoData);
        setIsUsingFallback(true);
        setNextOffset(20);

        const isNoKey = err instanceof Error && err.message === "NO_KEY";
        if (!isNoKey) {
            setError("Live connection blocked. Showing DEMO results. Deploy the '/app/api/search/route.ts' file to Vercel to fix this.");
        }
    };

    // --- Logic: 7. Generate Prompts ---

    const handleGeneratePrompts = React.useCallback((biz: Business) => {
        setIsGenerating(true);
        setSelectedBusiness(biz);

        // 1. Detailed Website Prompt
        const websitePrompt = `Act as a Senior Frontend Architect and UI/UX Expert. Your goal is to architect and build a high-conversion, premium website for a client.

Client Profile:
- **Business Name:** ${biz.title}
- **Industry:** ${biz.type || "General Service"}
- **Location:** ${biz.address}
- **Phone:** ${biz.phone || "Placeholder"}
- **Current Status:** ${biz.website ? "Has outdated site" : "No Professional Website"}
- **Key Offering:** Service-based business in ${biz.address.split(',').pop()?.trim() || "local area"}.

Technical Specifications (Strict adherence required):
- **Framework:** Next.js 14+ (App Router).
- **Styling:** Tailwind CSS (use strictly semantic class names where possible).
- **UI Library:** Shadcn/UI (Radix Primitives) for accessible, premium components.
- **Icons:** Lucide React.
- **Animation:** Framer Motion (subtle, scroll-triggered fade-ins for sections).
- **Fonts:** 'Inter' for body, 'Playfair Display' or 'Montserrat' for headings depending on brand vibe.

Design Requirements:
1.  **Visual Identity:** Create a "Trust & Authority" aesthetic. Use a professional color palette appropriate for the ${biz.type} industry (e.g., Deep Navy & Gold for Law, Sage Green & Earth Tones for Landscaping, Clean White & Medical Blue for Clinics).
2.  **Hero Section:** Must include a high-impact headline, a subheadline addressing a primary customer pain point, and a "Sticky" Call-To-Action (CTA) button (e.g., "Get a Free Quote" or "Book Now").
3.  **Trust Signals:** prominent placement of "5-Star Rated" badges, testimonial carousel, and recognized industry certifications using placeholder logos.
4.  **Service Grid:** specific cards detailing their likely core services (infer these based on the industry: "${biz.type}").
5.  **Lead Capture:** An embedded contact form with validation (Zod + React Hook Form).
6.  **SEO Optimization:** Semantic HTML tags (<header>, <main>, <article>, <footer>) and proper H1-H6 hierarchy.

Output Format:
Provide the **complete single-file React component** code (e.g., 'LandingPage.tsx') that is ready to be dropped into a v0.dev, bolt.new, or similar AI coding environment. Ensure all imports are handled or mocked if external.`;

        // 2. Social Media Marketing (SMMA) Prompt
        const marketingPrompt = `Act as a Chief Marketing Officer (CMO) specializing in Local SEO and Social Media Growth. Develop a comprehensive, aggressive 30-day "Market Domination" strategy for this business.

Target Business:
- **Name:** ${biz.title}
- **Niche:** ${biz.type}
- **Location:** ${biz.address}

Your Output must be a professional Strategy Document formatted in Markdown.

## Phase 1: The Diagnostics
1.  **Ideal Customer Avatar (ICA):** Define exactly who buys from this business (Age, Income, Pain Points, Desires).
2.  **Competitor Gap Analysis:** Identify 3 things competitors in ${biz.address.split(',').pop()?.trim() || "the area"} are likely doing wrong that we can capitalize on.

## Phase 2: Brand & content Strategy
**Visual Direction:**
- Suggest a Color Palette & Typography pairing that screams "Premium".
- Propose 3 Midjourney/DALL-E prompts to generate high-end social media assets.

**The "Viral" Content Pillars (3 Distinct Angles):**
1.  *Educational/Authority:* (e.g., "5 Signs You Need a ${biz.type} Immediately").
2.  *Behind-the-Scenes/Trust:* (e.g., "A Day in the Life," "How We Ensure Quality").
3.  *Social Proof/Results:* (e.g., "Client Transformation," "Before & After").

## Phase 3: The 30-Day Execution Plan
- **Week 1: The Foundation.** Profile optimization (Google Business Profile + Bio), Content Batching.
- **Week 2: The "Pattern Interrupt".** Launch 3 Reels/TikToks using specific hooks provided below.
- **Week 3: The Offer.** specific "Irresistible Offer" script for this industry to drive immediate calls.
- **Week 4: The Scale.** Introduction to a low-budget ($10/day) Meta Ads strategy for local retargeting.

## Bonus: 5 "Copy-Paste" Video Hooks
Write 5 exact scripts (Hook -> Value -> CTA) for short-form video content tailored to the ${biz.type} niche.`;

        // 3. Website Outreach (Email + Call)
        const websiteEmail = `Subject: Quick question about ${biz.title}'s website

Hi ${biz.title} Team,

I was searching for ${biz.type} services in ${biz.address.split(',')[0]} and came across your business.

I noticed that you ${biz.website ? "have a website that could use a modern refresh" : "don't have a website yet"}, which might be causing you to miss out on local customers searching on Google.

I'm a local web developer who specializes in building high-conversion websites for ${biz.type} businesses. I've actually already mocked up a homepage concept for you that shows how we can get you more booked appointments.

Do you have a few minutes this week to take a look? I'd love to send it over.

Best regards,
[Your Name]
Web Design Specialist`;

        const websiteCallScript = `**Cold Call Script for Website Services**

**Intro:**
"Hi, this is [Your Name], I'm a local developer here in the area. am I speaking with the owner or manager?"

**The Hook:**
"Great. The reason I'm calling is I was actually looking for a ${biz.type} online and noticed you guys ${biz.website ? "have an older site" : "don't have a website up yet"}.

**The Value:**
"I work with other ${biz.type} businesses to help them rank higher on Google and get more calls. I've actually put together a quick design mockup for your business specifically.

**The Ask:**
"I'm not trying to sell you anything right now, I just want to send this mockup over so you can see what I'm talking about. What's the best email to send that to?"`;

        // 4. Marketing Outreach (Email + Call)
        const marketingEmail = `Subject: 3 ideas to grow ${biz.title} in the next 30 days

Hi ${biz.title} Team,

I've been analyzing the ${biz.type} market in ${biz.address.split(',')[0]} and noticed a few opportunities that your competitors aren't taking advantage of yet.

I specialize in helping local businesses like yours dominate social media and get more leads. I put together a 30-day "Market Domination" strategy specifically for ${biz.title}.

It includes tailored video topics and a plan to get you more reviews and customers.

Are you open to me sending this strategy over for you to review? No strings attached.

Best,
[Your Name]
Growth Partner`;

        const marketingCallScript = `**Cold Call Script for SMMA/Growth**

**Intro:**
"Hi, this is [Your Name]. I help local businesses here in ${biz.address.split(',')[0]} get more customers through social media.

**The Hook:**
"I was checking out your online presence and saw you have a great reputation ${biz.rating ? `(${biz.rating} stars!)` : ""}, but I think we can get you in front of way more people.

**The Value:**
"I've sketched out a 30-day growth plan that covers exactly how to get more booked appointments using short-form video. It's working really well for others in your industry right now.

**The Ask:**
"I'd love to drop this plan off or email it to you so you can check it out. Would you be opposed to taking a look?"`;

        setGeneratedPrompts({
            websitePrompt,
            marketingPrompt,
            websiteEmail,
            websiteCallScript,
            marketingEmail,
            marketingCallScript
        });
        setIsGenerating(false);
    }, []);

    // --- Logic: 5. Client-Side Filtering & Sorting ---

    const filteredResults = useMemo(() => {
        let res = [...rawResults];

        // Filter
        if (manualFilters.minRating > 0) {
            res = res.filter(b => (b.rating || 0) >= manualFilters.minRating);
        }
        if (manualFilters.hasWebsite) {
            res = res.filter(b => !!b.website);
        }
        if (manualFilters.noWebsite) {
            res = res.filter(b => !b.website);
        }
        if (manualFilters.openNow) {
            // This is a loose check as 'open_state' strings vary
            res = res.filter(b => b.open_state?.toLowerCase().includes('open'));
        }
        if (manualFilters.hasSocials) {
            res = res.filter(b => b.socials && Object.values(b.socials).some(v => !!v));
        }
        if (manualFilters.noSocials) {
            res = res.filter(b => !b.socials || Object.values(b.socials).every(v => !v));
        }

        // Sort
        if (sortBy === 'rating') {
            res.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'reviews') {
            res.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        } else if (sortBy === 'opportunity') {
            res.sort((a, b) => (b.opportunity_score || 0) - (a.opportunity_score || 0));
        }

        return res;
    }, [rawResults, manualFilters, sortBy]);

    // --- Logic: 6. Export ---

    const handleExport = () => {
        if (filteredResults.length === 0) return;

        const headers = ['Name', 'Type', 'Address', 'Phone', 'Email', 'Website', 'Socials', 'Rating', 'Reviews', 'Status', 'Opportunity Score'];
        const rows = filteredResults.map(b => [
            `"${b.title.replace(/"/g, '""')}"`,
            `"${b.type || ''}"`,
            `"${b.address.replace(/"/g, '""')}"`,
            `"${b.phone || ''}"`,
            `"${b.email || ''}"`,
            `"${b.website || ''}"`,
            `"${Object.values(b.socials || {}).join(', ') || ''}"`,
            b.rating || '',
            b.reviews || '',
            b.rating || '',
            b.reviews || '',
            `"${b.open_state || ''}"`,
            b.opportunity_score || 0
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `business_leads_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Render ---

    return (
        <div className="bg-slate-900 text-slate-200 font-sans pb-20 selection:bg-blue-500 selection:text-white" style={{ contain: 'layout style' }}>

            {/* Decorative Background Elements - Using will-change and transform for GPU acceleration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ willChange: 'auto', contain: 'strict' }}>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[80px]" style={{ transform: 'translateZ(0)' }}></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[60px]" style={{ transform: 'translateZ(0)' }}></div>
            </div>

            {/* Navbar */}
            {/* Selection Tooltip */}
            {selection && (
                <div
                    className="absolute z-50 bg-slate-800 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl transform -translate-x-1/2 -translate-y-full flex items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors animate-in fade-in zoom-in-95 duration-200"
                    style={{ top: selection.y, left: selection.x }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(selection.text)}`, '_blank');
                    }}
                >
                    <Search className="w-3 h-3" /> Search "{selection.text.slice(0, 15)}{selection.text.length > 15 ? '...' : ''}"
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-slate-700"></div>
                </div>
            )}

            {/* Settings Toggle Button (floating or positioned) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
                <button
                    onClick={() => setShowSettings(true)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium hover:bg-white/10 px-3 py-2 rounded-lg ml-auto"
                >
                    <Settings className="w-4 h-4" />
                    {(!apiKeys.gemini || !apiKeys.serpApi) ? "Configure APIs (Demo Mode)" : "Settings"}
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

                {/* Search Hero */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Find Business Leads in Seconds
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                        The perfect tool for <strong>Digital Marketing Agencies</strong>. Find high-potential leads by searching for <span className="italic text-blue-400">"saloons in New York without social media"</span> or <span className="italic text-blue-400">"mechanics in Dubai with no website"</span>.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group z-10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. Italian restaurants in Abu Dhabi with high ratings..."
                            className="block w-full pl-12 pr-4 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg shadow-black/20 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-slate-800"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                        </button>
                    </form>

                    {/* Search Status & Info */}
                    <div className="mt-6 min-h-[1.5rem]">
                        {loading && (
                            <span className="text-sm text-blue-400 font-medium flex items-center justify-center gap-2 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" /> {loadingStep}
                            </span>
                        )}
                        {!loading && !apiKeys.serpApi && (
                            <span className="text-sm text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                ⚠️ Running in Demo Mode (Mock Data). Configure API Keys to search live.
                            </span>
                        )}
                        {isUsingFallback && (
                            <div className="flex justify-center mt-2">
                                <span className="text-sm text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-3 h-3" /> Viewing Demo Data (Live Connection Blocked)
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="max-w-3xl mx-auto mb-8 bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-sm">Notice:</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Filters & Results Section */}
                {rawResults.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Filter Bar */}
                        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-700 mb-6 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mr-2">
                                    <Filter className="w-4 h-4" /> Filters:
                                </div>

                                {/* Rating Filter */}
                                <select
                                    value={manualFilters.minRating}
                                    onChange={(e) => setManualFilters({ ...manualFilters, minRating: Number(e.target.value) })}
                                    className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                >
                                    <option value="0">Any Rating</option>
                                    <option value="3.5">3.5+ Stars</option>
                                    <option value="4.0">4.0+ Stars</option>
                                    <option value="4.5">4.5+ Stars</option>
                                </select>

                                {/* Filter Checkboxes (Buttons) */}
                                <button
                                    onClick={() => setManualFilters({ ...manualFilters, openNow: !manualFilters.openNow })}
                                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.openNow ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 font-medium' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'}`}
                                >
                                    Open Now
                                </button>
                                <button
                                    onClick={() => setManualFilters({ ...manualFilters, hasWebsite: !manualFilters.hasWebsite, noWebsite: false })}
                                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.hasWebsite ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 font-medium' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'}`}
                                >
                                    Has Website
                                </button>
                                <button
                                    onClick={() => setManualFilters({ ...manualFilters, noWebsite: !manualFilters.noWebsite, hasWebsite: false })}
                                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.noWebsite ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 font-medium' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'}`}
                                >
                                    No Website
                                </button>
                                <button
                                    onClick={() => setManualFilters({ ...manualFilters, hasSocials: !manualFilters.hasSocials, noSocials: false })}
                                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.hasSocials ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 font-medium' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'}`}
                                >
                                    Has Socials
                                </button>
                                <button
                                    onClick={() => setManualFilters({ ...manualFilters, noSocials: !manualFilters.noSocials, hasSocials: false })}
                                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.noSocials ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 font-medium' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'}`}
                                >
                                    No Socials
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <ArrowDownWideNarrow className="w-4 h-4" /> Sort:
                                </div>
                                <select
                                    value={sortBy}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="opportunity">Opportunity Score (High to Low)</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="reviews">Most Reviews</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-xl font-bold text-white">
                                Found {filteredResults.length} Business{filteredResults.length !== 1 ? 'es' : ''}
                            </h2>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>

                        {/* Table - Optimized with CSS containment */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 overflow-hidden mb-8" style={{ contain: 'content' }}>
                            <div className="overflow-x-auto overflow-y-visible custom-scrollbar" style={{ contain: 'layout' }}>
                                <table className="w-full text-left text-sm text-slate-400" style={{ tableLayout: 'fixed' }}>
                                    <thead className="bg-slate-900/50 border-b border-slate-700 text-xs uppercase font-semibold text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4" style={{ width: '15%' }}>Business Name</th>
                                            <th className="px-6 py-4" style={{ width: '18%' }}>Details</th>
                                            <th className="px-6 py-4" style={{ width: '13%' }}>Contact</th>
                                            <th className="px-6 py-4" style={{ width: '13%' }}>Status & Socials</th>
                                            <th className="px-6 py-4" style={{ width: '10%' }}>CRM</th>
                                            <th className="px-6 py-4" style={{ width: '13%' }}>Opportunity</th>
                                            <th className="px-6 py-4 text-right" style={{ width: '18%' }}>Web & Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {filteredResults.map((biz, idx) => (
                                            <BusinessRow
                                                key={getBusinessId(biz)}
                                                biz={biz}
                                                idx={idx}
                                                crmEntry={crmData[getBusinessId(biz)]}
                                                updateCRM={updateCRM}
                                                handleGeneratePrompts={handleGeneratePrompts}
                                                handleOpenCrm={setEditingCrmBiz}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Load More Button */}
                        <div className="flex justify-center pb-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="group flex items-center gap-2 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 px-8 py-4 rounded-xl font-medium transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                Load More Results
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Prompts Modal */}
            {selectedBusiness && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-modal-enter flex flex-col">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-violet-400" /> AI Business Prompts
                                </h3>
                                <p className="text-sm text-slate-400">Generated for <span className="font-semibold text-white">{selectedBusiness.title}</span></p>
                            </div>
                            <button onClick={() => { setSelectedBusiness(null); setGeneratedPrompts(null); }} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 flex-1">
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-violet-400 animate-pulse" />
                                    </div>
                                    <p className="text-slate-300 font-medium animate-pulse">Constructing detailed prompts...</p>
                                </div>
                            ) : generatedPrompts ? (
                                <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">

                                    {/* Website Prompt Section */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-blue-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Globe className="w-4 h-4" /> 1. Website Build Prompt
                                            </h4>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedPrompts.websitePrompt);
                                                    showToast("Website Prompt copied to clipboard!");
                                                }}
                                                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                                            >
                                                Copy Prompt
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                readOnly
                                                value={generatedPrompts.websitePrompt}
                                                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none custom-scrollbar"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Tip: Paste this into <strong>v0.dev</strong>, <strong>bolt.new</strong>, or <strong>Lovable</strong> to generate a site instantly.
                                        </p>
                                    </div>

                                    {/* Website Outreach Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> Cold Email
                                                </h5>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedPrompts.websiteEmail);
                                                        showToast("Website Email copied!");
                                                    }}
                                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded border border-slate-700 transition-colors"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <textarea
                                                readOnly
                                                value={generatedPrompts.websiteEmail}
                                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 text-xs font-mono leading-relaxed focus:ring-1 focus:ring-slate-500 outline-none resize-none custom-scrollbar"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <MessageSquare className="w-3 h-3" /> Call Script
                                                </h5>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedPrompts.websiteCallScript);
                                                        showToast("Website Call Script copied!");
                                                    }}
                                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded border border-slate-700 transition-colors"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <textarea
                                                readOnly
                                                value={generatedPrompts.websiteCallScript}
                                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 text-xs font-mono leading-relaxed focus:ring-1 focus:ring-slate-500 outline-none resize-none custom-scrollbar"
                                            />
                                        </div>
                                    </div>

                                    {/* Marketing Prompt Section */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-pink-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Target className="w-4 h-4" /> 2. SMMA & Growth Prompt
                                            </h4>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedPrompts.marketingPrompt);
                                                    showToast("Marketing Prompt copied to clipboard!");
                                                }}
                                                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                                            >
                                                Copy Prompt
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                readOnly
                                                value={generatedPrompts.marketingPrompt}
                                                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-pink-500 outline-none resize-none custom-scrollbar"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Tip: Paste this into <strong>ChatGPT</strong>, <strong>Claude</strong>, or <strong>Gemini</strong> to get a full growth strategy.
                                        </p>
                                    </div>

                                    {/* Marketing Outreach Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> Cold Email
                                                </h5>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedPrompts.marketingEmail);
                                                        showToast("Marketing Email copied!");
                                                    }}
                                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded border border-slate-700 transition-colors"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <textarea
                                                readOnly
                                                value={generatedPrompts.marketingEmail}
                                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 text-xs font-mono leading-relaxed focus:ring-1 focus:ring-slate-500 outline-none resize-none custom-scrollbar"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <MessageSquare className="w-3 h-3" /> Call Script
                                                </h5>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedPrompts.marketingCallScript);
                                                        showToast("Marketing Call Script copied!");
                                                    }}
                                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded border border-slate-700 transition-colors"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <textarea
                                                readOnly
                                                value={generatedPrompts.marketingCallScript}
                                                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-400 text-xs font-mono leading-relaxed focus:ring-1 focus:ring-slate-500 outline-none resize-none custom-scrollbar"
                                            />
                                        </div>
                                    </div>

                                </div>
                            ) : null}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-900/50 flex justify-end">
                            <button
                                onClick={() => { setSelectedBusiness(null); }}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CRM Modal (Mobile) */}
            {editingCrmBiz && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-modal-enter">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                            <h3 className="font-bold text-lg text-white">Manage Lead</h3>
                            <button onClick={() => setEditingCrmBiz(null)} className="text-slate-400 hover:text-white transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <h4 className="font-bold text-white mb-1">{editingCrmBiz.title}</h4>
                                <div className="text-xs text-slate-400">{editingCrmBiz.address}</div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                                <div className="relative">
                                    <select
                                        value={crmData[getBusinessId(editingCrmBiz)]?.status || 'New'}
                                        onChange={(e) => updateCRM(editingCrmBiz, 'status', e.target.value)}
                                        className={`w-full text-sm font-bold px-4 py-3 rounded-xl border-none ring-1 transition-all appearance-none cursor-pointer focus:ring-2
                                            ${(crmData[getBusinessId(editingCrmBiz)]?.status === 'Contacted') ? 'bg-blue-500/20 text-blue-300 ring-blue-500/50 focus:ring-blue-500' :
                                                (crmData[getBusinessId(editingCrmBiz)]?.status === 'Call Later') ? 'bg-amber-500/20 text-amber-300 ring-amber-500/50 focus:ring-amber-500' :
                                                    (crmData[getBusinessId(editingCrmBiz)]?.status === 'Good Lead') ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/50 focus:ring-emerald-500' :
                                                        (crmData[getBusinessId(editingCrmBiz)]?.status === 'High Value') ? 'bg-violet-500/20 text-violet-300 ring-violet-500/50 focus:ring-violet-500' :
                                                            'bg-slate-800 text-slate-300 ring-slate-700 focus:ring-slate-500'
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
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                                <textarea
                                    value={crmData[getBusinessId(editingCrmBiz)]?.notes || ''}
                                    onChange={(e) => updateCRM(editingCrmBiz, 'notes', e.target.value)}
                                    placeholder="Add specific notes about this lead..."
                                    className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder-slate-600"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-800 text-center">
                            <button
                                onClick={() => setEditingCrmBiz(null)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-enter">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                            <h3 className="font-bold text-lg text-white">API Configuration</h3>
                            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-blue-900/20 p-4 rounded-xl text-sm text-blue-300 border border-blue-500/20">
                                <p><strong>Note:</strong> Without keys, the app runs in <strong>Demo Mode</strong> with mock data. Add keys below for live results.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Gemini API Key</label>
                                <input
                                    type="password"
                                    value={apiKeys.gemini}
                                    onChange={e => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                />
                                <p className="text-xs text-slate-500 mt-2">Used to interpret natural language queries.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">SerpAPI Key (Google Maps)</label>
                                <input
                                    type="password"
                                    value={apiKeys.serpApi}
                                    onChange={e => setApiKeys({ ...apiKeys, serpApi: e.target.value })}
                                    placeholder="Paste your SerpAPI key..."
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-500"
                                />
                                <p className="text-xs text-slate-500 mt-2">Used to fetch real-time business data from Google Maps.</p>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-800/50 flex justify-end gap-3 border-t border-slate-800">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 text-slate-400 font-medium hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => saveKeys(apiKeys)}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Toast Notification */}
            <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl border border-slate-600 flex items-center gap-3 z-[100] transition-all duration-300 ease-out ${toast?.visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium text-sm">{toast?.message}</span>
            </div>
        </div>
    );
}