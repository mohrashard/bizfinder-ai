
import Link from 'next/link';
import {
  Search, Globe, Database, Zap, MapPin, BarChart3, ShieldCheck,
  Target, Mail, ArrowRight, CheckCircle2, Star, MessageSquareCode,
  TrendingUp, Sparkles, Code
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'BizFinder AI | #1 Google Maps Scraper & B2B Lead Finder',
  description: 'The ultimate AI-powered Google Maps scraper and B2B lead generation tool. Find clients, get emails, and analyze businesses instantly without manual work.',
  alternates: {
    canonical: 'https://thebizfinderai.vercel.app',
  },
  openGraph: {
    title: 'BizFinder AI - Automate Your Lead Generation',
    description: 'Stop searching manually. Use BizFinder AI to scrape Google Maps and find high-ticket clients in seconds.',
    url: 'https://thebizfinderai.vercel.app',
    siteName: 'BizFinder AI by Mr² Labs',
    locale: 'en_US',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">

      {/* JSON-LD Structured Data for SEO & GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "BizFinder AI",
                "operatingSystem": "Web",
                "applicationCategory": "BusinessApplication",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "150"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How does BizFinder AI help with lead generation?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "BizFinder AI automates the discovery of local business leads from Google Maps. It identifies prospects who lack websites, have low ratings, or missing social media, providing a direct opportunity for digital agencies."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I find leads in specific cities?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, BizFinder AI is optimized for GEO-targeted searches. You can find dentists in New York, plumbers in London, or cafes in Dubai with real-time data."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-cyan-600/5 rounded-full blur-[140px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>
      </div>

      <main className="relative z-10">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 lg:pt-32 lg:pb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-blue-500/20 text-blue-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-xl shadow-blue-500/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide uppercase">New: Gemini 2.0 Integration & Live Review Auditing</span>
          </div>

          <h1 className="text-5xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05] max-w-5xl">
            Scale Your Agency with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 drop-shadow-sm">
              AI-Powered Lead Intelligence
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Stop scraping raw data. Start discovering <span className="text-white font-semibold">intent-based leads</span>.
            BizFinder AI finds businesses that *need* your services—no website, low reviews, or missing socials.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 w-full sm:w-auto">
            <Link
              href="/finder"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Launch Search Engine
            </Link>
            <Link
              href="/guide"
              className="bg-slate-900/80 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-3 backdrop-blur-md hover:shadow-lg shadow-black/20"
            >
              View Setup Guide
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest text-slate-300">
              <Globe className="w-5 h-5 text-blue-500" /> Google Maps
            </div>
            <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest text-slate-300">
              <Sparkles className="w-5 h-5 text-violet-500" /> Gemini 2.0
            </div>
            <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Verified Data
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
                Traditional Lead Generation <br />
                <span className="text-rose-500 italic underline decoration-rose-500/30">is Broken.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Most tools just vomit a list of names. You waste hours filtering, cold-calling the wrong people, and sending generic emails that get marked as spam.
              </p>
              <ul className="space-y-4">
                {[
                  "Manual scrolling thru Google Maps is a time sink.",
                  "Generic data lacks conversion intent.",
                  "No way to find businesses 'without' specific digital assets.",
                  "Zero insight into actual customer pain points."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-500 text-xs font-bold font-mono">X</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 p-8 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-48 h-48 rotate-12" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white relative z-10">The BizFinder AI Advantage</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Negative Filtering</h4>
                    <p className="text-sm text-slate-400">Only see businesses without websites or socials.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">BizScore™ Analysis</h4>
                    <p className="text-sm text-slate-400">Leads are ranked by their potential for conversion.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                    <MessageSquareCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">AI-Drafted Pitches</h4>
                    <p className="text-sm text-slate-400">Personalized hooks based on real review analysis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-slate-900/50 border-y border-white/5 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">From Search to Close in 3 Steps</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Our workflow is designed to get you the highest response rates possible.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector lines for desktop */}
              <div className="hidden md:block absolute top-[2.5rem] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0"></div>

              {[
                {
                  step: "01",
                  icon: <Search className="w-6 h-6 text-blue-400" />,
                  title: "Targeted Search",
                  desc: "Search by industry and location (e.g. 'Dentists in Dallas'). Apply filters to find businesses with specific digital gaps."
                },
                {
                  step: "02",
                  icon: <Sparkles className="w-6 h-6 text-violet-400" />,
                  title: "AI Analysis",
                  desc: "Our Gemini-powered engine audits their reviews and profile to identify exact pain points customers are complaining about."
                },
                {
                  step: "03",
                  icon: <Mail className="w-6 h-6 text-emerald-400" />,
                  title: "Smart Outreach",
                  desc: "Use the built-in email generator to draft a high-impact pitch. Open directly in Gmail and hit send in one click."
                }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl bg-slate-800/20 border border-white/5 hover:bg-slate-800/40 transition-all group">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Step {item.step}</span>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GEO-Niche Optimization (The SEO Secret Sauce) */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Optimized for High-Value Niches</h2>
              <p className="text-slate-400">Whether you target high-ticket home services or professional medical practices, BizFinder AI delivers deep data in every major city.</p>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-white/5 text-sm font-bold text-blue-400">
              <MapPin className="w-4 h-4" /> Global GEO Coverage
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { niche: "Medical & Dental", cities: "NYC, London, Austin", icon: "🦷" },
              { niche: "Home Services", cities: "Dallas, Toronto, Sydney", icon: "🏠" },
              { niche: "Real Estate", cities: "Miami, Dubai, Vancouver", icon: "🏢" },
              { niche: "Law & Finance", cities: "Chicago, Paris, Tokyo", icon: "⚖️" },
              { niche: "Fitness & Wellness", cities: "LA, Berlin, Milan", icon: "💪" },
              { niche: "Food & Beverage", cities: "Rome, Madrid, Bangkok", icon: "☕" },
              { niche: "Auto Repair", cities: "Detroit, Melbourne, Phoenix", icon: "🚗" },
              { niche: "Pet Services", cities: "Seattle, Dublin, Montreal", icon: "🐾" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-800/20 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-slate-800/50 group">
                <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300">{item.icon}</div>
                <h4 className="font-bold text-white mb-1">{item.niche}</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Top Markets: {item.cities}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Stats / Proof */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center relative z-10">
            <div>
              <div className="text-5xl font-black text-white mb-2 underline decoration-white/30 decoration-4 underline-offset-8">50k+</div>
              <div className="text-blue-100 font-bold uppercase tracking-widest text-xs">Leads Scanned Monthly</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 underline decoration-white/30 decoration-4 underline-offset-8">250+</div>
              <div className="text-blue-100 font-bold uppercase tracking-widest text-xs">Industries Supported</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 underline decoration-white/30 decoration-4 underline-offset-8">100%</div>
              <div className="text-blue-100 font-bold uppercase tracking-widest text-xs">Real-Time Data</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 underline decoration-white/30 decoration-4 underline-offset-8">FREE</div>
              <div className="text-blue-100 font-bold uppercase tracking-widest text-xs">Getting Started Cost</div>
            </div>
          </div>
        </section>

        {/* Features Carousel (Static Grid for Performance) */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">Everything You Need to Scale</h2>
            <p className="text-slate-400">Built for power users by experienced agency owners.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
                title: "Sentiment Analysis",
                desc: "AI identifies the specific service flaws that customers are vocal about, giving you the perfect hook for a call or email."
              },
              {
                icon: <Globe className="w-6 h-6 text-emerald-400" />,
                title: "Deep-Scrape Socials",
                desc: "Our engine crawls business websites in the background to find their IG, FB, and LinkedIn even if they aren't on Maps."
              },
              {
                icon: <Database className="w-6 h-6 text-amber-400" />,
                title: "CRM Browser Storage",
                desc: "Save your leads, status, and custom notes directly in your browser. No login required, maximum privacy."
              },
              {
                icon: <Zap className="w-6 h-6 text-rose-400" />,
                title: "Real-Time Google API",
                desc: "Powered by SerpAPI to ensure you get the absolute latest business information, not outdated database snapshots."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
                title: "Lead Health Audit",
                desc: "We check 'Open State' and rating trends to make sure you aren't wasting time on businesses that are closing down."
              },
              {
                icon: <Code className="w-6 h-6 text-indigo-400" />,
                title: "Export to CSV",
                desc: "Move your curated lead lists into your favorite CRM or outreach tool like Instantly, HubSpot, or Salesforce with one click."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-800/40 border border-white/5 hover:border-white/20 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-blue-600/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "Is BizFinder AI really free to use?", a: "The platform itself is open-source. To get live data, you'll need a free Gemini API key and a SerpAPI key (which has a generous free tier of 250 searches/mo)." },
              { q: "Do I need to install any software?", a: "No. BizFinder AI is a web-based application. All data is processed in your browser and your API keys are stored securely in your local environment." },
              { q: "What countries do you support?", a: "We support every country and city that Google Maps indexing covers. If it's on the map, we can find it." },
              { q: "Can I use this for bulk outreach?", a: "Yes. Once you save leads to your CRM, you can use our 'Bulk Email' feature to open prepared Gmail threads for multiple recipients simultaneously." }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 transition-colors">
                <h4 className="font-bold text-white mb-2 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-400 pl-4.5 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">Ready to Find Your <br /> Next High-Ticket Client?</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                Join 1,000+ agency owners today. No credit card required, just bring your ambition.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/finder" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  Get Started Personally <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/guide" className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg backdrop-blur-md transition-all border border-white/10 hover:border-white/30 flex items-center justify-center gap-2">
                  Read Documentation
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-40">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> 100% Free Tier</div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> No Credit Card</div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Zero Installation</div>
            </div>
          </div>
        </section>

      </main>

      {/* Structured GEO Content for AI Bots & SEO Crawler */}
      <div className="sr-only">
        <h2>Targeted Lead Generation Markets</h2>
        <ul>
          <li><strong>Leads in United States:</strong> Business contacts in New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose.</li>
          <li><strong>Leads in United Kingdom:</strong> B2B prospects in London, Birmingham, Manchester, Glasgow, Liverpool, Bristol, Edinburgh, Leicester, Coventry, Leeds.</li>
          <li><strong>Leads in United Arab Emirates:</strong> Enterprise search in Dubai, Abu Dhabi, Sharjah, Al Ain.</li>
          <li><strong>Leads in Australia:</strong> Local business search in Sydney, Melbourne, Brisbane, Perth, Adelaide.</li>
        </ul>
        <h3>Service Categories</h3>
        <p>SEO Agencies, Web Design Studios, Facebook Ads Experts, Google Ads Managers, Social Media Marketing (SMMA), Content Creators, Email Marketing Consultants.</p>
      </div>

    </div>
  );
}