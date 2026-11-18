import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

const SIDEBAR_STORAGE_KEY = 'freightline_sidebar_collapsed';

export const ManagerLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return saved === 'true';
    }
    return false;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
    }
  }, [isCollapsed]);

  // Ensure default demo session is initialized if missing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('veltrax_manager_auth') || localStorage.getItem('freightline_manager_auth');
      if (!auth) {
        const defaultSession = JSON.stringify({
          isAuthenticated: true,
          email: 'admin@veltrax.in',
          role: 'Operations Manager',
          branch: 'DEL-CENTRAL',
          loginTime: new Date().toISOString(),
          isSimulated: true,
        });
        localStorage.setItem('veltrax_manager_auth', defaultSession);
        localStorage.setItem('freightline_manager_auth', defaultSession);
      }
    }
  }, []);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors">
      {/* Enterprise Manager Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Dedicated Manager TopBar */}
        <TopBar
          onToggleSidebar={toggleCollapse}
          onOpenMobileSidebar={openMobile}
          isSidebarCollapsed={isCollapsed}
        />

        {/* Scrollable Operations Workspace */}
        <main className="manager-workspace flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 dark:bg-[#0B1220] transition-colors">
          <div className="max-w-7xl mx-auto space-y-4">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
