import React from 'react';
import { Link } from 'react-router-dom';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { useTranslation } from '../context/LanguageContext';
import { useCustomerAuth } from '../context/useCustomerAuth';

export const AboutPage: React.FC = () => {
  const { lang } = useTranslation();
  const { customer } = useCustomerAuth();

  const regionalHubs = [
    {
      code: 'DEL',
      city: lang === 'hi' ? 'दिल्ली' : 'Delhi',
      name: lang === 'hi' ? 'दिल्ली सेंट्रल सॉर्टिंग हब' : 'Delhi Central Sorting Hub',
      location: 'Okhla Industrial Area / Chandni Chowk Feeder',
      role: lang === 'hi' ? 'उत्तरी भारत का प्रमुख वितरण केंद्र' : 'Northern Regional Gateway & Consolidation Node',
      features: ['24/7 Sorting Terminal', 'Cross-Dock Facility', 'Daily Express Departures'],
      corridors: 'Delhi ➔ Jaipur, Delhi ➔ Mumbai, Delhi ➔ Kolkata',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      code: 'JPR',
      city: lang === 'hi' ? 'जयपुर' : 'Jaipur',
      name: lang === 'hi' ? 'जयपुर डिलीवरी सेंटर' : 'Jaipur Delivery Centre',
      location: 'VKI Industrial Area / Johari Bazar Market',
      role: lang === 'hi' ? 'राजस्थान व्यापार एवं वितरण केंद्र' : 'Rajasthan Commercial & Trade Dispatch Hub',
      features: ['Next-Day Delhi Line', 'Artisan & Gem Cargo Desk', 'Doorstep Express Fleet'],
      corridors: 'Jaipur ➔ Delhi, Jaipur ➔ Ahmedabad, Jaipur ➔ Indore',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      code: 'SUR',
      city: lang === 'hi' ? 'सूरत' : 'Surat',
      name: lang === 'hi' ? 'सूरत टेक्सटाइल कार्गो हब' : 'Surat Textile Cargo Hub',
      location: 'Ring Road Market / Udhna Industrial Area',
      role: lang === 'hi' ? 'कपड़ा एवं थोक व्यापार विशेष केंद्र' : 'Dedicated Apparel & Textile Cargo Terminal',
      features: ['Textile Baling Facility', 'Overnight Mumbai Shuttle', 'Moisture-Protected Storage'],
      corridors: 'Surat ➔ Mumbai, Surat ➔ Delhi, Surat ➔ Hyderabad',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      code: 'BOM',
      city: lang === 'hi' ? 'मुंबई' : 'Mumbai',
      name: lang === 'hi' ? 'मुंबई सेंट्रल गोडाउन' : 'Mumbai Central Godown',
      location: 'Bhiwandi Logistics Park / Crawford Feeder',
      role: lang === 'hi' ? 'पश्चिमी तटीय वाणिज्यिक हब' : 'Western Seaboard Commercial Terminal',
      features: ['High-Capacity CFS', 'Intermodal Container Yard', 'South-Bound Transit Links'],
      corridors: 'Mumbai ➔ Surat, Mumbai ➔ Bengaluru, Mumbai ➔ Pune',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      code: 'BLR',
      city: lang === 'hi' ? 'बेंगलुरु' : 'Bengaluru',
      name: lang === 'hi' ? 'बेंगलुरु साउथ टर्मिनल' : 'Bengaluru South Terminal',
      location: 'Peenya Industrial Estate / Electronic City Feeder',
      role: lang === 'hi' ? 'दक्षिण भारत वितरण केंद्र' : 'Southern Precision & High-Tech Logistics Hub',
      features: ['Secure Tech Vaults', 'Same-Day Chennai Corridor', 'Climate-Monitored Bays'],
      corridors: 'Bengaluru ➔ Chennai, Bengaluru ➔ Mumbai, Bengaluru ➔ Hyderabad',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      code: 'KOL',
      city: lang === 'hi' ? 'कोलकाता' : 'Kolkata',
      name: lang === 'hi' ? 'कोलकाता ईस्टर्न गेटवे' : 'Kolkata Eastern Gateway',
      location: 'Dankuni Freight Complex / Burrabazar Commercial',
      role: lang === 'hi' ? 'पूर्वी भारत व्यापार केंद्र' : 'Eastern India Commercial & Multi-Modal Terminal',
      features: ['Rail Freight Siding', 'Bulk Goods Warehousing', 'Northeast Feeder Links'],
      corridors: 'Kolkata ➔ Delhi, Kolkata ➔ Ludhiana, Kolkata ➔ Patna',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const services = [
    {
      icon: 'box' as const,
      title: lang === 'hi' ? 'एक्सप्रेस पार्सल व कुरियर' : 'Express Parcel & LTL Freight',
      desc: lang === 'hi'
        ? 'दुकानदारों, व्यापारियों और ग्राहकों के लिए 1 से 50 किलो के कार्टन की सुरक्षित डोरस्टेप डिलीवरी।'
        : 'Scheduled door-to-door parcel delivery for cartons and packages from 1 kg to 500 kg with real-time barcode telemetry.',
      highlight: lang === 'hi' ? 'घर-घर पिकअप व डिलीवरी' : 'Doorstep Pickup & Delivery'
    },
    {
      icon: 'truck' as const,
      title: lang === 'hi' ? 'फुल ट्रक लोड (FTL) परिवहन' : 'Full Truckload (FTL) Line-Haul',
      desc: lang === 'hi'
        ? 'टाटा 407, आयशर और भारी कंटेनर ट्रकों द्वारा सीधे फैक्ट्री से गोदाम तक बिना किसी रुकावट के माल ढुलाई।'
        : 'Dedicated point-to-point fleet vehicles for commercial consignments, machinery, and factory distribution without mid-route transfers.',
      highlight: lang === 'hi' ? 'समर्पित वाहन, सीधा मार्ग' : 'Direct Gate-to-Godown Route'
    },
    {
      icon: 'train' as const,
      title: lang === 'hi' ? 'मल्टीमॉडल रेल व सड़क नेटवर्क' : 'Multimodal Freight Coordination',
      desc: lang === 'hi'
        ? 'राजमार्ग और समर्पित मालगाड़ी कॉरिडोर का समन्वय जिससे भारी सामान किफायती और समय पर पहुंचता है।'
        : 'Synchronized coordination of expressways and dedicated rail freight corridors for heavy industrial cargo across interstate distances.',
      highlight: lang === 'hi' ? 'किफायती लंबी दूरी परिवहन' : 'Cost-Effective Long Hauls'
    },
    {
      icon: 'file' as const,
      title: lang === 'hi' ? 'डिजिटल बिल्टी व पारदर्शी दरें' : 'Digital Bilty (e-LR) & Invoicing',
      desc: lang === 'hi'
        ? 'प्रत्येक खेप के लिए जीएसटी-मान्य इलेक्ट्रॉनिक बिल्टी, वजन के अनुसार स्पष्ट दरें और जीरो गुप्त शुल्क।'
        : 'Instant GST-compliant electronic Lorry Receipts (e-LR), transparent weight-based freight brackets, and zero hidden charges.',
      highlight: lang === 'hi' ? '100% जीएसटी व ई-वे बिल अनुपालन' : 'Full Regulatory GTA Compliance'
    },
    {
      icon: 'shield' as const,
      title: lang === 'hi' ? 'ओटीपी सुरक्षा व डिजिटल पावती' : 'Secure OTP Delivery Verification',
      desc: lang === 'hi'
        ? 'प्राप्तकर्ता के मोबाइल पर ओटीपी सत्यापन और डिलीवरी के समय फोटो प्रूफ द्वारा पूर्ण सुरक्षा सुनिश्चित।'
        : 'Consignments are handed over only upon 4-digit OTP verification and recipient signature with verifiable digital photo proof.',
      highlight: lang === 'hi' ? 'सत्यापित प्राप्तकर्ता सुपुर्दगी' : 'Zero-Tamper Handover'
    },
    {
      icon: 'phone' as const,
      title: lang === 'hi' ? 'व्हाट्सएप व क्षेत्रीय सहायता डेस्क' : 'Regional Dispatch & Helpline',
      desc: lang === 'hi'
        ? 'प्रत्येक रूट पर समर्पित ऑपरेशंस स्टाफ और लाइव व्हाट्सएप अपडेट (+91 6303766064) की सुविधा।'
        : 'Dedicated dispatch coordinators monitoring corridor telemetry with instant WhatsApp tracking alerts on +91 6303766064.',
      highlight: lang === 'hi' ? 'सक्रिय ग्राहक सहायता' : 'Active Route Assistance'
    }
  ];

  const reasons = [
    {
      number: '01',
      title: lang === 'hi' ? 'पारदर्शी और निश्चित मूल्य' : 'Transparent, Predetermined Rates',
      desc: lang === 'hi'
        ? 'कोई छिपा हुआ चार्ज नहीं। वजन, दूरी और सेवा प्रकार के आधार पर पूर्व-निर्धारित स्पष्ट दर तालिका।'
        : 'No surprise demurrage or arbitrary handling fees. Rate matrices are calculated upfront by chargeable weight and corridor distance.'
    },
    {
      number: '02',
      title: lang === 'hi' ? 'चेकपॉइंट बारकोड ट्रैकिंग' : 'Milestone Checkpoint Tracking',
      desc: lang === 'hi'
        ? 'बुकिंग से लेकर डिलीवरी तक प्रत्येक स्टेशन पर बारकोड स्कैनिंग और वास्तविक समय स्थिति अपडेट।'
        : 'Every parcel is scanned at dispatch, transit terminals, and regional cross-docks, eliminating blind spots on highways.'
    },
    {
      number: '03',
      title: lang === 'hi' ? '6 प्रमुख राज्यों का संगठित ग्रिड' : 'Synchronized Regional Hub Grid',
      desc: lang === 'hi'
        ? 'दिल्ली, जयपुर, सूरत, मुंबई, बेंगलुरु और कोलकाता के बीच दैनिक नियमित गाड़ियां।'
        : 'Established daily line-haul departures between our 6 strategic consolidation hubs across major commercial arteries.'
    },
    {
      number: '04',
      title: lang === 'hi' ? 'ग्राहक सेल्फ-सर्विस पोर्टल' : 'Modern Customer Self-Service',
      desc: lang === 'hi'
        ? 'वेबसाइट से तुरंत पार्सल बुकिंग, पता सहेजना, रसीद प्रिंट करना और पूरी हिस्ट्री देखना।'
        : 'Comprehensive self-service customer portal for booking consignments, managing addresses, tracking, and downloading bilty receipts.'
    },
    {
      number: '05',
      title: lang === 'hi' ? 'सुरक्षित कैश ऑन डिलीवरी (COD)' : 'Dependable COD Management',
      desc: lang === 'hi'
        ? 'व्यापारियों के लिए सुरक्षित कैश ऑन डिलीवरी और ऑनलाइन यूपीआई से तुरंत भुगतान की सुविधा।'
        : 'Seamless cash on delivery collection with instant digital reconciliation and online UPI payment verification.'
    },
    {
      number: '06',
      title: lang === 'hi' ? 'कठोर वितरण सुरक्षा' : 'Strict Handover Integrity',
      desc: lang === 'hi'
        ? 'सुरक्षा सील नंबर और ओटीपी प्रमाणीकरण के बिना कोई पार्सल नहीं खोला या दिया जाता।'
        : 'Cargo is protected with tamper-evident seal numbers and delivered strictly against one-time authentication codes.'
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* 1. HERO & BREADCRUMB HEADER */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100/80 border-b border-slate-200 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              {lang === 'hi' ? 'होम' : 'Home'}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-orange-600 font-semibold">
              {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (Hero Content) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span>{lang === 'hi' ? 'विश्वसनीय माल परिवहन एवं पार्सल नेटवर्क' : 'Reliable Surface & Express Freight Network'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {lang === 'hi'
                  ? 'व्यापार और उद्योगों के लिए अनुशासित माल ढुलाई'
                  : 'Structured Freight Logistics Built for Indian Trade'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {lang === 'hi'
                  ? 'VELTRAX (वेलट्रैक्स — मीलों से आगे) एक आधुनिक तकनीक-संचालित माल परिवहन और पार्सल प्रबंधन प्रणाली है, जो भारत के प्रमुख व्यापारिक शहरों को पारदर्शी दरों, डिजिटल रसीदों और वास्तविक समय ट्रैकिंग के साथ जोड़ती है।'
                  : 'VELTRAX (Moving Beyond Miles) is a technology-driven logistics management platform connecting traders, manufacturers, MSMEs, and consumers across major commercial corridors with disciplined scheduling, verifiable e-LR documentation, and milestone checkpoint transparency.'}
              </p>

              {/* Quick Key Metrics Strip */}
              <div className="pt-2 grid grid-cols-3 gap-3 max-w-lg">
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">6</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'hi' ? 'सक्रिय क्षेत्रीय हब' : 'Regional Hubs'}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-orange-600">100%</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'hi' ? 'जीएसटी पक्की रसीद' : 'GST e-LR Bilty'}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600">OTP</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'hi' ? 'सत्यापित डिलीवरी' : 'Verified Delivery'}
                  </div>
                </div>
              </div>

              {/* Quick CTAs */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to={customer ? '/account/book' : '/create'}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl shadow-sm shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <IndustrialIcon name="plus" size={16} />
                  <span>{lang === 'hi' ? 'पार्सल बुक करें' : 'Book a Consignment'}</span>
                </Link>

                <Link
                  to="/track"
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-2"
                >
                  <IndustrialIcon name="search" size={16} />
                  <span>{lang === 'hi' ? 'पार्सल ट्रैक करें' : 'Track by Shipment ID'}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Brand Card */}
            <div className="lg:col-span-5">
              <div className="bg-navy-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-navy-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center gap-3 pb-5 border-b border-navy-800">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                    V
                  </div>
                  <div>
                    <div className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                      VELTRAX LOGISTICS
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block"></span>
                    </div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                      {lang === 'hi' ? 'भारतीय माल परिवहन मानक' : 'National Freight Standard'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 py-5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="text-orange-400 mt-0.5 font-bold">✓</span>
                    <div>
                      <strong className="text-white block">
                        {lang === 'hi' ? 'विश्वसनीय व्यापारिक रूट' : 'Core Trade Arteries'}
                      </strong>
                      <span className="text-slate-400">
                        {lang === 'hi'
                          ? 'दिल्ली, राजस्थान, गुजरात, महाराष्ट्र, कर्नाटक और पश्चिम बंगाल के बीच दैनिक लाइन-हॉल सेवाएं।'
                          : 'Daily scheduled departures linking Delhi, Rajasthan, Gujarat, Maharashtra, Karnataka, and Bengal.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                    <div>
                      <strong className="text-white block">
                        {lang === 'hi' ? 'डिजिटल पार्सल सुरक्षा' : 'Digital Cargo Protection'}
                      </strong>
                      <span className="text-slate-400">
                        {lang === 'hi'
                          ? 'सुरक्षा सील नंबर, बारकोड सत्यापन और केवल सत्यापित प्राप्तकर्ता को ओटीपी हैंडओवर।'
                          : 'Tamper-evident seal numbers, barcode telemetry at every terminal, and OTP-gated doorstep release.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-sky-400 mt-0.5 font-bold">✓</span>
                    <div>
                      <strong className="text-white block">
                        {lang === 'hi' ? 'मल्टीमॉडल समन्वय' : 'Multimodal Coordination'}
                      </strong>
                      <span className="text-slate-400">
                        {lang === 'hi'
                          ? 'राजमार्ग ट्रकों और मालगाड़ी कंटेनर कॉरिडोर का निर्बाध संयोजन।'
                          : 'Synchronized road transport, dedicated container rakes, and regional last-mile feeder fleet.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Pan-India Network</span>
                  <span className="text-orange-400">Operational Daily</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MISSION & VISION SECTION */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 block mb-1">
              {lang === 'hi' ? 'हमारा उद्देश्य और दृष्टि' : 'Purpose & Long-Term Direction'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === 'hi'
                ? 'भारतीय लॉजिस्टिक्स में अनुशासन और पारदर्शिता'
                : 'Mission & Vision for Indian Logistics'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                <IndustrialIcon name="compass" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {lang === 'hi' ? 'हमारा मिशन (Our Mission)' : 'Our Mission'}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {lang === 'hi'
                  ? 'पारंपरिक और असंगठित माल परिवहन व्यवस्था को बदलकर एक पारदर्शी, समयबद्ध और तकनीकी रूप से सशक्त लॉजिस्टिक्स नेटवर्क प्रदान करना। हर व्यापारी, किसान और छोटे व्यवसाय को विश्वसनीय दरों, कानूनी बिल्टी और वास्तविक समय ट्रैकिंग की सुविधा देना ताकि उनका सामान सुरक्षित और सही समय पर पहुंचे।'
                  : 'To transform conventional, fragmented freight handling into a dependable, disciplined, and technologically transparent logistics ecosystem. We empower Indian traders, manufacturers, and small businesses with fair weight-based pricing, verifiable legal bilty documentation, and real-time checkpoint updates to make intercity freight seamless and worry-free.'}
              </p>
              <div className="mt-6 pt-5 border-t border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>{lang === 'hi' ? 'पारदर्शिता • सुरक्षा • समयबद्धता' : 'Transparency • Security • Punctuality'}</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <IndustrialIcon name="gauge" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {lang === 'hi' ? 'हमारा विजन (Our Vision)' : 'Our Vision'}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {lang === 'hi'
                  ? 'भारत का सबसे भरोसेमंद मल्टीमॉडल एक्सप्रेस लॉजिस्टिक्स नेटवर्क बनना—जहाँ सड़क, रेल और हवाई परिवहन का ऐसा सुंदर समन्वय हो कि बड़े शहरों से लेकर दूरदराज की मंडियों तक हर पार्सल 24 से 48 घंटे में सुरक्षित पहुंचे, और हर ग्राहक को अपनी खेप की स्थिति पर पूरा भरोसा हो।'
                  : 'To establish India’s most trusted multimodal express surface grid—unifying expressways, dedicated freight rail lines, and regional consolidation nodes into a single resilient network where freight flows swiftly, every handover is authenticated, and commerce between industrial clusters thrives with complete visibility.'}
              </p>
              <div className="mt-6 pt-5 border-t border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>{lang === 'hi' ? 'मल्टीमॉडल कनेक्टिविटी • आधुनिक भारत' : 'Multimodal Connectivity • Future-Ready Freight'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPREHENSIVE LOGISTICS SERVICES */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 block mb-1">
              {lang === 'hi' ? 'हमारी सेवाएं' : 'End-to-End Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === 'hi'
                ? 'प्रत्येक प्रकार के माल के लिए विशेष परिवहन सेवाएं'
                : 'VELTRAX Logistics Services'}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {lang === 'hi'
                ? 'दुकानदारों के छोटे पार्सल से लेकर कारखानों के भारी लोड तक, हमारे पास हर जरूरत का समाधान है।'
                : 'From retail shop cartons to heavy manufacturing equipment, our services are calibrated for reliability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center mb-4">
                    <IndustrialIcon name={svc.icon} size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-orange-600">{svc.highlight}</span>
                  <span className="text-slate-400 font-mono text-[11px]">0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REGIONAL HUB NETWORK */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 block mb-1">
              {lang === 'hi' ? 'हमारा नेटवर्क' : 'Station Grid & Corridors'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === 'hi'
                ? '6 प्रमुख क्षेत्रीय स्टेशन व पार्सल केंद्र'
                : '6 Key Regional Logistics Hubs'}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {lang === 'hi'
                ? 'भारत के प्रमुख औद्योगिक और व्यापारिक शहरों में स्थित हमारे आधुनिक सॉर्टिंग केंद्र।'
                : 'Strategically located sorting and distribution terminals serving active commercial corridors.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalHubs.map((hub) => (
              <div
                key={hub.code}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg shadow-2xs">
                      {hub.code}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${hub.badgeColor}`}>
                      {hub.city}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {hub.name}
                  </h3>
                  <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5 font-medium">
                    <IndustrialIcon name="pin" size={13} className="text-orange-500 shrink-0" />
                    <span className="truncate">{hub.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {hub.role}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-200/70">
                    {hub.features.map((feat, i) => (
                      <div key={i} className="text-[11px] text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                  <span className="text-slate-400 block uppercase text-[10px] font-semibold font-sans">
                    {lang === 'hi' ? 'कनेक्टिंग कॉरिडोर:' : 'Express Connections:'}
                  </span>
                  <span className="text-slate-800 font-semibold">{hub.corridors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MULTIMODAL TRANSPORTATION CAPABILITIES */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 block mb-1">
              {lang === 'hi' ? 'वाहन एवं साधन' : 'Fleet & Multi-Modal Infrastructure'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {lang === 'hi'
                ? 'मल्टीमॉडल परिवहन एवं फ्लीट क्षमता'
                : 'Multimodal Transportation Capabilities'}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {lang === 'hi'
                ? 'सड़क, रेल और फीडर वाहनों का समन्वित तंत्र जो आपकी खेप को समय पर पहुंचाता है।'
                : 'Engineered fleet mix combining heavy line-haul, rail rakes, and agile urban feeder vans.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <IndustrialIcon name="truck" size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'hi' ? 'जीपीएस-सक्षम हाईवे ट्रक्स' : 'GPS-Tracked Highway Fleet'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'टाटा सिग्ना और आयशर मल्टी-एक्सल कंटेनर ट्रक, जो 24/7 टेलीमैटिक्स और स्पीड मॉनिटरिंग से लैस हैं।'
                  : 'Tata Signa & Eicher multi-axle closed containerized trucks equipped with 24/7 onboard GPS tracking.'}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] font-mono text-orange-400">
                Road Line-Haul
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <IndustrialIcon name="train" size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'hi' ? 'समर्पित रेल फ्रेट लिंक' : 'Dedicated Rail Corridors'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'भारी और थोक माल के लिए भारतीय रेल फ्रेट कॉरिडोर से सीधा समन्वय, जो मौसम की बाधाओं से मुक्त है।'
                  : 'Direct container rake allocations on Indian Railways freight corridors ensuring weather-independent transit.'}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] font-mono text-blue-400">
                Intermodal Rail
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <IndustrialIcon name="plane" size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'hi' ? 'एयर कार्गो एक्सप्रेस' : 'Air Cargo Priority'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'अति-महत्वपूर्ण नमूनों, दवाओं और दस्तावेजों के लिए प्रमुख हवाई अड्डों के बीच अगले दिन की सेवा।'
                  : 'Expedited next-morning connectivity between Tier-1 metro airports for emergency consignments and samples.'}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] font-mono text-emerald-400">
                Air Freight Link
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <IndustrialIcon name="container" size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {lang === 'hi' ? 'लोकल फीडर व डिलीवरी वैन' : 'Urban Feeder Vans'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? 'व्यस्त मंडियों और तंग बाजारों में आसानी से पहुंचने वाले छोटे वाहन और डोरस्टेप डिलीवरी वैन।'
                  : 'Agile delivery vans navigating commercial markets and industrial areas for punctual pickup and delivery.'}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] font-mono text-purple-400">
                Last-Mile Fleet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REASONS TO CHOOSE VELTRAX */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 block mb-1">
              {lang === 'hi' ? 'हमारे फायदे' : 'The VELTRAX Difference'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === 'hi'
                ? 'व्यापारी और उद्योग हमें क्यों चुनते हैं?'
                : 'Why Businesses Choose VELTRAX'}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {lang === 'hi'
                ? 'पुरानी और असंगठित परिवहन व्यवस्था के मुकाबले आधुनिक, सुरक्षित और पेशेवर अनुभव।'
                : 'Engineered from the ground up for transparency, legal protection, and accountability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-lg font-bold text-orange-600">
                    {r.number}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM ACTION CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold backdrop-blur-xs">
            <IndustrialIcon name="shield" size={14} />
            <span>{lang === 'hi' ? 'विश्वसनीय पार्सल व माल परिवहन' : 'Verified Pan-India Freight Service'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'hi'
              ? 'क्या आप अपना पार्सल या माल भेजना चाहते हैं?'
              : 'Ready to Dispatch Your Freight or Parcel?'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'चाहे 10 किलो का कार्टन हो या पूरा ट्रक लोड, पारदर्शी दरों और पक्की बिल्टी के साथ आज ही ऑनलाइन बुक करें।'
              : 'Whether sending a single commercial carton or managing routine freight between branches, book online with immediate bilty confirmation.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={customer ? '/account/book' : '/create'}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <IndustrialIcon name="plus" size={16} />
              <span>{lang === 'hi' ? 'नया पार्सल बुक करें' : 'Book Shipment Online'}</span>
            </Link>

            <Link
              to="/track"
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <IndustrialIcon name="search" size={16} />
              <span>{lang === 'hi' ? 'पार्सल ट्रैक करें' : 'Track Active Consignment'}</span>
            </Link>

            <a
              href="https://wa.me/916303766064"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-xs"
              title="Chat on WhatsApp (+91 6303766064)"
            >
              <IndustrialIcon name="phone" size={16} />
              <span>WhatsApp (+91 6303766064)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
