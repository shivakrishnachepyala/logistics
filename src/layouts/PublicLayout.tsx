import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { useTranslation } from '../context/LanguageContext';

export const PublicLayout: React.FC = () => {
  const { lang } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white antialiased">
      {/* Public Header & Navigation */}
      <Navbar />

      {/* Main Public Page Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Public Footer */}
      <Footer />

      {/* Floating WhatsApp & Tele-Helpline Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        <a
          href="https://wa.me/919876543210?text=Hello%20FreightLine%20I%20need%20help%20with%20my%20parcel"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white px-4 py-2.5 rounded-full shadow-lg shadow-emerald-950/20 hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-xs font-semibold tracking-wide border border-white/20"
          title="Chat on WhatsApp for customer assistance"
        >
          <IndustrialIcon name="phone" size={16} />
          <span>{lang === 'hi' ? 'व्हाट्सएप सहायता (डेमो)' : 'WhatsApp Inquiry (Demo)'}</span>
        </a>
      </div>
    </div>
  );
};

export default PublicLayout;
