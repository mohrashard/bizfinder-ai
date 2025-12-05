/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Download, 
  Settings, 
  Loader2, 
  AlertCircle,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  ArrowDownWideNarrow,
  Plus
} from 'lucide-react';

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
}

interface SearchParams {
  category: string;
  location: string;
  filters: {
    noWebsite?: boolean;
    openNow?: boolean;
    minRating?: number;
  };
}

interface ApiKeys {
  gemini: string;
  serpApi: string;
}

// --- Mock Data Service (for Demo Mode) ---

const MOCK_BUSINESSES: Business[] = [
  { title: "Al Safa Electricians", address: "Al Rigga Rd, Deira, Dubai, UAE", phone: "+971 4 222 1234", website: "https://alsafa-electric.ae", rating: 4.5, reviews: 120, type: "Electrician", open_state: "Open Now", hours: "8:00 AM - 10:00 PM" },
  { title: "Quick Fix Home Services", address: "Marina Walk, Dubai Marina, Dubai", phone: "+971 50 999 8888", rating: 4.8, reviews: 45, type: "Handyman", open_state: "Open 24 Hours", hours: "24 Hours" },
  { title: "Dubai Tech Solutions", address: "Business Bay, Dubai", phone: "+971 4 444 5555", website: "https://dubaitech.com", rating: 3.9, reviews: 12, type: "IT Support", open_state: "Closed", hours: "9:00 AM - 6:00 PM" },
  { title: "Old Town Plumbers (No Website)", address: "Al Fahidi, Bur Dubai", phone: "+971 4 353 1111", rating: 4.2, reviews: 89, type: "Plumber", open_state: "Open Now", hours: "7:00 AM - 7:00 PM" },
  { title: "City Center Cafe", address: "Downtown, Dubai", phone: "+971 4 123 9876", rating: 4.1, reviews: 230, type: "Cafe", open_state: "Open Now", hours: "8:00 AM - 11:00 PM" },
  { title: "Green Garden Landscaping", address: "Jumeirah, Dubai", phone: "+971 55 555 1234", website: "https://gg-landscape.ae", rating: 4.6, reviews: 56, type: "Landscaping", open_state: "Open Now", hours: "6:00 AM - 6:00 PM" },
  { title: "Speedy Motors", address: "Al Quoz, Dubai", phone: "+971 4 333 4444", rating: 3.5, reviews: 15, type: "Mechanic", open_state: "Closed", hours: "8:00 AM - 8:00 PM" },
  { title: "Marina Dental Clinic", address: "Dubai Marina", phone: "+971 4 444 9999", website: "https://marinadental.com", rating: 4.9, reviews: 300, type: "Dentist", open_state: "Open Now", hours: "9:00 AM - 9:00 PM" }
];

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
    openNow: false
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'reviews'>('relevance');

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    gemini: '',
    serpApi: ''
  });

  // Load keys from localStorage on mount
  useEffect(() => {
    const savedGemini = localStorage.getItem('bf_gemini_key');
    const savedSerp = localStorage.getItem('bf_serp_key');
    if (savedGemini || savedSerp) {
      setApiKeys({
        gemini: savedGemini || '',
        serpApi: savedSerp || ''
      });
    }
  }, []);

  const saveKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('bf_gemini_key', newKeys.gemini);
    localStorage.setItem('bf_serp_key', newKeys.serpApi);
    setShowSettings(false);
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
            "minRating": number (optional, if specified e.g. 'best' or '4 star')
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
      return apiData.local_results || [];

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
          return data.local_results || []; 
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

      // Sync detected filters to UI state
      setManualFilters({
        minRating: params.filters.minRating || 0,
        hasWebsite: false, // Default to all
        noWebsite: params.filters.noWebsite || false,
        openNow: params.filters.openNow || false
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
         const moreMock = MOCK_BUSINESSES.slice(0, 3).map(b => ({...b, title: `${b.title} (Page ${nextOffset/20 + 1})`}));
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
    
    const demoData = [...MOCK_BUSINESSES];
    setRawResults(demoData);
    setIsUsingFallback(true);
    setNextOffset(20);

    const isNoKey = err instanceof Error && err.message === "NO_KEY";
    if (!isNoKey) {
       setError("Live connection blocked. Showing DEMO results. Deploy the '/app/api/search/route.ts' file to Vercel to fix this.");
    }
  };

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

    // Sort
    if (sortBy === 'rating') {
      res.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'reviews') {
      res.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }
    
    return res;
  }, [rawResults, manualFilters, sortBy]);

  // --- Logic: 6. Export ---

  const handleExport = () => {
    if (filteredResults.length === 0) return;

    const headers = ['Name', 'Type', 'Address', 'Phone', 'Website', 'Rating', 'Reviews', 'Status'];
    const rows = filteredResults.map(b => [
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.type || ''}"`,
      `"${b.address.replace(/"/g, '""')}"`,
      `"${b.phone || ''}"`,
      `"${b.website || ''}"`,
      b.rating || '',
      b.reviews || '',
      `"${b.open_state || ''}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `business_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">BizFinder AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(true)}
              className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Settings className="w-4 h-4" />
              {(!apiKeys.gemini || !apiKeys.serpApi) ? "Configure APIs (Demo Mode)" : "Settings"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Find Business Leads in Seconds
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Type natural queries like <span className="italic text-blue-600">"businesses without websites in dubai"</span> or <span className="italic text-blue-600">"cheap cafes near me"</span>.
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group z-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Italian restaurants in Abu Dhabi with high ratings..."
              className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </button>
          </form>

          {/* Search Status & Info */}
          <div className="mt-4 min-h-[1.5rem]">
            {loading && (
              <span className="text-sm text-blue-600 font-medium flex items-center justify-center gap-2 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> {loadingStep}
              </span>
            )}
            {!loading && !apiKeys.serpApi && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                ⚠️ Running in Demo Mode (Mock Data). Configure API Keys to search live.
              </span>
            )}
            {isUsingFallback && (
              <div className="flex justify-center mt-2">
                <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-3 h-3"/> Viewing Demo Data (Live Connection Blocked)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
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
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mr-2">
                  <Filter className="w-4 h-4" /> Filters:
                </div>
                
                {/* Rating Filter */}
                <select 
                  value={manualFilters.minRating}
                  onChange={(e) => setManualFilters({...manualFilters, minRating: Number(e.target.value)})}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                >
                  <option value="0">Any Rating</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>

                {/* Filter Checkboxes (Buttons) */}
                <button
                  onClick={() => setManualFilters({...manualFilters, openNow: !manualFilters.openNow})}
                  className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.openNow ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Open Now
                </button>
                <button
                  onClick={() => setManualFilters({...manualFilters, hasWebsite: !manualFilters.hasWebsite, noWebsite: false})}
                  className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.hasWebsite ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Has Website
                </button>
                <button
                  onClick={() => setManualFilters({...manualFilters, noWebsite: !manualFilters.noWebsite, hasWebsite: false})}
                  className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${manualFilters.noWebsite ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  No Website
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <ArrowDownWideNarrow className="w-4 h-4" /> Sort:
                </div>
                <select 
                  value={sortBy}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-slate-800">
                Found {filteredResults.length} Business{filteredResults.length !== 1 ? 'es' : ''}
              </h2>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Business Name</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4 text-center">Web & Rating</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResults.map((biz, idx) => (
                      <tr key={`${biz.title}-${idx}`} className="hover:bg-slate-50 transition-colors">
                        {/* Business Name Column */}
                        <td className="px-6 py-4 align-top">
                          <div className="font-semibold text-slate-900 text-base mb-1">{biz.title}</div>
                          <div className="text-xs text-slate-400 bg-slate-100 inline-block px-2 py-0.5 rounded-full">
                            {biz.type || 'Business'}
                          </div>
                        </td>

                        {/* Details Column */}
                        <td className="px-6 py-4 align-top max-w-xs">
                          <div className="flex items-start gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600">{biz.address}</span>
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
                          {biz.phone ? (
                            <div className="flex items-center gap-2 text-slate-700">
                              <Phone className="w-4 h-4 text-blue-500" />
                              {biz.phone}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">No phone</span>
                          )}
                        </td>

                        {/* Web & Rating Column */}
                        <td className="px-6 py-4 align-top text-center">
                          <div className="flex flex-col items-center gap-2">
                            {biz.website ? (
                              <a 
                                href={biz.website} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-xs"
                              >
                                <Globe className="w-3 h-3" /> Website
                              </a>
                            ) : (
                              <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-xs font-medium border border-red-100">
                                No Website
                              </span>
                            )}
                            
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="font-bold text-slate-700">{biz.rating || 'N/A'}</span>
                              <span className="text-xs text-slate-400">({biz.reviews || 0})</span>
                            </div>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-6 py-4 align-top text-right">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                            ${biz.open_state?.toLowerCase().includes('open') 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : biz.open_state?.toLowerCase().includes('close')
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                          >
                            {biz.open_state?.toLowerCase().includes('open') ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {biz.open_state || 'Unknown'}
                          </div>
                        </td>
                      </tr>
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
                className="group flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 px-6 py-3 rounded-xl font-medium shadow-sm transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Plus className="w-4 h-4 group-hover:scale-110 transition-transform"/>}
                Load More Results
              </button>
            </div>

          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">API Configuration</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100">
                <p><strong>Note:</strong> Without keys, the app runs in <strong>Demo Mode</strong> with mock data. Add keys below for live results.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKeys.gemini}
                  onChange={e => setApiKeys({...apiKeys, gemini: e.target.value})}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Used to interpret natural language queries.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SerpAPI Key (Google Maps)</label>
                <input 
                  type="password" 
                  value={apiKeys.serpApi}
                  onChange={e => setApiKeys({...apiKeys, serpApi: e.target.value})}
                  placeholder="Paste your SerpAPI key..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Used to fetch real-time business data from Google Maps.</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => saveKeys(apiKeys)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}