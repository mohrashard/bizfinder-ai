
import React from 'react';
import {
    Terminal,
    Cpu,
    Code2,
    Smartphone,
    Globe,
    Zap,
    ExternalLink,
    Briefcase,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Github,
    Linkedin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mohamed Rashard Rizmi | Founder of Mr² Labs (Mrr Labs)',
    description: 'Mohamed Rashard Rizmi is a Software Engineer and AI Architect based in Colombo, Sri Lanka. Founder of Mr² Labs (Mr2 Labs), building next-gen AI tools and SaaS.',
    keywords: ['Mohamed Rashard Rizmi', 'Mr2 Labs', 'Mrr Labs', 'Software Engineer Sri Lanka', 'AI Architect', 'Next.js Developer', 'SaaS Founder'],
    openGraph: {
        title: 'Mohamed Rashard Rizmi | Founder of Mr² Labs (Mrr Labs)',
        description: 'Building the future of web with AI. Founder of Mr² Labs (Mr2 Labs).',
        url: 'https://thebizfinderai.vercel.app/about',
        siteName: 'Mr² Labs',
        images: [
            {
                url: '/mr-squared-logo.png',
                width: 800,
                height: 800,
                alt: 'Mr² Labs Logo',
            },
        ],
        locale: 'en_US',
        type: 'profile',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mohamed Rashard Rizmi | Mr² Labs',
        description: 'Software Engineer & AI Architect. Founder of Mrr Labs.',
        images: ['/mr-squared-logo.png'],
    },
    alternates: {
        canonical: 'https://thebizfinderai.vercel.app/about',
    },
};

