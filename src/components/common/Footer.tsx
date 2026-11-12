import React from 'react';
import { Link } from 'react-router-dom';
import { IndustrialIcon } from './IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { lang } = useTranslation();

  return (
    <footer className="mt-auto bg-asphalt text-paper border-t-[2px] border-asphalt">
      {/* Hazard stripe top bar */}
      <div className="h-2 w-full hazard-stripes"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Hub Status Grid */}
        <div className="border-b border-asphalt-muted pb-8 mb-8">
          <div className="font-heading font-black text-xs text-yellow tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow inline-block"></span>
            {lang === 'hi' ? 'हमारे प्रमुख पार्सल सेंटर और सेवा केंद्र' : 'OUR ACTIVE PARCEL CENTRES & STATIONS'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono text-xs">
            <div className="bg-asphalt-soft p-3 border border-asphalt-muted">
              <div className="text-yellow font-bold">DELHI CENTRAL</div>
              <div className="text-paper text-[11px] truncate">Chandni Chowk / Okhla</div>
              <div className="text-steel text-[10px] mt-1">OPEN: 24 HOURS</div>
            </div>
            <div className="bg-asphalt-soft p-3 border border-asphalt-muted">
              <div className="text-yellow font-bold">JAIPUR MAIN</div>
              <div className="text-paper text-[11px] truncate">Johari Bazar / VKI</div>
              <div className="text-steel text-[10px] mt-1">DAILY 2 TRUCKS</div>
            </div>
            <div className="bg-asphalt-soft p-3 border border-asphalt-muted">
              <div className="text-yellow font-bold">SURAT TEXTILE</div>
              <div className="text-paper text-[11px] truncate">Ring Road Market</div>
              <div className="text-steel text-[10px] mt-1">EXPRESS CLOTH SERVICE</div>
            </div>
            <div className="bg-asphalt-soft p-3 border border-asphalt-muted">
              <div className="text-yellow font-bold">MUMBAI HUB</div>
              <div className="text-paper text-[11px] truncate">Crawford Market / Bhiwandi</div>
              <div className="text-teal text-[10px] mt-1">FAST CITY DELIVERY</div>
            </div>
            <div className="bg-asphalt-soft p-3 border border-asphalt-muted">
              <div className="text-yellow font-bold">BENGALURU</div>
              <div className="text-paper text-[11px] truncate">Peenya Industrial Area</div>
              <div className="text-teal text-[10px] mt-1">SOUTH ROUTE READY</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange text-asphalt p-1.5 border border-paper stamp-sm">
                <IndustrialIcon name="box" size={20} />
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-paper">
                FREIGHTLINE
              </span>
            </div>
            <p className="text-steel text-xs font-body leading-relaxed mb-4">
              {lang === 'hi'
                ? 'छोटे दुकानदारों, व्यापारियों और किसानों के लिए सरल पार्सल सेवा। सुरक्षित गाड़ी, पक्की रसीद और व्हाट्सएप अपडेट।'
                : 'Simple, reliable parcel delivery for shopkeepers, traders, and farmers. Doorstep pickup, safe road and rail transport, and live mobile tracking.'}
            </p>
            <div className="font-mono text-[11px] text-yellow space-y-1">
              <div>HELP LINE: +91 98765 43210</div>
              <div>WHATSAPP: +91 98765 43210</div>
              <div>TIMINGS: 8:00 AM – 9:00 PM (ALL 7 DAYS)</div>
            </div>
          </div>

          {/* Quick Routing */}
          <div>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-paper mb-3">
              {lang === 'hi' ? 'लोकप्रिय पार्सल मार्ग' : 'POPULAR PARCEL ROUTES'}
            </h2>
            <ul className="space-y-2 text-xs font-mono text-steel">
              <li>
                <Link to="/track?id=FLX-8829-JPR" className="hover:text-yellow flex items-center gap-1.5 transition-colors">
                  <span className="text-orange">›</span> Delhi ➔ Jaipur (Next Day)
                </Link>
              </li>
              <li>
                <Link to="/track?id=FLX-4012-MUM" className="hover:text-yellow flex items-center gap-1.5 transition-colors">
                  <span className="text-teal">›</span> Surat ➔ Mumbai (Saree Express)
                </Link>
              </li>
              <li>
                <Link to="/track?id=FLX-3109-BLR" className="hover:text-yellow flex items-center gap-1.5 transition-colors">
                  <span className="text-yellow">›</span> Chennai ➔ Bengaluru (Same Day)
                </Link>
              </li>
              <li>
                <Link to="/track?id=FLX-7741-KOL" className="hover:text-yellow flex items-center gap-1.5 transition-colors">
                  <span className="text-orange">›</span> Ludhiana ➔ Kolkata (Woollen Cargo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Manifest Operations */}
          <div>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-paper mb-3">
              {lang === 'hi' ? 'त्वरित लिंक' : 'HELPFUL LINKS'}
            </h2>
            <ul className="space-y-2 text-xs font-heading font-semibold uppercase tracking-wide text-steel">
              <li>
                <Link to="/dashboard" className="hover:text-paper transition-colors flex items-center gap-1">
                  <span>›</span> {lang === 'hi' ? 'मेरे पार्सल देखें' : 'View My Parcels'}
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-paper transition-colors flex items-center gap-1">
                  <span>›</span> {lang === 'hi' ? 'नया पार्सल बुक करें' : 'Send a New Parcel'}
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-paper transition-colors flex items-center gap-1">
                  <span>›</span> {lang === 'hi' ? 'रसीद नंबर से खोजें' : 'Track by Parcel Number'}
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-paper transition-colors flex items-center gap-1">
                  <span>›</span> {lang === 'hi' ? 'किराया और दरें देखें' : 'Check Delivery Charges'}
                </a>
              </li>
            </ul>
          </div>

          {/* Simple Trust Guarantees */}
          <div>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-paper mb-3">
              {lang === 'hi' ? 'हमारी गारंटी' : 'OUR GUARANTEE'}
            </h2>
            <div className="space-y-2">
              <div className="bg-asphalt-soft border border-asphalt-muted p-2 flex items-center gap-2">
                <IndustrialIcon name="shield" className="text-teal" size={16} />
                <span className="font-heading text-xs uppercase tracking-wider text-paper">
                  {lang === 'hi' ? '100% सुरक्षित डिलीवरी गारंटी' : '100% SAFE DELIVERY GUARANTEE'}
                </span>
              </div>
              <div className="bg-asphalt-soft border border-asphalt-muted p-2 flex items-center gap-2">
                <IndustrialIcon name="file" className="text-yellow" size={16} />
                <span className="font-heading text-xs uppercase tracking-wider text-paper">
                  {lang === 'hi' ? 'पक्की बिलती और फोटो रसीद' : 'OFFICIAL BILTY / RECEIPT WITH PHOTO'}
                </span>
              </div>
              <div className="bg-asphalt-soft border border-asphalt-muted p-2 flex items-center gap-2">
                <IndustrialIcon name="check" className="text-orange" size={16} />
                <span className="font-heading text-xs uppercase tracking-wider text-paper">
                  {lang === 'hi' ? 'सामान मिलने पर नकद भुगतान (COD)' : 'CASH ON DELIVERY (COD) ACCEPTED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Friendly Bottom Note */}
        <div className="border-t border-asphalt-muted pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[11px] text-steel">
          <div>
            {lang === 'hi'
              ? 'नोट: सभी पार्सल भारतीय मोटर वाहन अधिनियम एवं पार्सल सुरक्षा नियमों के तहत भेजे जाते हैं। पूरा हिसाब एवं जीएसटी रसीद उपलब्ध।'
              : 'NOTICE: All parcels carried under standard Goods Transport Agency regulations. Transparent GST receipts & doorstep pickup available across India.'}
          </div>
          <div className="shrink-0 text-paper font-bold">
            © 2026 FREIGHTLINE LOGISTICS INDIA
          </div>
        </div>
      </div>
    </footer>
  );
};
