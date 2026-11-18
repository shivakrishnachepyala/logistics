import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { useTranslation } from '../context/LanguageContext';

export const PublicLayout: React.FC = () => {
  const { lang } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-white antialiased transition-colors">
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
          href="https://wa.me/916303766064"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white px-4 py-2.5 rounded-full shadow-lg shadow-emerald-950/20 hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-xs font-semibold tracking-wide border border-white/20"
          title="Chat on WhatsApp (+91 6303766064)"
        >
          <IndustrialIcon name="phone" size={16} />
          <span>{lang === 'hi' ? 'व्हाट्सएप: +91 6303766064' : 'WhatsApp: +91 6303766064'}</span>
        </a>
      </div>
    </div>
  );
};

export default PublicLayout;