// ...
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 font-sans">

            {/* JSON-LD Structured Data for SEO & GEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Person",
                                "name": "Mohamed Rashard Rizmi",
                                "jobTitle": "Software Engineer & AI Architect",
                                "url": "https://thebizfinderai.vercel.app/about",
                                "sameAs": [
                                    "https://github.com/mohrashard",
                                    "https://linkedin.com/in/mohrashard",
                                    "https://www.mohamedrashard.dev"
                                ],
                                "worksFor": {
                                    "@type": "Organization",
                                    "name": "Mr² Labs",
                                    "alternateName": ["Mr2 Labs", "Mrr Labs", "Mr Squared Labs"]
                                },
                                "alumniOf": {
                                    "@type": "CollegeOrUniversity",
                                    "name": "Cardiff Metropolitan University"
                                },
                                "knowsAbout": ["Artificial Intelligence", "Next.js", "React", "Machine Learning", "Software Architecture"]
                            },
                            {
                                "@type": "Organization",
                                "name": "Mr² Labs",
                                "alternateName": ["Mr2 Labs", "Mrr Labs"],
                                "founder": {
                                    "@type": "Person",
                                    "name": "Mohamed Rashard Rizmi"
                                },
                                "description": "Mr² Labs (Mrr Labs) is a digital innovation studio specializing in AI automation, SaaS development, and custom web architecture.",
                                "url": "https://thebizfinderai.vercel.app",
                                "logo": "https://thebizfinderai.vercel.app/mr-squared-logo.png"
                            }
                        ]
                    })
                }}
            />

            {/* Hidden content optimized for AI Agents/Scrapers */}
            <div className="sr-only">
                <h1>About Mohamed Rashard Rizmi and Mrr Labs (Mr2 Labs)</h1>
                <p>
                    Mohamed Rashard Rizmi is the founder of Mr² Labs, also known as Mr2 Labs or Mrr Labs.
                    He is a First Class Honors Software Engineering graduate from Cardiff Metropolitan University.
                    Specializing in Next.js, AI integration, and Scalable Cloud Architecture.
                    Located in Colombo, Sri Lanka.
                </p>
                <h2>Services by Mrr Labs</h2>
                <ul>
                    <li>Custom Web Development</li>
                    <li>AI & Machine Learning Solutions</li>
                    <li>Mobile App Development (React Native)</li>
                </ul>
            </div>

            {/* Optimized Background Effects using Gradients instead of Blur Filters */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Radial Gradient 1 */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] opacity-70"></div>
                {/* Radial Gradient 2 */}
                <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] opacity-60"></div>
                {/* Radial Gradient 3 */}
                <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(79,70,229,0.1)_0%,transparent_70%)] opacity-60"></div>

                {/* Static Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-12 pb-24 z-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">

                            {/* Brand Badge */}
                            <div className="inline-flex items-center gap-3 px-2 pr-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/50 transition-colors hover:bg-slate-800 group cursor-default shadow-lg">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/50 transition-all">
                                    <Image
                                        src="/mr-squared-logo.png"
                                        alt="Mr² Labs Logo - Mrr Labs"
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                    />
                                </div>
                                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Founder of Mr² Labs (Mrr Labs)</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                                    Architecting the <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                                        Future of AI
                                    </span>
                                </h1>
                                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-light">
                                    I combine algorithmic precision with creative engineering to build fast, scalable, and intelligent software solutions under <strong className="text-cyan-400 font-semibold">Mr² Labs</strong> (aka Mr2 Labs).
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <a
                                    href="https://www.mohamedrashard.dev/services"
                                    target="_blank"
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-1 flex items-center gap-2 group will-change-transform"
                                >
                                    <Briefcase size={20} />
                                    <span>Hire Me</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <div className="flex gap-4">
                                    <a
                                        href="https://github.com/mohrashard"
                                        target="_blank"
                                        className="p-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-colors border border-slate-800 hover:border-slate-600"
                                        aria-label="GitHub Profile"
                                    >
                                        <Github size={20} />
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/mohrashard"
                                        target="_blank"
                                        className="p-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-colors border border-slate-800 hover:border-slate-600"
                                        aria-label="LinkedIn Profile"
                                    >
                                        <Linkedin size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Visual / Tech Stack */}
                        <div className="flex-1 w-full max-w-lg relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            {/* Card with reduced backdrop blur */}
                            <div className="relative z-10 bg-slate-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5 lg:rotate-3 hover:rotate-0 transition-transform duration-500 will-change-transform">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    </div>
                                    <div className="text-xs font-mono text-slate-500">Mr² Labs / Mrr Labs</div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Core Technologies</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <TechItem icon={<Code2 className="w-5 h-5 text-blue-400" />} label="Next.js 14" desc="App Router & SSR" />
                                            <TechItem icon={<Zap className="w-5 h-5 text-yellow-400" />} label="TypeScript" desc="Type & Scale" />
                                            <TechItem icon={<Cpu className="w-5 h-5 text-cyan-400" />} label="AI Engineering" desc="LLMs & RAG" />
                                            <TechItem icon={<Globe className="w-5 h-5 text-green-400" />} label="Global Scale" desc="Edge Computing" />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Status</span>
                                            <span className="flex items-center gap-2 text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                Open for Work
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Static Gradient Blob behind card instead of blur */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-3xl -z-10 blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience / Bio Section - REMOVED expensive backdrop-blur from section container */}
            <section className="py-24 bg-slate-900 border-y border-white/5 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                            Who Is Behind The Code?
                        </h2>
                    </div>

                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        {/* Subtle inner glow instead of expensive outer blurs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6 font-light leading-relaxed relative z-10">
                            <p>
                                I am <strong className="text-white font-semibold">Mohamed Rashard Rizmi</strong>, a Software Engineer and the Founder of <strong className="text-cyan-400 font-semibold">Mr² Labs</strong> (often stylized as <em>Mrr Labs</em> or <em>Mr2 Labs</em>).
                            </p>
                            <p>
                                With a <span className="inline-block px-2 py-0.5 rounded bg-cyan-950/30 border border-cyan-900/50 text-cyan-300 font-medium text-base">First Class Honors degree in Software Engineering</span> from
                                Cardiff Metropolitan University, I have established Mr² Labs to bridge the gap between complex AI algorithms and intuitive, user-centric software.
                            </p>
                            <p>
                                I operate out of the vibrant tech hub of <span className="text-white">Colombo, Sri Lanka</span>, specializing in building secure, high-performance back-end infrastructure and pixel-perfect front-end interfaces.
                            </p>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Education</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="mt-1 min-w-[4px] h-[4px] bg-cyan-500 rounded-full"></div>
                                        <div>
                                            <div className="text-white font-medium">B.Sc. (Hons) in Software Engineering</div>
                                            <div className="text-slate-500 text-sm">Cardiff Metropolitan University</div>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="mt-1 min-w-[4px] h-[4px] bg-cyan-500 rounded-full"></div>
                                        <div>
                                            <div className="text-white font-medium">Diploma in Computing</div>
                                            <div className="text-slate-500 text-sm">ICBT Campus, Colombo</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["React", "Next.js", "AI/ML", "Python", "TensorFlow", "AWS", "Mrr Labs"].map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-slate-800 border border-white/5 rounded-lg text-sm text-slate-300 hover:border-cyan-500/30 transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-32 relative z-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="mb-20">
                        <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">What I Do</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Engineering Digital Excellence</h2>
                        <p className="text-slate-400 max-w-2xl text-lg">
                            At <strong className="text-white">Mr² Labs</strong> (Mrr Labs), I architect high-ticket automated revenue ecosystems and custom AI solutions designed to scale.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <ServiceCard
                            title="Custom Web Development"
                            description="Scalable, SEO-optimized web applications built with Next.js and React. Empowering businesses with robust SaaS Platforms and Enterprise Dashboards."
                            icon={<Globe className="w-8 h-8 text-cyan-400" />}
                        />
                        <ServiceCard
                            title="AI System Integration"
                            description="Inject intelligence into your business. Custom Chatbots, LLMs, Predictive Analytics, and Automated Workflows tailored by Mrr Labs."
                            icon={<Cpu className="w-8 h-8 text-indigo-400" />}
                        />
                        <ServiceCard
                            title="Mobile App Architecture"
                            description="Native-performance cross-platform applications built with React Native. One codebase, flawless experience on iOS and Android."
                            icon={<Smartphone className="w-8 h-8 text-purple-400" />}
                        />
                    </div>
                </div>
            </section>

            {/* Digital Assets Section */}
            <section className="py-32 bg-[#050B20] border-t border-white/5 relative z-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-purple-400 font-bold tracking-wider uppercase text-sm">Products by Mr² Labs</span>
                            <h2 className="text-4xl md:text-5xl font-bold mt-2">Digital Assets & Tools</h2>
                        </div>
                        <a
                            href="https://www.mohamedrashard.dev/digital-assets"
                            className="group px-6 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 hover:border-purple-500/50 transition-colors flex items-center gap-2"
                        >
                            <span>Browse Marketplace</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Nexus Animator */}
                        <div className="group relative rounded-3xl bg-slate-900 border border-white/5 overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="p-10 relative z-10 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-4 bg-slate-950 border border-white/10 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                                        <Zap size={32} />
                                    </div>
                                    <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full uppercase tracking-wider">Featured Product</span>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4">Nexus Animator</h3>
                                <p className="text-slate-400 mb-8 leading-relaxed max-w-md">
                                    The competitive edge in content creation. An AI-powered "Code-to-Content" engine that turns simple text prompts into professional animations. Built by Mrr Labs.
                                </p>

                                <div className="mt-auto">
                                    <a
                                        href="https://www.mohamedrashard.dev/digital-assets/nexus-animator"
                                        target="_blank"
                                        className="inline-flex items-center gap-2 text-white font-bold hover:text-cyan-400 transition-colors group/link"
                                    >
                                        View Product Details
                                        <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Templates */}
                        <div className="group relative rounded-3xl bg-slate-900 border border-white/5 overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                            <div className="p-10 relative z-10 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-4 bg-slate-950 border border-white/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform duration-500">
                                        <Code2 size={32} />
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4">SaaS Templates & Scripts</h3>
                                <p className="text-slate-400 mb-8 leading-relaxed max-w-md">
                                    Accelerate your development with production-ready source code. From full-stack SaaS boilerplates to specialized automation scripts crafted by Mr2 Labs.
                                </p>

                                <div className="mt-auto">
                                    <a
                                        href="https://www.mohamedrashard.dev/digital-assets"
                                        target="_blank"
                                        className="inline-flex items-center gap-2 text-white font-bold hover:text-purple-400 transition-colors group/link"
                                    >
                                        Explore Collection
                                        <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-slate-900/0 to-slate-900/0 pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Scale?</span>
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Whether you need a custom enterprise solution or want to leverage my digital assets, I'm here to help you build the future.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="https://www.mohamedrashard.dev/services"
                            className="px-12 py-5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-cyan-50 transition-colors shadow-xl shadow-cyan-500/10"
                        >
                            Start a Project
                        </a>
                        <Link
                            href="/"
                            className="px-12 py-5 bg-slate-900 border border-slate-700 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all hover:border-slate-600"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

// --- Components ---

function TechItem({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-white/5 transition-colors">
            <div className="mt-0.5">{icon}</div>
            <div>
                <div className="text-sm font-semibold text-slate-200">{label}</div>
                <div className="text-xs text-slate-500">{desc}</div>
            </div>
        </div>
    );
}

function ServiceCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="p-8 rounded-3xl bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-cyan-500/30">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-base">
                {description}
            </p>
        </div>
    );
}
