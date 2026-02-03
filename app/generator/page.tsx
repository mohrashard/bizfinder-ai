/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useCallback } from 'react';
import {
    Shuffle,
    Globe2,
    Building2,
    Briefcase,
    Copy,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    RefreshCcw,
    Dice5
} from 'lucide-react';
import Link from 'next/link';

// --- Data: Countries with Cities, Towns, Villages ---

interface LocationData {
    cities: string[];
}

const COUNTRIES: Record<string, LocationData> = {
    "United States": {
        cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "Seattle", "Denver", "Boston", "Detroit", "Nashville"]
    },
    "United Kingdom": {
        cities: ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol", "Sheffield", "Leeds", "Edinburgh", "Leicester", "Cardiff", "Belfast", "Nottingham", "Newcastle", "Brighton", "Oxford", "Cambridge", "Southampton", "Portsmouth", "Reading"]
    },
    "Canada": {
        cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Quebec City", "Hamilton", "Victoria", "Halifax", "Regina", "Saskatoon", "St. John's", "Kelowna", "Waterloo", "Kingston", "Thunder Bay", "Windsor", "Charlottetown"]
    },
    "Australia": {
        cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart", "Cairns", "Darwin", "Townsville", "Toowoomba", "Geelong", "Ballarat", "Bendigo", "Launceston", "Mackay", "Rockhampton"]
    },
    "Germany": {
        cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster"]
    },
    "France": {
        cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Saint-Étienne", "Le Havre", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne"]
    },
    "Japan": {
        cities: ["Tokyo", "Osaka", "Kyoto", "Nagoya", "Yokohama", "Kobe", "Fukuoka", "Sapporo", "Hiroshima", "Sendai", "Nara", "Kanazawa", "Nagasaki", "Kumamoto", "Okayama", "Kagoshima", "Matsuyama", "Niigata", "Hamamatsu", "Shizuoka"]
    },
    "India": {
        cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad"]
    },
    "United Arab Emirates": {
        cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Al Ain", "Khor Fakkan", "Dibba"]
    },
    "Brazil": {
        cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", "Goiânia", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Natal", "Campo Grande"]
    }
};

// --- Data: Business Types / Niches ---

const BUSINESS_NICHES: string[] = [
    // Professional Services
    "Accounting Firm", "Law Firm", "Consulting Agency", "Architecture Firm", "Engineering Consultancy",
    "Marketing Agency", "PR Agency", "HR Consultancy", "Tax Services", "Financial Advisor",

    // Health & Wellness
    "Dental Clinic", "Medical Practice", "Chiropractic Center", "Physical Therapy", "Mental Health Clinic",
    "Veterinary Clinic", "Optometry Practice", "Dermatology Clinic", "Pediatric Care", "Urgent Care Center",
    "Yoga Studio", "Pilates Studio", "Fitness Gym", "CrossFit Box", "Martial Arts Dojo",
    "Spa & Wellness Center", "Massage Therapy", "Acupuncture Clinic", "Naturopathy Center", "Weight Loss Clinic",

    // Food & Hospitality
    "Restaurant", "Café", "Bakery", "Food Truck", "Catering Service",
    "Bar & Lounge", "Wine Bar", "Brewery Taproom", "Ice Cream Shop", "Juice Bar",
    "Pizza Shop", "Sushi Restaurant", "Indian Restaurant", "Mexican Restaurant", "Italian Restaurant",
    "Fast Food", "Fine Dining", "Diner", "Food Delivery", "Ghost Kitchen",

    // Retail & Shopping
    "Clothing Boutique", "Jewelry Store", "Electronics Store", "Furniture Store", "Home Decor",
    "Pet Store", "Sporting Goods", "Book Store", "Gift Shop", "Flower Shop",
    "Antique Store", "Thrift Shop", "Toy Store", "Music Store", "Art Gallery",
    "Hardware Store", "Garden Center", "Liquor Store", "Convenience Store", "Supermarket",

    // Home Services
    "Plumbing Service", "Electrical Contractor", "HVAC Service", "Roofing Company", "General Contractor",
    "Landscaping Service", "House Cleaning", "Window Cleaning", "Pest Control", "Pool Service",
    "Painting Contractor", "Flooring Company", "Kitchen Remodeling", "Bathroom Remodeling", "Home Inspection",
    "Locksmith", "Moving Company", "Junk Removal", "Handyman Service", "Interior Design",

    // Automotive
    "Auto Repair Shop", "Car Dealership", "Auto Body Shop", "Tire Shop", "Oil Change Service",
    "Car Wash", "Auto Detailing", "Towing Service", "Auto Parts Store", "Motorcycle Dealer",

    // Beauty & Personal Care
    "Hair Salon", "Barbershop", "Nail Salon", "Beauty Spa", "Tanning Salon",
    "Tattoo Parlor", "Piercing Studio", "Makeup Artist", "Esthetician", "Brow Bar",

    // Education & Training
    "Tutoring Service", "Music School", "Dance School", "Art School", "Language School",
    "Driving School", "Cooking School", "Coding Bootcamp", "Test Prep Center", "Preschool",

    // Entertainment & Recreation
    "Movie Theater", "Bowling Alley", "Escape Room", "Arcade", "Mini Golf",
    "Laser Tag", "Trampoline Park", "Go-Kart Track", "Axe Throwing", "Virtual Reality Arcade",

    // Professional & Business
    "Printing Service", "Signage Company", "Web Design Agency", "SEO Agency", "IT Support",
    "Photography Studio", "Videography", "Graphic Design", "Translation Service", "Staffing Agency",

    // Real Estate
    "Real Estate Agency", "Property Management", "Home Staging", "Real Estate Photography", "Mortgage Broker",

    // Other Services
    "Wedding Planner", "Event Planning", "Travel Agency", "Insurance Agency", "Security Company",
    "Storage Facility", "Courier Service", "Laundromat", "Dry Cleaning", "Tailor Shop"
];

