import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { useTranslation } from '../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useTranslation();
  const [trackInput, setTrackInput] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactData, setContactData] = useState({
    senderName: '',
    company: '',
    fromCity: '',
    toCity: '',
    weightEst: '',
    mobile: '',
  });

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    navigate(`/track?id=${encodeURIComponent(trackInput.trim().toUpperCase())}`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = contactData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      alert(lang === 'hi' ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setContactSubmitted(true);
  };

  const quickTrackExamples = [
    { id: 'FLX-8829-JPR', label: lang === 'hi' ? 'दिल्ली से जयपुर' : 'Delhi to Jaipur', item: 'Garments' },
    { id: 'FLX-4012-MUM', label: lang === 'hi' ? 'सूरत से मुंबई' : 'Surat to Mumbai', item: 'Textiles' },
    { id: 'FLX-3109-BLR', label: lang === 'hi' ? 'चेन्नई से बेंगलुरु' : 'Chennai to Bengaluru', item: 'Auto Spares' },
    { id: 'FLX-7741-KOL', label: lang === 'hi' ? 'लुधियाना से कोलकाता' : 'Ludhiana to Kolkata', item: 'Hosiery' },
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 selection:bg-orange-500 selection:text-white transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/70 dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#111827] border-b border-slate-200/80 dark:border-slate-800 pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Cinematic Logistics Terminal Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <img
            src="/assets/hero_terminal_dusk.jpg"
            alt=""
            className="w-full h-full object-cover object-center lg:object-right opacity-25 dark:opacity-40 filter saturate-110 contrast-105"
            loading="eager"
          />
          {/* Left-to-right gradient overlay to ensure headline & text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-55% to-white/30 dark:from-[#0B1220] dark:via-[#0B1220]/90 dark:via-55% dark:to-[#0B1220]/30" />
          {/* Top and bottom vertical blends */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-slate-100/90 dark:from-[#0B1220]/80 dark:via-transparent dark:to-[#0B1220]" />
        </div>

        {/* Subtle decorative background blur glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-400/5 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (Headline & CTAs) - 7 cols */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Slogan & Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-900 dark:text-white tracking-wide">VELTRAX</span>
                <span className="text-orange-400 font-bold">—</span>
                <span className="font-mono font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase">MOVING BEYOND MILES.</span>
                <span className="text-orange-300 dark:text-orange-700 hidden sm:inline">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">{lang === 'hi' ? '9 प्रमुख क्षेत्रीय हब कॉरिडोर' : '9 Regional Hub Corridors'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.08]">
                {lang === 'hi' ? (
                  <>
                    वेलट्रैक्स — मीलों से आगे। <br />
                    <span className="text-orange-500">तेज, व्यवस्थित और पारदर्शी माल ढुलाई।</span>
                  </>
                ) : (
                  <>
                    VELTRAX — MOVING BEYOND MILES. <br />
                    <span className="text-orange-500">Fast, Reliable & Connected Logistics.</span>
                  </>
                )}
              </h1>

              {/* Supporting Copy */}
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                {lang === 'hi'
                  ? 'वेलट्रैक्स एक तकनीक-संचालित लॉजिस्टिक्स प्रबंधन प्लेटफॉर्म है, जो व्यापारियों, निर्माताओं और आधुनिक व्यवसायों को डोरस्टेप पार्सल कलेक्शन, शेड्यूल्ड हाईवे कॉरिडोर और पारदर्शी डिलीवरी ऑपरेशंस से जोड़ता है।'
                  : 'A technology-driven logistics management platform connecting businesses, customers, and transportation networks through reliable, fast, and efficient delivery operations.'}
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/create"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-orange-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <IndustrialIcon name="plus" size={16} />
                  <span>{lang === 'hi' ? 'पार्सल बुक करें' : 'Book a Shipment'}</span>
                </Link>

                <a
                  href="#tracking"
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <IndustrialIcon name="search" size={16} className="text-slate-500 dark:text-slate-400" />
                  <span>{lang === 'hi' ? 'कंसाइनमेंट खोजें' : 'Search Consignment'}</span>
                </a>
              </div>

              {/* Key Verified Capability Chips */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 max-w-xl">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 shadow-2xs">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">9 Hubs</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'hi' ? 'क्षेत्रीय स्टेशन नेटवर्क' : 'Regional Stations'}</div>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 shadow-2xs">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Multimodal</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'hi' ? 'सड़क व रेल परिवहन' : 'Road & Rail Fleet'}</div>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 shadow-2xs">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Standard LR</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'hi' ? 'डिजिटल बिलती दस्तावेज' : 'Digital Bilty Records'}</div>
                </div>
              </div>
            </div>

            {/* Right Column: VELTRAX Logistics Journey & Multimodal Illustration */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/90 dark:border-slate-700 shadow-xl rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all hover:shadow-2xl">

                {/* Card Top Title & Capabilities Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      {lang === 'hi' ? 'लॉजिस्टिक्स कॉरिडोर आर्किटेक्चर' : 'Corridor Architecture & Transit'}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {lang === 'hi' ? 'मल्टीमॉडल एक्सप्रेस नेटवर्क' : 'Multimodal Freight Coordination'}
                    </h3>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700">
                    Capability Visual
                  </span>
                </div>

                {/* SVG Logistics Journey Visual Composition */}
                <div className="py-4">
                  <svg
                    viewBox="0 0 480 250"
                    className="w-full h-auto select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                      <linearGradient id="hubGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                      <linearGradient id="truckBody" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="100%" stopColor="#EA580C" />
                      </linearGradient>
                    </defs>

                    {/* Soft Background Grid */}
                    <pattern id="illusGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#F1F5F9" strokeWidth="0.8" />
                    </pattern>
                    <rect width="480" height="250" fill="url(#illusGrid)" rx="16" />

                    {/* Multimodal Rail Track (Lower Corridor) */}
                    <path
                      d="M 50 200 C 180 230 300 230 430 200"
                      fill="none"
                      stroke="#CBD5E1"
                      strokeWidth="3"
                      strokeDasharray="4 6"
                    />
                    {/* Rail freight cars with two separate containers */}
                    <g transform="translate(160, 208) rotate(6)">
                      {/* Railway Freight Container 1: RAIL */}
                      <g id="train-container-rail">
                        {/* Flatcar chassis base */}
                        <rect x="0" y="4.5" width="45" height="2.5" rx="0.5" fill="#1E293B" />
                        {/* Container 1 Independent Body */}
                        <rect x="0" y="-10" width="45" height="14.5" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1" />
                        {/* Corner Castings */}
                        <rect x="1.5" y="-8.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        <rect x="41" y="-8.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        <rect x="1.5" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        <rect x="41" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        {/* Container 1 Label: RAIL */}
                        <text
                          x="22.5"
                          y="-2.5"
                          fill="#FFFFFF"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          letterSpacing="1"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          RAIL
                        </text>
                        {/* Car 1 Wheels */}
                        <circle cx="9" cy="8" r="3.5" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
                        <circle cx="9" cy="8" r="1.2" fill="#CBD5E1" />
                        <circle cx="36" cy="8" r="3.5" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
                        <circle cx="36" cy="8" r="1.2" fill="#CBD5E1" />
                      </g>

                      {/* Coupler link connecting wagons across the physical gap */}
                      <rect x="43" y="4.5" width="12" height="2" rx="0.5" fill="#334155" />
                      <circle cx="49" cy="5.5" r="1" fill="#0F172A" />

                      {/* Railway Freight Container 2: FREIGHT */}
                      <g id="train-container-freight">
                        {/* Flatcar chassis base */}
                        <rect x="53" y="4.5" width="45" height="2.5" rx="0.5" fill="#1E293B" />
                        {/* Container 2 Independent Body */}
                        <rect x="53" y="-10" width="45" height="14.5" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1" />
                        {/* Corner Castings */}
                        <rect x="54.5" y="-8.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        <rect x="94" y="-8.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        <rect x="54.5" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        <rect x="94" y="0.5" width="2.5" height="2.5" rx="0.5" fill="#334155" />
                        {/* Container 2 Label: FREIGHT */}
                        <text
                          x="75.5"
                          y="-2.5"
                          fill="#FFFFFF"
                          fontSize="6.2"
                          fontWeight="bold"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          letterSpacing="0.6"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          FREIGHT
                        </text>
                        {/* Car 2 Wheels */}
                        <circle cx="62" cy="8" r="3.5" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
                        <circle cx="62" cy="8" r="1.2" fill="#CBD5E1" />
                        <circle cx="89" cy="8" r="3.5" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
                        <circle cx="89" cy="8" r="1.2" fill="#CBD5E1" />
                      </g>
                    </g>

                    {/* Highway Ribbon (Main Road Corridor) */}
                    <path
                      d="M 60 145 C 160 80 320 80 420 145"
                      fill="none"
                      stroke="url(#roadGradient)"
                      strokeWidth="28"
                      strokeLinecap="round"
                    />
                    {/* Highway Center Dashed Line */}
                    <path
                      d="M 68 145 C 160 85 320 85 412 145"
                      fill="none"
                      stroke="#F8FAFC"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      opacity="0.8"
                    />

                    {/* Commercial Freight Truck on Highway */}
                    <g transform="translate(182, 78)">
                      {/* Truck Shadow */}
                      <ellipse cx="58" cy="29" rx="62" ry="7" fill="#0F172A" opacity="0.15" />
                      {/* Truck Cargo Box */}
                      <rect x="0" y="0" width="94" height="25" rx="3" fill="url(#truckBody)" />
                      {/* VELTRAX Branding on Cargo Box */}
                      <rect x="9" y="5" width="15" height="15" rx="2.5" fill="#FFFFFF" opacity="0.95" />
                      <text x="16.5" y="15.8" fill="#F97316" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">V</text>
                      <text x="30" y="15.8" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.8">VELTRAX</text>
                      {/* Truck Cabin */}
                      <path d="M 94 8 L 108 8 L 116 17 L 116 25 L 94 25 Z" fill="#0F172A" />
                      <path d="M 96 10 L 106 10 L 111 17 L 96 17 Z" fill="#94A3B8" />
                      {/* Headlight beam */}
                      <polygon points="116,19 136,16 136,25 116,23" fill="#FDE047" opacity="0.4" />
                      {/* Wheels */}
                      <circle cx="14" cy="25" r="5" fill="#0F172A" />
                      <circle cx="14" cy="25" r="2" fill="#CBD5E1" />
                      <circle cx="28" cy="25" r="5" fill="#0F172A" />
                      <circle cx="28" cy="25" r="2" fill="#CBD5E1" />
                      <circle cx="78" cy="25" r="5" fill="#0F172A" />
                      <circle cx="78" cy="25" r="2" fill="#CBD5E1" />
                      <circle cx="106" cy="25" r="5" fill="#0F172A" />
                      <circle cx="106" cy="25" r="2" fill="#CBD5E1" />
                    </g>

                    {/* Origin Warehouse / Distribution Hub (Left) */}
                    <g transform="translate(25, 115)">
                      <polygon points="10,25 35,5 60,25" fill="#0F172A" />
                      <rect x="10" y="25" width="50" height="42" rx="2" fill="url(#hubGradient)" />
                      {/* Roller Door */}
                      <rect x="22" y="38" width="26" height="29" fill="#334155" />
                      <line x1="22" y1="44" x2="48" y2="44" stroke="#64748B" strokeWidth="1" />
                      <line x1="22" y1="50" x2="48" y2="50" stroke="#64748B" strokeWidth="1" />
                      <line x1="22" y1="56" x2="48" y2="56" stroke="#64748B" strokeWidth="1" />
                      <line x1="22" y1="62" x2="48" y2="62" stroke="#64748B" strokeWidth="1" />
                      {/* Station Sign */}
                      <rect x="15" y="16" width="40" height="8" rx="2" fill="#F97316" />
                      <text x="35" y="22" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">ORIGIN HUB</text>
                      {/* Crates */}
                      <rect x="62" y="52" width="12" height="12" rx="1" fill="#D97706" />
                      <rect x="64" y="42" width="9" height="10" rx="1" fill="#B45309" />
                      <rect x="75" y="55" width="10" height="9" rx="1" fill="#F59E0B" />
                      {/* Location Pin */}
                      <circle cx="35" cy="-2" r="7" fill="#0F172A" />
                      <circle cx="35" cy="-2" r="3" fill="#F97316" />
                      <text x="35" y="80" fill="#0F172A" fontSize="9" fontWeight="bold" textAnchor="middle">Origin Terminal</text>
                    </g>

                    {/* Destination Terminal & City Delivery Van (Right) */}
                    <g transform="translate(395, 115)">
                      <rect x="15" y="20" width="55" height="47" rx="3" fill="url(#hubGradient)" />
                      <polygon points="10,20 42,5 75,20" fill="#1E293B" />
                      <rect x="22" y="26" width="12" height="10" rx="1" fill="#38BDF8" opacity="0.7" />
                      <rect x="42" y="26" width="12" height="10" rx="1" fill="#38BDF8" opacity="0.7" />
                      <rect x="25" y="42" width="34" height="25" fill="#334155" />
                      {/* Destination Badge */}
                      <rect x="16" y="14" width="52" height="8" rx="2" fill="#10B981" />
                      <text x="42" y="20" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">DESTINATION HUB</text>
                      {/* City Delivery Van */}
                      <rect x="-18" y="50" width="22" height="14" rx="2" fill="#F97316" />
                      <path d="M 4 54 L 9 54 L 12 59 L 12 64 L 4 64 Z" fill="#0F172A" />
                      <circle cx="-12" cy="64" r="3" fill="#0F172A" />
                      <circle cx="6" cy="64" r="3" fill="#0F172A" />
                      {/* Destination Pin */}
                      <circle cx="42" cy="-2" r="7" fill="#0F172A" />
                      <circle cx="42" cy="-2" r="3" fill="#10B981" />
                      <text x="42" y="80" fill="#0F172A" fontSize="9" fontWeight="bold" textAnchor="middle">Regional Depot</text>
                    </g>

                    {/* Midpoint Corridor Checkpoint Pin */}
                    <g transform="translate(240, 42)">
                      <circle cx="0" cy="0" r="10" fill="#F97316" fillOpacity="0.2" className="animate-ping" />
                      <circle cx="0" cy="0" r="7" fill="#F97316" />
                      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                      <rect x="-45" y="-20" width="90" height="16" rx="4" fill="#0F172A" />
                      <text x="0" y="-9" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">EXPRESS CORRIDOR</text>
                    </g>
                  </svg>
                </div>

                {/* Capability Features Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Corridor Network</div>
                    <div className="text-slate-900 font-bold mt-0.5">Scheduled Line-Haul</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Fixed daily vehicle dispatches</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Documentation</div>
                    <div className="text-slate-900 font-bold mt-0.5">Digital LR & Bilty</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Official e-way bill compliance</div>
                  </div>
                </div>

                {/* Exploration Note & Search Anchor */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Want to test tracking?</span>
                  <a
                    href="#tracking"
                    className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Try Sample Consignments Below</span>
                    <span>↓</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROMINENT SHIPMENT TRACKING SECTION */}
      <section id="tracking" className="py-12 sm:py-16 bg-white dark:bg-[#0B1220] border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <IndustrialIcon name="search" size={14} className="text-orange-500" />
              <span>{lang === 'hi' ? 'कंसाइनमेंट ट्रैकिंग' : 'Consignment Tracking Workflow'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'अपनी रसीद नंबर से पार्सल खोजें' : 'Track Your Consignment'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              {lang === 'hi'
                ? 'अपनी वेलट्रैक्स बिलती रसीद या कंसाइनमेंट नंबर दर्ज करें और चेकपॉइंट प्रगति देखें।'
                : 'Enter your VELTRAX Consignment ID or Bilty number to view transit checkpoints, route status, and expected delivery.'}
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-sm">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'कंसाइनमेंट नंबर डालें (उदा. FLX-8829-JPR)...' : 'Enter Consignment / Bilty Number (e.g. FLX-8829-JPR)...'}
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono px-4 py-3.5 pl-11 border border-slate-300 dark:border-slate-700 rounded-xl uppercase placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-2xs"
                />
                <span className="absolute left-3.5 top-4 text-slate-400 pointer-events-none">
                  <IndustrialIcon name="search" size={18} />
                </span>
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>{lang === 'hi' ? 'खोजें' : 'Track Consignment'}</span>
                <IndustrialIcon name="arrow-right" size={14} />
              </button>
            </form>

            {/* Quick Demo Samples */}
            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'hi' ? 'डेमो कंसाइनमेंट चेक करें:' : 'Try sample consignments from demo dataset:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {quickTrackExamples.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => navigate(`/track?id=${ex.id}`)}
                    className="bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 hover:border-orange-300 dark:hover:border-slate-600 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <strong className="text-slate-900 dark:text-white font-bold">{ex.id}</strong>
                    <span className="text-slate-400 dark:text-slate-400">({ex.label})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES SECTION */}
      <section id="services" className="py-16 sm:py-20 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
                {lang === 'hi' ? 'हमारी सेवाएं' : 'Core Logistics Solutions'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'हर प्रकार के व्यापार के लिए संपूर्ण समाधान' : 'Engineered for Reliability Across India'}
              </h2>
            </div>
            <Link
              to="/create"
              className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1.5 self-start md:self-auto transition-colors"
            >
              <IndustrialIcon name="plus" size={14} className="text-orange-500" />
              <span>{lang === 'hi' ? 'नया पार्सल बुक करें' : 'Book a Parcel'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <IndustrialIcon name="box" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {lang === 'hi' ? 'एक्सप्रेस पार्सल डिलीवरी' : 'Express Parcel Delivery'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {lang === 'hi'
                    ? 'छोटे दुकानदारों और ग्राहकों के लिए 1 किलो से 20 किलो तक के पार्सल। डोरस्टेप पिकअप और सुरक्षित सुपुर्दगी।'
                    : 'Doorstep pickup and swift transit for cartons, apparel, and retail merchandise with customer status notifications.'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <span>{lang === 'hi' ? 'नियमित कॉरिडोर लाइन' : 'Scheduled Corridors'}</span>
                <span>➔</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <IndustrialIcon name="weight" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {lang === 'hi' ? 'व्यापारिक पार्सल (LTL Cargo)' : 'Commercial LTL Cargo'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {lang === 'hi'
                    ? '20 किलो से 5 टन तक का भारी व्यापारिक माल। पक्की जीएसटी बिलती, ई-वे बिल अनुपालन और नियमित ट्रांसपोर्ट लाइन।'
                    : 'Part-truckload services designed for SME traders, textile merchants, and distributors. Complete GST bilty and e-way bill compliance.'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span>{lang === 'hi' ? 'दैनिक ट्रांसपोर्ट लाइन' : 'Daily Express Line-Haul'}</span>
                <span>➔</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <IndustrialIcon name="truck" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {lang === 'hi' ? 'पूर्ण ट्रक लोड (FTL Freight)' : 'Full Truckload Freight'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {lang === 'hi'
                    ? 'समर्पित गाड़ियों की बुकिंग सीधे आपके गोदाम से गंतव्य तक। 32-फीट कंटेनर, आयशर और टाटा गाड़ियों की उपलब्धता।'
                    : 'Dedicated fleet vehicles for industrial manufacturers. Direct point-to-point dispatch with zero transhipment handling.'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>{lang === 'hi' ? 'सीधा पॉइंट-टू-पॉइंट' : 'Point-to-Point Direct'}</span>
                <span>➔</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <IndustrialIcon name="shield" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {lang === 'hi' ? 'सुरक्षित हैंडओवर व ई-पीओडी' : 'Secure Handover & Proof'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {lang === 'hi'
                    ? 'प्राप्तकर्ता ओटीपी सत्यापन के बाद ही डिलीवरी। डिजिटल रसीद सीधे पोर्टल पर उपलब्ध।'
                    : 'Tamper-evident operations with consignee OTP validation. Digital Proof of Delivery (e-POD) record generated upon completion.'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <span>{lang === 'hi' ? 'ओटीपी सुरक्षित' : 'OTP Verified Delivery'}</span>
                <span>➔</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: 4 SIMPLE STEPS */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white dark:bg-[#0B1220] border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              {lang === 'hi' ? 'सरल प्रक्रिया' : 'Simple 4-Step Journey'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'पार्सल भेजना अब बेहद आसान' : 'How VELTRAX Works for You'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {lang === 'hi'
                ? 'ऑनलाइन बुकिंग से लेकर सुरक्षित डोरस्टेप डिलीवरी तक की पारदर्शी कार्यप्रणाली'
                : 'From doorstep collection to verified consignee delivery with milestone tracking.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white font-bold text-xs flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'hi' ? 'ऑनलाइन या काउंटर बुकिंग' : 'Book Online or Station'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'भेजने और पाने वाले का पता, पिन कोड और वजन डालें। पारदर्शी किराया और समय देखें।'
                  : 'Specify origin, destination, cargo weight, and preferred speed to calculate transparent freight rates.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'hi' ? 'डोरस्टेप पिकअप व रसीद' : 'Doorstep Pickup & Bilty'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'हमारा वाहन आपके पते पर आकर पार्सल लेता है। डिजिटल बारकोड बिलती जारी होती है।'
                  : 'Our fleet driver collects the consignment from your address and issues an official digital LR with barcode.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'hi' ? 'कॉरिडोर एक्सप्रेस ट्रांजिट' : 'Highway Transit & Tracking'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'माल सुरक्षित एक्सप्रेस हाईवे कॉरिडोर से भेजा जाता है। पोर्टल पर चेकपॉइंट अपडेट देखें।'
                  : 'Monitored line-haul transit through dedicated freight corridors with checkpoint status logging.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'hi' ? 'ओटीपी सुरक्षित सुपुर्दगी' : 'Verified OTP Handover'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'प्राप्तकर्ता द्वारा सामान जांचने और ओटीपी बताने पर ही डिलीवरी पूरी होती है।'
                  : 'Consignee inspects cargo and verifies via 4-digit security OTP to finalize official digital proof of delivery.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY VELTRAX SECTION */}
      <section id="about" className="py-16 sm:py-20 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left 6 cols */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {lang === 'hi' ? 'हमारा संकल्प' : 'Why Businesses Choose VELTRAX'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                {lang === 'hi'
                  ? 'विश्वसनीय माल परिवहन और अनुशासित संचालन'
                  : 'Structured Freight Logistics and Operational Discipline'}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {lang === 'hi'
                  ? 'हमने पुराने और असंगठित ट्रांसपोर्ट के तरीकों को बदलकर आधुनिक तकनीक, व्यवस्थित रूट और स्पष्ट कीमतों से संचालन किया है।'
                  : 'We combine organized highway line-hauls with transparent pricing matrices, digital documentation, and milestone checkpoint visibility.'}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <IndustrialIcon name="shield" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'चेकपॉइंट दृश्यता व ट्रैकिंग' : 'Checkpoint Visibility'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {lang === 'hi' ? 'प्रत्येक पार्सल पर डिजिटल बारकोड व चेकपॉइंट अपडेट।' : 'Barcode scanning at every terminal, milestone logging, and recipient notification.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <IndustrialIcon name="compass" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'संगठित 6 क्षेत्रीय हब स्टेशन' : 'Structured Hub-and-Spoke Grid'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {lang === 'hi' ? 'दिल्ली, जयपुर, सूरत, मुंबई, बेंगलुरु और कोलकाता में सक्रिय सेंटर।' : 'Regional consolidation terminals ensuring streamlined line-haul transfers across major trade corridors.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <IndustrialIcon name="truck" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'मल्टीमॉडल एक्सप्रेस संयोजन' : 'Multimodal Routing Coordination'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {lang === 'hi' ? 'एक्सप्रेसवे और रेलमार्ग का उचित समन्वय।' : 'Coordinated highway and rail freight options to meet delivery timelines consistently.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <IndustrialIcon name="phone" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'क्षेत्रीय ऑपरेशंस डेस्क' : 'Regional Operations Desk'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {lang === 'hi' ? 'हमारे रूट कोऑर्डिनेटर प्रत्येक कॉरिडोर पर सक्रिय सहायता प्रदान करते हैं।' : 'Experienced dispatch coordinators assisting freight routing across all active corridors.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 cols (Visual Feature Card) */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 dark:bg-[#1E293B] border border-slate-800 dark:border-slate-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
                  VELTRAX Architecture
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
                  {lang === 'hi' ? 'पारदर्शी माल परिवहन व्यवस्था' : 'Transparent Logistics Built for Growth'}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {lang === 'hi'
                    ? 'चाहे एक 5 किलो का बॉक्स हो या 10 टन का इंडस्ट्रियल कंसाइनमेंट, हमारा सिस्टम हर कदम पर आपको सूचित और सुरक्षित रखता है।'
                    : 'From lightweight commercial cartons to heavy industrial freight, our platform provides clear documentation, predictable pricing, and disciplined execution.'}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 dark:border-slate-700 text-xs">
                  <div>
                    <div className="text-orange-400 font-bold text-base">Digital LR</div>
                    <div className="text-slate-400 mt-0.5">Official Consignment Documentation</div>
                  </div>
                  <div>
                    <div className="text-emerald-400 font-bold text-base">Transparent Rates</div>
                    <div className="text-slate-400 mt-0.5">Predictable Weight & Distance Matrices</div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    <span>{lang === 'hi' ? 'अभी बुकिंग शुरू करें' : 'Start Your Consignment'}</span>
                    <IndustrialIcon name="arrow-right" size={14} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING MATRICES */}
      <section id="pricing" className="py-16 sm:py-20 bg-white dark:bg-[#0B1220] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              {lang === 'hi' ? 'दर तालिका' : 'Indicative Rate Schedules'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'पारदर्शी माल ढुलाई दरें' : 'Transparent Freight Rate Tiers'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {lang === 'hi'
                ? 'वजन और दूरी के अनुसार उचित दरें। डिजिटल बिलती और डोरस्टेप पिकअप शामिल।'
                : 'Indicative per-kg and per-ton pricing matrices with doorstep collection on eligible routes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1 */}
            <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                  {lang === 'hi' ? '1 से 10 किलो तक' : 'Up to 10 KG'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {lang === 'hi' ? 'छोटा पार्सल (Express Box)' : 'Standard Parcel'}
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white my-4">
                  ₹60 <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ KG</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {lang === 'hi' ? 'सैंपल, कपड़े और जरूरी कागजात के लिए सबसे उपयुक्त।' : 'Ideal for urgent commercial samples, garments, and retail boxes.'}
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'घर/दुकान से पिकअप' : 'Doorstep collection available'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'चेकपॉइंट ट्रैकिंग' : 'Milestone status updates'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'कैश ऑन डिलीवरी (COD) उपलब्ध' : 'Cash on Delivery (COD) supported'}
                  </li>
                </ul>
              </div>
              <Link
                to="/create"
                className="w-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'hi' ? 'छोटा पार्सल बुक करें' : 'Book Standard Parcel'}</span>
                <IndustrialIcon name="arrow-right" size={13} />
              </Link>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="bg-white dark:bg-[#1E293B] border-2 border-orange-500 rounded-2xl p-6 sm:p-8 relative flex flex-col justify-between shadow-lg shadow-orange-500/5">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                {lang === 'hi' ? 'व्यापारियों की पसंद' : 'Popular for Commercial Cargo'}
              </div>

              <div>
                <div className="text-xs font-semibold uppercase text-orange-600 dark:text-orange-400 tracking-wider mb-2">
                  {lang === 'hi' ? '10 से 200 किलो तक' : '10 to 200 KG'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {lang === 'hi' ? 'व्यापारिक पार्सल (Commercial LTL)' : 'Commercial Consignment'}
                </h3>
                <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 my-4">
                  ₹35 <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ KG</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {lang === 'hi' ? 'दुकानदारों और थोक व्यापारियों के लिए नियमित माल ढुलाई।' : 'High-capacity transportation for wholesale textiles, parts, and boxed goods.'}
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'पक्की जीएसटी बिलती रसीद' : 'Official GST LR Bilty'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'शेड्यूल्ड कॉरिडोर ट्रांजिट' : 'Scheduled corridor line-haul'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'पार्सल सुरक्षा व्यवस्था' : 'Transit insurance options'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'स्टेशन कोऑर्डिनेटर सहायता' : 'Corridor coordinator support'}
                  </li>
                </ul>
              </div>
              <Link
                to="/create"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-3 rounded-xl text-center transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'hi' ? 'व्यापारी पार्सल भेजें' : 'Book Commercial Consignment'}</span>
                <IndustrialIcon name="arrow-right" size={13} />
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                  {lang === 'hi' ? '200 किलो से ऊपर' : '200+ KG & Full Truckload'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {lang === 'hi' ? 'पूर्ण ट्रक लोड (Dedicated Freight)' : 'Heavy Freight & FTL'}
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white my-4">
                  {lang === 'hi' ? 'कस्टम दर' : 'Custom Rates'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {lang === 'hi' ? 'फैक्ट्रियों और वेयरहाउस के लिए पूरी गाड़ी सीधी डिलीवरी।' : 'Point-to-point dedicated vehicle logistics for enterprise manufacturers.'}
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'सीधे आपके गोदाम से लोडिंग' : 'Direct warehouse dispatch'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'जीरो ट्रांसशिपमेंट सुरक्षा' : 'Zero transhipment direct route'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> {lang === 'hi' ? 'लोडिंग और अनलोडिंग समन्वय' : 'Loading & un-loading assistance'}
                  </li>
                </ul>
              </div>
              <a
                href="#contact"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold px-4 py-3 rounded-xl text-center transition-colors shadow-xs flex items-center justify-center gap-1.5 border border-transparent dark:border-slate-700"
              >
                <span>{lang === 'hi' ? 'गाड़ी का किराया पूछें' : 'Request Freight Rate'}</span>
                <IndustrialIcon name="phone" size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT & ENTERPRISE INQUIRY FORM */}
      <section id="contact" className="py-16 sm:py-20 bg-slate-50 dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct Operational Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {lang === 'hi' ? 'पूछताछ व ऑपरेशंस' : 'Operations & Rate Desk'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                {lang === 'hi'
                  ? 'माल ढुलाई पूछताछ व कॉरिडोर जानकारी'
                  : 'Talk to Our Route Dispatchers'}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {lang === 'hi'
                  ? 'हमारे अनुभवी लॉजिस्टिक्स अधिकारी कॉरिडोर रूट और दर निर्धारण में आपकी सहायता करते हैं। पूछताछ फॉर्म भरें।'
                  : 'Have a heavy consignment or need commercial corridor coordination? Submit your routing details below to connect with our operations team.'}
              </p>

              <div className="space-y-3 pt-2">
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-2xs">
                  <div className="text-xs text-slate-400 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {lang === 'hi' ? 'क्षेत्रीय ऑपरेशंस डेस्क' : 'Regional Operations Desk'}
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Station Network Operations
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'hi' ? 'दिल्ली • जयपुर • सूरत • मुंबई • बेंगलुरु • कोलकाता' : 'Corridor Desk: Delhi • Jaipur • Surat • Mumbai • Bengaluru • Kolkata'}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-2xs">
                  <div className="text-xs text-slate-400 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {lang === 'hi' ? 'सपोर्ट ईमेल' : 'Support Desk'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                    <IndustrialIcon name="file" size={16} className="text-orange-500" />
                    <span>support@veltrax.in</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'hi' ? 'ऑनलाइन दर व रूट संबंधी जानकारी' : 'Online inquiry desk for freight rates and scheduling'}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-2xs">
                  <div className="text-xs text-slate-400 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {lang === 'hi' ? 'व्हाट्सएप सहायता' : 'WhatsApp Desk'}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href="https://wa.me/916303766064"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:text-[#20bd5a] font-mono text-base font-bold flex items-center gap-2 transition-colors"
                      title="Chat on WhatsApp (+91 6303766064)"
                    >
                      <IndustrialIcon name="phone" size={16} />
                      <span>+91 6303766064</span>
                    </a>
                    <a
                      href="https://wa.me/916303766064"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{lang === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}</span>
                    </a>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'hi' ? 'बुकिंग व लाइव पार्सल पूछताछ के लिए 24/7 संपर्क' : 'Direct WhatsApp chat for booking, rates & tracking assistance'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Enterprise Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'माल ढुलाई पूछताछ' : 'Request a Freight Quote'}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang === 'hi' ? 'विवरण भरें, हमारी टीम रूट व दर समीक्षा करेगी' : 'Enter routing details below for corridor assessment'}
                    </div>
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shrink-0">
                    {lang === 'hi' ? 'पूछताछ डेस्क' : 'Quote Inquiry Desk'}
                  </span>
                </div>

                {contactSubmitted ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                      <IndustrialIcon name="check" size={24} />
                    </div>
                    <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                      {lang === 'hi' ? 'अनुरोध प्राप्त हुआ // REF: INQ-9912' : 'Inquiry Recorded // REF: INQ-9912'}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      {lang === 'hi'
                        ? 'धन्यवाद! आपकी माल ढुलाई पूछताछ दर्ज कर ली गई है। हमारे रीजनल कॉरिडोर डेस्क द्वारा आपके रूट विवरण की समीक्षा की जाएगी।'
                        : 'Thank you! Your consignment inquiry has been recorded in the demonstration portal. Our regional corridor team will review your routing details.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors mt-2"
                    >
                      {lang === 'hi' ? 'एक और पूछताछ भेजें' : 'Submit Another Request'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'hi' ? 'आपका नाम *' : 'Contact Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={lang === 'hi' ? 'उदा. रमेश शर्मा' : 'e.g. Ramesh Sharma'}
                          value={contactData.senderName}
                          onChange={(e) => setContactData({ ...contactData, senderName: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'hi' ? 'व्यापार / कंपनी का नाम' : 'Business / Firm Name'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'hi' ? 'उदा. शर्मा वस्त्र भंडार' : 'e.g. Sharma Textiles'}
                          value={contactData.company}
                          onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'hi' ? 'कहाँ से (मूल शहर) *' : 'Pickup City (Origin) *'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={lang === 'hi' ? 'उदा. दिल्ली / चांदनी चौक' : 'e.g. Delhi / Chandni Chowk'}
                          value={contactData.fromCity}
                          onChange={(e) => setContactData({ ...contactData, fromCity: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'hi' ? 'कहाँ तक (गंतव्य शहर) *' : 'Delivery City (Destination) *'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={lang === 'hi' ? 'उदा. जयपुर / जोहरी बाजार' : 'e.g. Jaipur / Johari Bazar'}
                          value={contactData.toCity}
                          onChange={(e) => setContactData({ ...contactData, toCity: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'hi' ? 'अनुमानित वजन / कार्टन' : 'Estimated Weight / Cartons'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'hi' ? 'उदा. 45 किलो या 3 कार्टन' : 'e.g. 45 KG or 3 Cartons'}
                          value={contactData.weightEst}
                          onChange={(e) => setContactData({ ...contactData, weightEst: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Contact Mobile (10 digits) *'}
                        </label>
                        <div className="flex">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-2.5 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl font-mono text-xs flex items-center font-medium">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="98110 44291"
                            value={contactData.mobile}
                            onChange={(e) => setContactData({ ...contactData, mobile: e.target.value.replace(/\D/g, '') })}
                            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-r-xl font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all w-full flex items-center justify-center gap-2 mt-4"
                    >
                      <IndustrialIcon name="phone" size={16} />
                      <span>{lang === 'hi' ? 'पूछताछ दर्ज करें' : 'Submit Rate Request'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. BOTTOM CALL TO ACTION BANNER */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {lang === 'hi' ? 'आज ही अपना पार्सल बुक करें' : 'Ready to Send Your Shipment?'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {lang === 'hi'
                  ? 'पारदर्शी दरें, व्यवस्थित लाइन-हॉल कॉरिडोर और डिजिटल बिलती के साथ निश्चिंत रहें।'
                  : 'Experience modern highway logistics with zero transhipment risk, transparent rates, and verified checkpoint tracking.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <Link
                to="/create"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-6 py-3.5 rounded-xl shadow-md shadow-orange-500/25 transition-all text-center"
              >
                {lang === 'hi' ? 'पार्सल बुक करें' : 'Book Shipment'}
              </Link>
              <Link
                to="/track"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-6 py-3.5 rounded-xl border border-slate-700 transition-all text-center"
              >
                {lang === 'hi' ? 'ट्रैकिंग पोर्टल' : 'Track Consignment'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
