import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { Barcode } from '../components/common/Barcode';
import { useTranslation, InfoTooltip } from '../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useTranslation();
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
    // Validate 10 digit Indian mobile
    const cleanMobile = contactData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      alert(lang === 'hi' ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setContactSubmitted(true);
  };

  const quickTrackExamples = [
    { id: 'FLX-8829-JPR', label: lang === 'hi' ? 'दिल्ली से जयपुर (कपड़े)' : 'Delhi to Jaipur (Garments)' },
    { id: 'FLX-4012-MUM', label: lang === 'hi' ? 'सूरत से मुंबई (साड़ियां)' : 'Surat to Mumbai (Sarees)' },
    { id: 'FLX-3109-BLR', label: lang === 'hi' ? 'चेन्नई से बेंगलुरु (पार्ट्स)' : 'Chennai to Bengaluru (Parts)' },
    { id: 'FLX-7741-KOL', label: lang === 'hi' ? 'लुधियाना से कोलकाता (ऊनी माल)' : 'Ludhiana to Kolkata (Woollens)' },
  ];

  return (
    <div className="flex-1">
      {/* 1. ASYMMETRIC HERO SECTION */}
      <section className="border-b-[2px] border-asphalt bg-paper relative overflow-hidden">
        {/* Manifest background technical markings */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none select-none font-mono text-[9px] p-4 leading-none hidden lg:block overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap">
              DELHI-JAIPUR EXPRESS // PARCEL ID FLX-8829-JPR // TATA 407 & EICHER CARGO // 100% SAFE DELIVERY WITH RECEIPT
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Editorial Headline & Value Prop) - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              {/* Stencil Tag */}
              <div className="inline-flex items-center gap-2 bg-asphalt text-paper font-heading text-xs uppercase tracking-widest px-3 py-1.5 border border-asphalt stamp-sm">
                <span className="w-2 h-2 bg-orange inline-block"></span>
                <span>{t('hero.badge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl uppercase text-asphalt tracking-tight leading-[0.95]">
                {lang === 'hi' ? (
                  <>दिल्ली से जयपुर पार्सल भेजें, <span className="text-orange underline decoration-asphalt decoration-4 underline-offset-4">अगले दिन पहुंचेगा।</span></>
                ) : (
                  <>Send Parcels from <span className="text-orange underline decoration-asphalt decoration-4 underline-offset-4">Delhi to Jaipur</span> Next Day.</>
                )}
              </h1>

              {/* Concrete human copy */}
              <p className="font-body text-base sm:text-lg text-asphalt leading-relaxed max-w-2xl font-medium">
                {t('hero.subheadline')}
              </p>

              {/* Hero Live Tracking Search Box */}
              <div className="bg-chalk border-[2px] border-asphalt p-4 sm:p-5 stamp-lg max-w-xl">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-asphalt mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <IndustrialIcon name="search" size={14} className="text-orange" />
                    {t('hero.trackBoxTitle')}
                  </span>
                  <span className="font-mono text-[10px] text-steel">LIVE STATUS</span>
                </div>

                <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t('hero.trackInputPlaceholder')}
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      className="w-full bg-paper text-asphalt text-sm font-mono px-3.5 py-3 border-[1.5px] border-asphalt rounded-[2px] uppercase placeholder:text-steel focus:outline-none focus:bg-white min-h-[48px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-industrial bg-orange text-white text-sm px-6 py-3 border-[1.5px] border-asphalt stamp-sm hover:bg-orange-hover shrink-0 flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>{t('hero.trackButton')}</span>
                    <IndustrialIcon name="arrow-right" size={14} />
                  </button>
                </form>

                {/* Helper instruction */}
                <div className="mt-2 text-[11px] font-body text-steel">
                  {lang === 'hi'
                    ? 'अपनी रसीद पर लिखा पार्सल नंबर (जैसे FLX-8829-JPR) डालें।'
                    : 'Enter the parcel number from your receipt (e.g. FLX-8829-JPR).'}
                </div>

                {/* Fast sample links */}
                <div className="mt-3 pt-3 border-t border-steel-border">
                  <div className="text-[10px] font-heading uppercase text-steel font-bold mb-1.5">
                    {t('hero.testSamples')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTrackExamples.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => navigate(`/track?id=${ex.id}`)}
                        className="bg-paper hover:bg-asphalt hover:text-paper text-asphalt text-[11px] font-mono px-2.5 py-1 border border-steel transition-colors duration-150 flex items-center gap-1"
                      >
                        <strong className="text-orange font-bold">{ex.id}</strong>
                        <span>({ex.label})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Spec Metrics */}
              <div className="grid grid-cols-3 gap-3 max-w-xl font-mono text-xs pt-2">
                <div className="border-l-[3px] border-orange pl-3">
                  <div className="font-bold text-base text-asphalt">{t('hero.stat1')}</div>
                  <div className="text-steel text-[11px]">{t('hero.stat1Label')}</div>
                </div>
                <div className="border-l-[3px] border-teal pl-3">
                  <div className="font-bold text-base text-asphalt">{t('hero.stat2')}</div>
                  <div className="text-steel text-[11px]">{t('hero.stat2Label')}</div>
                </div>
                <div className="border-l-[3px] border-yellow pl-3">
                  <div className="font-bold text-base text-asphalt">{t('hero.stat3')}</div>
                  <div className="text-steel text-[11px]">{t('hero.stat3Label')}</div>
                </div>
              </div>
            </div>

            {/* Right Column (Printed Parcel Receipt Card) - 5 cols */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="bg-chalk border-[2px] border-asphalt p-6 stamp-lg relative overflow-hidden ticket-perforated-r">
                {/* Hazard corner tag */}
                <div className="absolute top-0 right-0 w-24 h-6 hazard-stripes border-b border-l border-asphalt"></div>

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="font-heading font-black text-xs text-orange tracking-widest uppercase">
                      {lang === 'hi' ? 'पक्की पार्सल रसीद' : 'PARCEL DELIVERY RECEIPT (LR)'}
                    </span>
                    <h2 className="font-heading font-black text-2xl text-asphalt uppercase leading-none mt-1">
                      DELHI ➔ JAIPUR ROUTE
                    </h2>
                  </div>
                </div>

                <div className="font-mono text-xs space-y-2 border-y border-asphalt py-3 my-3">
                  <div className="flex justify-between">
                    <span className="text-steel">{lang === 'hi' ? 'पार्सल नंबर:' : 'PARCEL NUMBER:'}</span>
                    <span className="text-asphalt font-bold">FLX-8829-JPR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-steel">{lang === 'hi' ? 'भेजने वाला (Sender):' : 'SENDER:'}</span>
                    <span className="text-asphalt font-bold">Ramesh Sharma (Delhi)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-steel">{lang === 'hi' ? 'पाने वाला (Receiver):' : 'RECEIVER:'}</span>
                    <span className="text-asphalt font-bold">Amit Gupta (Jaipur)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-steel">{lang === 'hi' ? 'सामान और वजन:' : 'GOODS & WEIGHT:'}</span>
                    <span className="text-asphalt font-bold">35 Cartons • 1,420 KG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-steel">{lang === 'hi' ? 'भुगतान (Payment):' : 'PAYMENT:'}</span>
                    <span className="text-teal font-bold">{lang === 'hi' ? 'डिलीवरी पर नकद (COD)' : 'Cash on Delivery (COD)'}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="my-4">
                  <div className="flex justify-between font-mono text-[11px] text-steel mb-1">
                    <span>DELHI CENTRE</span>
                    <span className="text-orange font-bold">{lang === 'hi' ? 'रास्ते में है (72%)' : 'ON THE WAY (72%)'}</span>
                    <span>JAIPUR CENTRE</span>
                  </div>
                  <div className="w-full bg-[#EAE5D9] h-3 border border-asphalt relative">
                    <div className="h-full bg-asphalt w-[72%]"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[72%] -translate-x-1/2 w-4 h-4 bg-orange border border-asphalt"></div>
                  </div>
                </div>

                {/* Barcode & Button */}
                <div className="flex items-center justify-between pt-2">
                  <Barcode value="FLX8829JPR" subtext="INDIAN PARCEL SEAL" height={36} />
                  <Link
                    to="/track?id=FLX-8829-JPR"
                    className="btn-industrial bg-asphalt text-paper hover:bg-orange text-xs px-3.5 py-2.5 border border-asphalt stamp-sm min-h-[44px] flex items-center gap-1.5"
                  >
                    <span>{lang === 'hi' ? 'लाइव देखें' : 'TRACK LIVE'}</span>
                    <IndustrialIcon name="arrow-right" size={12} />
                  </Link>
                </div>
              </div>

              {/* Floating secondary badge */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-yellow border-[2px] border-asphalt p-3 stamp-sm z-20 max-w-[220px]">
                <div className="font-heading font-black text-xs uppercase tracking-wide text-asphalt flex items-center gap-1.5">
                  <IndustrialIcon name="shield" size={14} />
                  <span>{lang === 'hi' ? '100% सुरक्षित' : 'SAFE DELIVERY'}</span>
                </div>
                <div className="font-body text-[11px] text-asphalt mt-1 font-medium leading-tight">
                  {lang === 'hi' ? 'सुरक्षित पैकिंग और डिलीवरी पर फोटो रसीद।' : 'Doorstep collection and digital photo proof.'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS: 4 SIMPLE STEPS */}
      <section className="py-14 bg-[#ECE6DA] border-b-[2px] border-asphalt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-asphalt">
            <div>
              <div className="font-heading font-black text-xs text-orange tracking-widest uppercase mb-1">
                {t('how.badge')}
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase text-asphalt">
                {t('how.title')}
              </h2>
            </div>
            <div className="font-mono text-xs text-steel mt-2 md:mt-0 font-bold">
              {t('how.sub')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-chalk border-[1.5px] border-asphalt p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-asphalt text-paper px-2 py-0.5 font-bold font-mono text-xs w-fit mb-3">
                  {lang === 'hi' ? 'पहला कदम' : 'STEP 01'}
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-2">
                  {t('how.step1Title')}
                </h3>
                <p className="font-body text-xs text-asphalt leading-relaxed">
                  {t('how.step1Desc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-steel-border font-mono text-[10px] text-steel">
                {lang === 'hi' ? 'समय: केवल 2 मिनट' : 'TIME: 2 MINUTES'}
              </div>
            </div>

            <div className="bg-chalk border-[1.5px] border-asphalt p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-asphalt text-paper px-2 py-0.5 font-bold font-mono text-xs w-fit mb-3">
                  {lang === 'hi' ? 'दूसरा कदम' : 'STEP 02'}
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-2">
                  {t('how.step2Title')}
                </h3>
                <p className="font-body text-xs text-asphalt leading-relaxed">
                  {t('how.step2Desc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-steel-border font-mono text-[10px] text-steel">
                {lang === 'hi' ? 'उसी दिन घर से पिकअप' : 'SAME DAY PICKUP'}
              </div>
            </div>

            <div className="bg-chalk border-[1.5px] border-asphalt p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-orange text-white px-2 py-0.5 font-bold font-mono text-xs w-fit mb-3">
                  {lang === 'hi' ? 'तीसरा कदम' : 'STEP 03'}
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-2">
                  {t('how.step3Title')}
                </h3>
                <p className="font-body text-xs text-asphalt leading-relaxed">
                  {t('how.step3Desc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-steel-border font-mono text-[10px] text-orange font-bold">
                {lang === 'hi' ? 'लाइव जीपीएस ट्रैकिंग' : 'LIVE VEHICLE TRACKING'}
              </div>
            </div>

            <div className="bg-chalk border-[1.5px] border-asphalt p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-teal text-white px-2 py-0.5 font-bold font-mono text-xs w-fit mb-3">
                  {lang === 'hi' ? 'चौथा कदम' : 'STEP 04'}
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-2">
                  {t('how.step4Title')}
                </h3>
                <p className="font-body text-xs text-asphalt leading-relaxed">
                  {t('how.step4Desc')}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-steel-border font-mono text-[10px] text-teal font-bold">
                {lang === 'hi' ? 'सफलतापूर्वक डिलीवरी' : 'SAFE DELIVERY COMPLETE'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SPECIFICATION */}
      <section className="py-14 bg-paper border-b-[2px] border-asphalt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 pb-4 border-b border-asphalt flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="font-heading font-black text-xs text-teal tracking-widest uppercase mb-1">
                {t('services.badge')}
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase text-asphalt">
                {t('services.title')}
              </h2>
            </div>
            <Link
              to="/create"
              className="btn-industrial bg-asphalt text-paper hover:bg-orange text-xs px-4 py-2.5 border border-asphalt stamp-sm flex items-center gap-1.5 min-h-[44px]"
            >
              <IndustrialIcon name="plus" size={14} />
              <span>{t('nav.bookNow')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-[1.5px] border-asphalt bg-chalk p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-asphalt text-paper p-2 border border-asphalt w-fit stamp-sm mb-4">
                  <IndustrialIcon name="box" size={24} />
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-1">
                  {t('services.s1Title')}
                </h3>
                <div className="font-mono text-[11px] text-steel mb-3 font-semibold">
                  {t('services.s1Sub')}
                </div>
                <p className="font-body text-xs text-asphalt leading-relaxed mb-4">
                  {t('services.s1Desc')}
                </p>
              </div>
              <div className="border-t border-steel-border pt-3 font-mono text-xs font-bold text-teal">
                {t('services.s1Transit')}
              </div>
            </div>

            <div className="border-[1.5px] border-asphalt bg-chalk p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-asphalt text-paper p-2 border border-asphalt w-fit stamp-sm mb-4">
                  <IndustrialIcon name="weight" size={24} />
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-1">
                  {t('services.s2Title')}
                </h3>
                <div className="font-mono text-[11px] text-steel mb-3 font-semibold">
                  {t('services.s2Sub')}
                </div>
                <p className="font-body text-xs text-asphalt leading-relaxed mb-4">
                  {t('services.s2Desc')}
                </p>
              </div>
              <div className="border-t border-steel-border pt-3 font-mono text-xs font-bold text-teal">
                {t('services.s2Transit')}
              </div>
            </div>

            <div className="border-[1.5px] border-asphalt bg-chalk p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-asphalt text-paper p-2 border border-asphalt w-fit stamp-sm mb-4">
                  <IndustrialIcon name="thermometer" size={24} />
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-1">
                  {t('services.s3Title')}
                </h3>
                <div className="font-mono text-[11px] text-steel mb-3 font-semibold">
                  {t('services.s3Sub')}
                </div>
                <p className="font-body text-xs text-asphalt leading-relaxed mb-4">
                  {t('services.s3Desc')}
                </p>
              </div>
              <div className="border-t border-steel-border pt-3 font-mono text-xs font-bold text-teal">
                {t('services.s3Transit')}
              </div>
            </div>

            <div className="border-[1.5px] border-asphalt bg-chalk p-5 stamp flex flex-col justify-between">
              <div>
                <div className="bg-asphalt text-paper p-2 border border-asphalt w-fit stamp-sm mb-4">
                  <IndustrialIcon name="truck" size={24} />
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-asphalt mb-1">
                  {t('services.s4Title')}
                </h3>
                <div className="font-mono text-[11px] text-steel mb-3 font-semibold">
                  {t('services.s4Sub')}
                </div>
                <p className="font-body text-xs text-asphalt leading-relaxed mb-4">
                  {t('services.s4Desc')}
                </p>
              </div>
              <div className="border-t border-steel-border pt-3 font-mono text-xs font-bold text-teal">
                {t('services.s4Transit')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SCHEDULE IN INDIAN RUPEES */}
      <section className="py-14 bg-[#F6F2EA] border-b-[2px] border-asphalt" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 pb-4 border-b border-asphalt flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="font-heading font-black text-xs text-orange tracking-widest uppercase mb-1">
                {t('pricing.badge')}
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase text-asphalt">
                {t('pricing.title')}
              </h2>
            </div>
            <div className="font-mono text-xs text-steel mt-2 md:mt-0 font-bold">
              {t('pricing.sub')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Tier 1 */}
            <div className="border-[1.5px] border-asphalt bg-chalk p-6 stamp flex flex-col justify-between">
              <div>
                <div className="font-heading font-black text-xs uppercase text-steel tracking-wider mb-2">
                  {t('pricing.p1Weight')}
                </div>
                <h3 className="font-heading font-black text-2xl uppercase text-asphalt mb-1">
                  {t('pricing.p1Name')}
                </h3>
                <div className="font-mono text-3xl font-extrabold text-asphalt my-4">
                  {t('pricing.p1Price')} <span className="text-xs text-steel font-normal">/ {t('pricing.p1Unit')}</span>
                </div>
                <p className="font-body text-xs text-asphalt leading-relaxed mb-6">
                  {t('pricing.p1Desc')}
                </p>
                <ul className="space-y-2 text-xs font-mono text-asphalt mb-8">
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'घर/दुकान से मुफ्त पिकअप' : 'Free Doorstep Collection'}
                  </li>
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'व्हाट्सएप पर लोकेशन लिंक' : 'Live Tracking on WhatsApp'}
                  </li>
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'कैश ऑन डिलीवरी (COD) उपलब्ध' : 'Cash on Delivery Available'}
                  </li>
                </ul>
              </div>
              <Link
                to="/create"
                className="btn-industrial bg-paper text-asphalt text-xs px-4 py-3 border-[1.5px] border-asphalt text-center hover:bg-chalk stamp-sm min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>{lang === 'hi' ? 'छोटा पार्सल भेजें' : 'SEND SMALL PARCEL'}</span>
                <IndustrialIcon name="arrow-right" size={12} />
              </Link>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="border-[2px] border-asphalt bg-paper p-6 stamp-lg relative flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-orange text-white font-heading font-black text-[10px] tracking-widest uppercase px-3 py-1 border-b border-l border-asphalt">
                {lang === 'hi' ? 'व्यापारियों की पहली पसंद' : 'MOST POPULAR FOR TRADERS'}
              </div>

              <div>
                <div className="font-heading font-black text-xs uppercase text-orange tracking-wider mb-2">
                  {t('pricing.p2Weight')}
                </div>
                <h3 className="font-heading font-black text-2xl uppercase text-asphalt mb-1">
                  {t('pricing.p2Name')}
                </h3>
                <div className="font-mono text-3xl font-extrabold text-orange my-4">
                  {t('pricing.p2Price')} <span className="text-xs text-steel font-normal">/ {t('pricing.p2Unit')}</span>
                </div>
                <p className="font-body text-xs text-asphalt leading-relaxed mb-6">
                  {t('pricing.p2Desc')}
                </p>
                <ul className="space-y-2 text-xs font-mono text-asphalt mb-8">
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'पक्की जीएसटी बिलती रसीद' : 'Official GST Bilty Receipt'}
                  </li>
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'अगले दिन पक्की डिलीवरी' : 'Guaranteed Next Day Delivery'}
                  </li>
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'सामान का पूरा बीमा' : 'Transit Insurance Included'}
                  </li>
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'समर्पित फोन सहायक' : 'Dedicated Support Agent'}
                  </li>
                </ul>
              </div>
              <Link
                to="/create"
                className="btn-industrial bg-orange text-white text-xs px-4 py-3 border-[1.5px] border-asphalt text-center hover:bg-orange-hover stamp-sm min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>{lang === 'hi' ? 'व्यापारी पार्सल बुक करें' : 'BOOK TRADE PARCEL'}</span>
                <IndustrialIcon name="arrow-right" size={12} />
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="border-[1.5px] border-asphalt bg-chalk p-6 stamp flex flex-col justify-between">
              <div>
                <div className="font-heading font-black text-xs uppercase text-steel tracking-wider mb-2">
                  {t('pricing.p3Weight')}
                </div>
                <h3 className="font-heading font-black text-2xl uppercase text-asphalt mb-1">
                  {t('pricing.p3Name')}
                </h3>
                <div className="font-mono text-3xl font-extrabold text-asphalt my-4">
                  {t('pricing.p3Price')} <span className="text-xs text-steel font-normal">/ {t('pricing.p3Unit')}</span>
                </div>
                <p className="font-body text-xs text-asphalt leading-relaxed mb-6">
                  {t('pricing.p3Desc')}
                </p>
                <ul className="space-y-2 text-xs font-mono text-asphalt mb-8">
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'पूरी गाड़ी सीधे आपके गोदाम' : 'Dedicated Vehicle Direct To Door'}
                  </li>
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'बीच में कोई सामान नहीं बदलेगा' : 'Zero Transhipment (Direct Point)'}
                  </li>
                  <li className="flex items-center gap-2">
                    <IndustrialIcon name="check" size={14} className="text-teal" /> {lang === 'hi' ? 'लोडिंग और अनलोडिंग सहायता' : 'Loading Support Available'}
                  </li>
                </ul>
              </div>
              <a
                href="#contact"
                className="btn-industrial bg-asphalt text-paper text-xs px-4 py-3 border-[1.5px] border-asphalt text-center hover:bg-asphalt-soft stamp-sm min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>{lang === 'hi' ? 'गाड़ी का किराया पूछें' : 'GET TRUCK RATE'}</span>
                <IndustrialIcon name="phone" size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT & INQUIRY FORM */}
      <section className="py-14 bg-paper" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Direct Phone / WhatsApp */}
            <div className="lg:col-span-5 space-y-6">
              <div className="font-heading font-black text-xs text-orange tracking-widest uppercase">
                {t('contact.badge')}
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase text-asphalt leading-none">
                {t('contact.title')}
              </h2>
              <p className="font-body text-sm text-asphalt leading-relaxed font-medium">
                {t('contact.sub')}
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 border border-asphalt bg-chalk stamp-sm">
                  <div className="text-[11px] text-steel uppercase font-heading font-bold">
                    {t('contact.callUs')}
                  </div>
                  <div className="text-asphalt font-bold text-base mt-0.5">
                    {t('contact.phone')}
                  </div>
                  <div className="text-steel text-[11px] mt-1">
                    {lang === 'hi' ? 'सुबह 8:00 से रात 9:00 बजे तक चालू' : 'Active 8:00 AM to 9:00 PM (Daily)'}
                  </div>
                </div>

                <div className="p-4 border border-asphalt bg-chalk stamp-sm">
                  <div className="text-[11px] text-steel uppercase font-heading font-bold">
                    {lang === 'hi' ? 'व्हाट्सएप सहायता' : 'WHATSAPP ASSISTANCE'}
                  </div>
                  <div className="text-teal font-bold text-sm mt-0.5 flex items-center gap-2">
                    <IndustrialIcon name="phone" size={16} />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="text-steel text-[11px] mt-1">
                    {lang === 'hi' ? 'रसीद की फोटो भेजें, तुरंत जानकारी पाएं' : 'Send receipt photo to get instant location'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Simple Form */}
            <div className="lg:col-span-7">
              <div className="bg-chalk border-[2px] border-asphalt p-6 sm:p-8 stamp-lg">
                <div className="flex items-center justify-between border-b border-asphalt pb-3 mb-6">
                  <div>
                    <h3 className="font-heading font-black text-xl uppercase text-asphalt">
                      {t('contact.formTitle')}
                    </h3>
                    <div className="font-mono text-xs text-steel mt-0.5">
                      {t('contact.formSub')}
                    </div>
                  </div>
                  <span className="bg-yellow text-asphalt font-heading font-bold text-[10px] px-2 py-1 uppercase border border-asphalt shrink-0">
                    {lang === 'hi' ? '15 मिनट में जवाब' : 'CALL IN 15 MIN'}
                  </span>
                </div>

                {contactSubmitted ? (
                  <div className="bg-teal-soft border-[1.5px] border-teal p-6 text-center space-y-3">
                    <div className="w-10 h-10 bg-teal text-white flex items-center justify-center mx-auto rounded-[2px] stamp-sm">
                      <IndustrialIcon name="check" size={20} />
                    </div>
                    <div className="font-heading font-black text-2xl uppercase text-teal">
                      {lang === 'hi' ? 'अनुरोध प्राप्त हुआ // REF: INQ-9912' : 'REQUEST RECEIVED // REF: INQ-9912'}
                    </div>
                    <p className="font-body text-xs text-asphalt max-w-md mx-auto">
                      {t('contact.success')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="btn-industrial bg-asphalt text-paper text-xs px-4 py-2.5 border border-asphalt mt-3 hover:bg-orange min-h-[44px]"
                    >
                      {lang === 'hi' ? 'एक और पूछताछ भेजें' : 'SUBMIT ANOTHER INQUIRY'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 font-body text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-heading font-bold uppercase text-asphalt mb-1">
                          {t('contact.formName')}
                          <InfoTooltip text="Enter your full name so our manager knows who to call." />
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={lang === 'hi' ? 'जैसे: रमेश शर्मा' : 'E.G. RAMESH SHARMA'}
                          value={contactData.senderName}
                          onChange={(e) => setContactData({ ...contactData, senderName: e.target.value })}
                          className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-[2px] font-mono uppercase focus:outline-none focus:bg-white min-h-[44px]"
                        />
                        <span className="text-[10px] text-steel mt-0.5 block">
                          {lang === 'hi' ? 'उदाहरण: रमेश शर्मा' : 'Example: Ramesh Sharma'}
                        </span>
                      </div>
                      <div>
                        <label className="block font-heading font-bold uppercase text-asphalt mb-1">
                          {t('contact.formCompany')}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'hi' ? 'जैसे: शर्मा वस्त्र भंडार' : 'E.G. SHARMA TEXTILES'}
                          value={contactData.company}
                          onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                          className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-[2px] font-mono uppercase focus:outline-none focus:bg-white min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-heading font-bold uppercase text-asphalt mb-1">
                          {t('contact.formFrom')}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={lang === 'hi' ? 'जैसे: दिल्ली / चांदनी चौक' : 'E.G. DELHI / CHANDNI CHOWK'}
                          value={contactData.fromCity}
                          onChange={(e) => setContactData({ ...contactData, fromCity: e.target.value })}
                          className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-[2px] font-mono uppercase focus:outline-none focus:bg-white min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block font-heading font-bold uppercase text-asphalt mb-1">
                          {t('contact.formTo')}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={lang === 'hi' ? 'जैसे: जयपुर / जोहरी बाजार' : 'E.G. JAIPUR / JOHARI BAZAR'}
                          value={contactData.toCity}
                          onChange={(e) => setContactData({ ...contactData, toCity: e.target.value })}
                          className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-[2px] font-mono uppercase focus:outline-none focus:bg-white min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-heading font-bold uppercase text-asphalt mb-1">
                          {t('contact.formWeight')}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'hi' ? 'जैसे: 35 किलो या 2 कार्टन' : 'E.G. 35 KG OR 2 CARTONS'}
                          value={contactData.weightEst}
                          onChange={(e) => setContactData({ ...contactData, weightEst: e.target.value })}
                          className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-[2px] font-mono uppercase focus:outline-none focus:bg-white min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block font-heading font-bold uppercase text-asphalt mb-1">
                          {t('contact.formMobile')}
                          <InfoTooltip text="We will call this mobile number to confirm pickup." />
                        </label>
                        <div className="flex">
                          <span className="bg-[#EAE5D9] text-asphalt px-2.5 py-2.5 border-[1.5px] border-r-0 border-asphalt font-mono text-xs flex items-center font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="98110 44291"
                            value={contactData.mobile}
                            onChange={(e) => setContactData({ ...contactData, mobile: e.target.value.replace(/\D/g, '') })}
                            className="w-full bg-paper text-asphalt px-3 py-2.5 border-[1.5px] border-asphalt rounded-r-[2px] font-mono focus:outline-none focus:bg-white min-h-[44px]"
                          />
                        </div>
                        <span className="text-[10px] text-steel mt-0.5 block">
                          {lang === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-industrial bg-orange text-white text-sm px-6 py-3.5 border-[1.5px] border-asphalt stamp-sm hover:bg-orange-hover w-full flex items-center justify-center gap-2 mt-4 min-h-[48px]"
                    >
                      <IndustrialIcon name="phone" size={16} />
                      <span>{t('contact.formSubmit')}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