// --- Component ---

export default function RandomGeneratorPage() {
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [niche, setNiche] = useState<string>('');
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState<{ [key: string]: boolean }>({});

    // Random helpers
    const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    const animateSpin = (field: string, callback: () => void) => {
        setIsSpinning(prev => ({ ...prev, [field]: true }));
        setTimeout(() => {
            callback();
            setIsSpinning(prev => ({ ...prev, [field]: false }));
        }, 300);
    };

    // Generators
    const generateCountry = useCallback(() => {
        animateSpin('country', () => {
            const countries = Object.keys(COUNTRIES);
            const newCountry = getRandomItem(countries);
            setCountry(newCountry);
            // Reset dependent fields
            setCity('');
        });
    }, []);

    const generateCity = useCallback(() => {
        if (!country) return;
        animateSpin('city', () => {
            const cities = COUNTRIES[country]?.cities || [];
            setCity(getRandomItem(cities));
        });
    }, [country]);

    const generateNiche = useCallback(() => {
        animateSpin('niche', () => {
            setNiche(getRandomItem(BUSINESS_NICHES));
        });
    }, []);

    const generateAll = useCallback(() => {
        const countries = Object.keys(COUNTRIES);
        const newCountry = getRandomItem(countries);
        const data = COUNTRIES[newCountry];

        setIsSpinning({ country: true, city: true, niche: true });

        setTimeout(() => {
            setCountry(newCountry);
            setCity(getRandomItem(data.cities));
            setNiche(getRandomItem(BUSINESS_NICHES));
            setIsSpinning({});
        }, 500);
    }, []);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const buildSearchQuery = () => {
        if (!country || !city || !niche) return '';
        const displayCountry = country === "United Arab Emirates" ? "UAE" : country;
        return `${niche} , ${city} , ${displayCountry}`.toLowerCase();
    };

    const searchQuery = buildSearchQuery();

    return (
        <div className="min-h-screen bg-slate-900 text-white py-12 px-4">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-[50%] left-[50%] w-[20%] h-[20%] bg-emerald-600/5 rounded-full blur-[80px] animate-pulse"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 mb-6">
                        <Dice5 className="w-4 h-4" />
                        <span className="text-sm font-medium">Random Idea Generator</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-200">
                        Business Location Generator
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Stuck on where to search for leads? Generate random locations and business niches to discover new opportunities.
                    </p>
                </div>

                {/* Generate All Button */}
                <div className="flex justify-center mb-10">
                    <button
                        onClick={generateAll}
                        className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-600/20 hover:shadow-purple-600/40 transition-all hover:-translate-y-1"
                    >
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Generate Everything
                    </button>
                </div>

                {/* Generator Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Country Card */}
                    <GeneratorCard
                        icon={<Globe2 className="w-6 h-6" />}
                        iconColor="text-blue-400"
                        title="Country"
                        value={country}
                        placeholder="Click to generate..."
                        isSpinning={isSpinning['country']}
                        copied={copiedField === 'country'}
                        onGenerate={generateCountry}
                        onCopy={() => copyToClipboard(country, 'country')}
                    />

                    {/* City Card */}
                    <GeneratorCard
                        icon={<Building2 className="w-6 h-6" />}
                        iconColor="text-amber-400"
                        title="City"
                        value={city}
                        placeholder={country ? "Click to generate..." : "Select a country first"}
                        isSpinning={isSpinning['city']}
                        copied={copiedField === 'city'}
                        onGenerate={generateCity}
                        onCopy={() => copyToClipboard(city, 'city')}
                        disabled={!country}
                    />

                    {/* Niche Card - Full Width */}
                    <div className="md:col-span-2">
                        <GeneratorCard
                            icon={<Briefcase className="w-6 h-6" />}
                            iconColor="text-purple-400"
                            title="Business Type / Niche"
                            value={niche}
                            placeholder="Click to generate..."
                            isSpinning={isSpinning['niche']}
                            copied={copiedField === 'niche'}
                            onGenerate={generateNiche}
                            onCopy={() => copyToClipboard(niche, 'niche')}
                            large
                        />
                    </div>
                </div>

                {/* Search Query Preview */}
                {searchQuery && (
                    <div className="mt-10 bg-gradient-to-r from-slate-800/80 to-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-sm text-slate-400 mb-2">Your Generated Search Query:</p>
                                <p className="text-xl font-bold text-white">{searchQuery}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => copyToClipboard(searchQuery, 'query')}
                                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all"
                                >
                                    {copiedField === 'query' ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy Query
                                        </>
                                    )}
                                </button>
                                <Link
                                    href={`/finder?q=${encodeURIComponent(searchQuery)}`}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                                >
                                    Search Now
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips Section */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <TipCard
                        emoji="🎯"
                        title="Target Major Markets"
                        description="Focus on large cities where businesses often have higher budgets for digital services."
                    />
                    <TipCard
                        emoji="🌍"
                        title="Go Global"
                        description="Don't limit yourself. Remote work means you can serve clients anywhere."
                    />
                    <TipCard
                        emoji="🔄"
                        title="Keep Generating"
                        description="Try different combinations until you find an underserved niche."
                    />
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

interface GeneratorCardProps {
    icon: React.ReactNode;
    iconColor: string;
    title: string;
    value: string;
    placeholder: string;
    isSpinning: boolean;
    copied: boolean;
    onGenerate: () => void;
    onCopy: () => void;
    disabled?: boolean;
    large?: boolean;
}

function GeneratorCard({
    icon,
    iconColor,
    title,
    value,
    placeholder,
    isSpinning,
    copied,
    onGenerate,
    onCopy,
    disabled = false,
    large = false
}: GeneratorCardProps) {
    return (
        <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all group ${large ? 'py-8' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`${iconColor} bg-slate-700/50 p-2.5 rounded-xl border border-slate-600/30`}>
                        {icon}
                    </div>
                    <span className="font-semibold text-slate-300">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {value && (
                        <button
                            onClick={onCopy}
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all"
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    )}
                    <button
                        onClick={onGenerate}
                        disabled={disabled}
                        className={`p-2 rounded-lg transition-all ${disabled
                            ? 'bg-slate-700/30 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white'
                            }`}
                        title="Generate random"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div
                onClick={disabled ? undefined : onGenerate}
                className={`min-h-[60px] flex items-center justify-center rounded-xl border border-dashed transition-all ${disabled
                    ? 'border-slate-700/50 bg-slate-800/30 cursor-not-allowed'
                    : 'border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/30 hover:border-slate-500/50 cursor-pointer'
                    } ${large ? 'min-h-[80px]' : ''}`}
            >
                {value ? (
                    <span className={`font-bold text-white transition-all ${isSpinning ? 'opacity-50 blur-sm' : 'opacity-100'} ${large ? 'text-2xl' : 'text-xl'}`}>
                        {value}
                    </span>
                ) : (
                    <span className="text-slate-500 flex items-center gap-2">
                        <Shuffle className="w-4 h-4" />
                        {placeholder}
                    </span>
                )}
            </div>
        </div>
    );
}

interface TipCardProps {
    emoji: string;
    title: string;
    description: string;
}

function TipCard({ emoji, title, description }: TipCardProps) {
    return (
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-5 hover:bg-slate-800/50 hover:border-slate-600/30 transition-all">
            <div className="text-3xl mb-3">{emoji}</div>
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    );
}
