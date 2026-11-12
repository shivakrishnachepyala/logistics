import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { EnterpriseProvider } from './context/EnterpriseContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { IndustrialIcon } from './components/common/IndustrialIcon';

// Dynamic route code-splitting for optimal Vercel bundle performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const TrackingPage = lazy(() => import('./pages/TrackingPage').then(m => ({ default: m.TrackingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CreateShipmentPage = lazy(() => import('./pages/CreateShipmentPage').then(m => ({ default: m.CreateShipmentPage })));
const ShipmentDetailPage = lazy(() => import('./pages/ShipmentDetailPage').then(m => ({ default: m.ShipmentDetailPage })));
const ReceiverPortalPage = lazy(() => import('./pages/ReceiverPortalPage').then(m => ({ default: m.ReceiverPortalPage })));

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

// Neo-Brutalist loading indicator for Suspense fallback
function RouteLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px] bg-paper p-6">
      <div className="bg-chalk border-[2px] border-asphalt p-6 sm:p-8 stamp flex flex-col sm:flex-row items-center gap-4 font-mono text-xs">
        <div className="w-8 h-8 bg-asphalt text-paper border border-asphalt flex items-center justify-center font-heading font-black text-xs shrink-0 stamp-sm">
          <IndustrialIcon name="box" size={18} className="text-orange animate-bounce" />
        </div>
        <div>
          <div className="font-heading font-black text-sm uppercase tracking-wider text-asphalt">
            FREIGHTLINE CARGO SYSTEM
          </div>
          <div className="text-steel text-[11px] mt-0.5">
            Loading route manifest & logistics telemetry...
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating WhatsApp / Phone help button for Indian users (shopkeepers, farmers)
function FloatingHelpButton() {
  const { lang } = useTranslation();
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      <a
        href="https://wa.me/919876543210?text=Hello%20FreightLine%20I%20need%20help%20with%20my%20parcel"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white border-[2px] border-asphalt px-3.5 py-2.5 rounded-[2px] stamp flex items-center gap-2 hover:brightness-105 transition-all text-xs font-heading font-black tracking-wide uppercase min-h-[48px]"
        title="Chat on WhatsApp for help"
      >
        <IndustrialIcon name="phone" size={16} />
        <span>{lang === 'hi' ? 'व्हाट्सएप / फोन सहायता' : 'WhatsApp / Call Help'}</span>
      </a>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <EnterpriseProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-paper text-asphalt font-body selection:bg-orange selection:text-white">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/track" element={<TrackingPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/create" element={<CreateShipmentPage />} />
                  <Route path="/shipment/:id" element={<ShipmentDetailPage />} />
                  <Route path="/r/:id" element={<ReceiverPortalPage />} />
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <FloatingHelpButton />
          </div>
        </BrowserRouter>
      </EnterpriseProvider>
    </LanguageProvider>
  );
}

export default App;
