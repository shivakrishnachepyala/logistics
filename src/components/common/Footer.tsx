import React from 'react';
import { Link } from 'react-router-dom';
import { IndustrialIcon } from './IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { lang } = useTranslation();

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 selection:bg-orange-500 selection:text-white">
      {/* Top Station Hubs Grid */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>{lang === 'hi' ? 'प्रमुख पार्सल केंद्र व स्टेशन नेटवर्क' : 'Active Regional Stations & Logistics Hubs'}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Pan-India Freight Corridors</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 hover:border-slate-600 transition-colors">
              <div className="text-sm font-semibold text-white">DELHI CENTRAL</div>
              <div className="text-xs text-slate-400 truncate mt-0.5">Okhla / Chandni Chowk</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                <span>●</span> 24/7 Operations
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 hover:border-slate-600 transition-colors">
              <div className="text-sm font-semibold text-white">JAIPUR MAIN</div>
              <div className="text-xs text-slate-400 truncate mt-0.5">VKI / Johari Bazar</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                <span>●</span> Daily Express Line
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 hover:border-slate-600 transition-colors">
              <div className="text-sm font-semibold text-white">SURAT TEXTILE</div>
              <div className="text-xs text-slate-400 truncate mt-0.5">Ring Road Market</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                <span>●</span> Textile Cargo Special
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 hover:border-slate-600 transition-colors">
              <div className="text-sm font-semibold text-white">MUMBAI TERMINAL</div>
              <div className="text-xs text-slate-400 truncate mt-0.5">Bhiwandi / Crawford</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                <span>●</span> Coastal Hub
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 hover:border-slate-600 transition-colors col-span-2 sm:col-span-1">
              <div className="text-sm font-semibold text-white">BENGALURU HUB</div>
              <div className="text-xs text-slate-400 truncate mt-0.5">Peenya Industrial Area</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                <span>●</span> South Line Terminal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <IndustrialIcon name="box" size={20} />
              </div>
              <span className="font-sans font-bold text-xl text-white tracking-tight">
                FREIGHTLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'hi'
                ? 'व्यापारियों, एमएसएमई और खुदरा ग्राहकों के लिए विश्वसनीय डोरस्टेप पार्सल व माल ढुलाई सेवा। पारदर्शी दरें, पक्की रसीद और लाइव ट्रैकिंग।'
                : 'Reliable parcel delivery and express freight for traders, SMEs, and consumers. Doorstep pickup, transparent bilty receipts, and real-time transit tracking.'}
            </p>
            <div className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-medium">Operations:</span>
                <span className="text-slate-300">Regional Dispatch Network (Demo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-medium">Inquiry:</span>
                <a href="mailto:support@freightline.in" className="hover:text-white transition-colors">support@freightline.in</a>
              </div>
              <div className="text-slate-400 text-[11px]">
                Regional Hubs: Delhi • Jaipur • Surat • Mumbai • Bengaluru • Kolkata
              </div>
            </div>
          </div>

          {/* Popular Corridors */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              {lang === 'hi' ? 'लोकप्रिय पार्सल मार्ग' : 'Express Routes'}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/track?id=FLX-8829-JPR" className="hover:text-orange-400 flex items-center gap-1.5 transition-colors">
                  <span className="text-orange-500">›</span> Delhi ➔ Jaipur (Next Day)
                </Link>
              </li>
              <li>
                <Link to="/track?id=FLX-4012-MUM" className="hover:text-orange-400 flex items-center gap-1.5 transition-colors">
                  <span className="text-emerald-400">›</span> Surat ➔ Mumbai (Saree Express)
                </Link>
              </li>
              <li>
                <Link to="/track?id=FLX-3109-BLR" className="hover:text-orange-400 flex items-center gap-1.5 transition-colors">
                  <span className="text-sky-400">›</span> Chennai ➔ Bengaluru (Same Day)
                </Link>
              </li>
              <li>
                <Link to="/track?id=FLX-7741-KOL" className="hover:text-orange-400 flex items-center gap-1.5 transition-colors">
                  <span className="text-orange-500">›</span> Ludhiana ➔ Kolkata (Textile Cargo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              {lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/track" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>›</span> {lang === 'hi' ? 'पार्सल ट्रैक करें' : 'Track by Shipment ID'}
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>›</span> {lang === 'hi' ? 'नया पार्सल बुक करें' : 'Book a Parcel Online'}
                </Link>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>›</span> {lang === 'hi' ? 'लॉजिस्टिक्स सेवाएं' : 'Our Logistics Services'}
                </a>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <Link
                  to="/manager/login"
                  className="text-white hover:text-orange-400 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <IndustrialIcon name="shield" size={14} className="text-orange-400" />
                  <span>{lang === 'hi' ? 'मैनेजर व स्टाफ पोर्टल लॉगिन' : 'Manager & Staff Portal'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Service Commitments */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              {lang === 'hi' ? 'विश्वसनीय सेवा' : 'Service Standards'}
            </h3>
            <div className="space-y-2.5">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5">
                <IndustrialIcon name="shield" className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <div className="text-xs font-semibold text-white">
                    {lang === 'hi' ? 'डिजिटल सुरक्षा व ओटीपी सत्यापन' : 'Secure Handover with OTP'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'सामान मिलने और जांचने के बाद ही डिलीवरी' : 'Protected handover only upon physical verification.'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5">
                <IndustrialIcon name="file" className="text-orange-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <div className="text-xs font-semibold text-white">
                    {lang === 'hi' ? 'पक्की जीएसटी बिलती व फोटो रसीद' : 'GST Compliant Bilty Receipts'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'पारदर्शी दरें और पूर्ण कानूनी सुरक्षा' : 'Official LR documents with clear rate breakdowns.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Regulatory Bottom Note */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {lang === 'hi'
              ? 'सभी पार्सल भारतीय मोटर वाहन अधिनियम एवं माल परिवहन एजेंसी (GTA) नियमों के तहत सुरक्षित ले जाए जाते हैं।'
              : 'All shipments are carried under the Goods Transport Agency regulations. Transparent e-way bills and compliant logistics operations.'}
          </div>
          <div className="shrink-0 text-slate-400 font-medium">
            © 2026 FREIGHTLINE LOGISTICS INDIA
          </div>
        </div>
      </div>
    </footer>
  );
};
