import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { EnterpriseProvider } from './context/EnterpriseContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { ManagerLayout } from './layouts/ManagerLayout';
import { CustomerLayout } from './layouts/CustomerLayout';

// Public Lazy Routes
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const TrackingPage = lazy(() => import('./pages/TrackingPage').then(m => ({ default: m.TrackingPage })));
const ReceiverPortalPage = lazy(() => import('./pages/ReceiverPortalPage').then(m => ({ default: m.ReceiverPortalPage })));
const CreateShipmentPage = lazy(() => import('./pages/CreateShipmentPage').then(m => ({ default: m.CreateShipmentPage })));

// Customer Portal Lazy Routes
const CustomerLoginPage = lazy(() => import('./pages/customer/CustomerLoginPage').then(m => ({ default: m.CustomerLoginPage })));
const CustomerRegisterPage = lazy(() => import('./pages/customer/CustomerRegisterPage').then(m => ({ default: m.CustomerRegisterPage })));
const CustomerDashboardPage = lazy(() => import('./pages/customer/CustomerDashboardPage').then(m => ({ default: m.CustomerDashboardPage })));
const CustomerShipmentsPage = lazy(() => import('./pages/customer/CustomerShipmentsPage').then(m => ({ default: m.CustomerShipmentsPage })));
const CustomerBookShipmentPage = lazy(() => import('./pages/customer/CustomerBookShipmentPage').then(m => ({ default: m.CustomerBookShipmentPage })));
const CustomerAddressesPage = lazy(() => import('./pages/customer/CustomerAddressesPage').then(m => ({ default: m.CustomerAddressesPage })));
const CustomerBookingHistoryPage = lazy(() => import('./pages/customer/CustomerBookingHistoryPage').then(m => ({ default: m.CustomerBookingHistoryPage })));
const CustomerProfilePage = lazy(() => import('./pages/customer/CustomerProfilePage').then(m => ({ default: m.CustomerProfilePage })));

// Manager Login Screen
const ManagerLoginPage = lazy(() => import('./pages/ManagerLoginPage').then(m => ({ default: m.ManagerLoginPage })));

// Operational Enterprise Lazy Routes
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ShipmentsPage = lazy(() => import('./pages/ShipmentsPage').then(m => ({ default: m.ShipmentsPage })));
const TransportationAssignmentPage = lazy(() => import('./pages/TransportationAssignmentPage').then(m => ({ default: m.TransportationAssignmentPage })));
const LiveTrackingPage = lazy(() => import('./pages/LiveTrackingPage').then(m => ({ default: m.LiveTrackingPage })));
const FleetManagementPage = lazy(() => import('./pages/FleetManagementPage').then(m => ({ default: m.FleetManagementPage })));
const WarehouseManagementPage = lazy(() => import('./pages/WarehouseManagementPage').then(m => ({ default: m.WarehouseManagementPage })));
const InventoryManagementPage = lazy(() => import('./pages/InventoryManagementPage').then(m => ({ default: m.InventoryManagementPage })));
const CustomersStaffPage = lazy(() => import('./pages/CustomersStaffPage').then(m => ({ default: m.CustomersStaffPage })));
const PaymentsBillingPage = lazy(() => import('./pages/PaymentsBillingPage').then(m => ({ default: m.PaymentsBillingPage })));
const ReportsAnalyticsPage = lazy(() => import('./pages/ReportsAnalyticsPage').then(m => ({ default: m.ReportsAnalyticsPage })));
const BranchManagementPage = lazy(() => import('./pages/BranchManagementPage').then(m => ({ default: m.BranchManagementPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ShipmentDetailPage = lazy(() => import('./pages/ShipmentDetailPage').then(m => ({ default: m.ShipmentDetailPage })));

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

// Enterprise loading indicator for Suspense fallback
function RouteLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px] p-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-saas-md flex flex-col sm:flex-row items-center gap-4 text-xs">
        <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-sm">
          <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
        <div>
          <div className="font-heading font-bold text-sm tracking-tight text-slate-900">
            FREIGHTLINE ENTERPRISE LMS
          </div>
          <div className="text-slate-500 text-xs mt-0.5">
            Loading operational manifest & logistics telemetry...
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic Backward Compatibility Redirect for Shipments
function LegacyShipmentRedirect() {
  const { id } = useParams();
  return <Navigate to={`/manager/shipment/${id}`} replace />;
}

function App() {
  return (
    <LanguageProvider>
      <EnterpriseProvider>
        <CustomerAuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                {/* 1. Public Portal Experience (Customer-Friendly, No Management Sidebar) */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/track" element={<TrackingPage />} />
                  <Route path="/r/:id" element={<ReceiverPortalPage />} />
                  <Route path="/create" element={<CreateShipmentPage />} />
                </Route>

                {/* 2. Customer Portal Auth Routes */}
                <Route path="/login" element={<CustomerLoginPage />} />
                <Route path="/register" element={<CustomerRegisterPage />} />

                {/* 3. Dedicated Customer Portal (/account/*) */}
                <Route path="/account" element={<CustomerLayout />}>
                  <Route index element={<CustomerDashboardPage />} />
                  <Route path="shipments" element={<CustomerShipmentsPage />} />
                  <Route path="book" element={<CustomerBookShipmentPage />} />
                  <Route path="addresses" element={<CustomerAddressesPage />} />
                  <Route path="history" element={<CustomerBookingHistoryPage />} />
                  <Route path="profile" element={<CustomerProfilePage />} />
                </Route>

                {/* 4. Manager Portal Simulated Login */}
                <Route path="/manager/login" element={<ManagerLoginPage />} />

                {/* 5. Dedicated Manager Portal (/manager/*) with Full Enterprise Shell */}
                <Route path="/manager" element={<ManagerLayout />}>
                  <Route index element={<Navigate to="/manager/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="shipments" element={<ShipmentsPage />} />
                  <Route path="create" element={<CreateShipmentPage />} />
                  <Route path="shipment/:id" element={<ShipmentDetailPage />} />
                  <Route path="transport-assignment" element={<TransportationAssignmentPage />} />
                  <Route path="tracking" element={<LiveTrackingPage />} />
                  <Route path="fleet" element={<FleetManagementPage />} />
                  <Route path="warehouses" element={<WarehouseManagementPage />} />
                  <Route path="inventory" element={<InventoryManagementPage />} />
                  <Route path="customers" element={<CustomersStaffPage />} />
                  <Route path="billing" element={<PaymentsBillingPage />} />
                  <Route path="analytics" element={<ReportsAnalyticsPage />} />
                  <Route path="branches" element={<BranchManagementPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* 6. Backward Compatibility Redirects (Old Operational Routes -> New /manager Routes) */}
                <Route path="/dashboard" element={<Navigate to="/manager/dashboard" replace />} />
                <Route path="/shipments" element={<Navigate to="/manager/shipments" replace />} />
                <Route path="/shipment/:id" element={<LegacyShipmentRedirect />} />
                <Route path="/transport-assignment" element={<Navigate to="/manager/transport-assignment" replace />} />
                <Route path="/tracking" element={<Navigate to="/manager/tracking" replace />} />
                <Route path="/fleet" element={<Navigate to="/manager/fleet" replace />} />
                <Route path="/warehouses" element={<Navigate to="/manager/warehouses" replace />} />
                <Route path="/inventory" element={<Navigate to="/manager/inventory" replace />} />
                <Route path="/customers" element={<Navigate to="/manager/customers" replace />} />
                <Route path="/billing" element={<Navigate to="/manager/billing" replace />} />
                <Route path="/analytics" element={<Navigate to="/manager/analytics" replace />} />
                <Route path="/branches" element={<Navigate to="/manager/branches" replace />} />
                <Route path="/settings" element={<Navigate to="/manager/settings" replace />} />

                {/* 7. Fallback to Public Homepage */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CustomerAuthProvider>
      </EnterpriseProvider>
    </LanguageProvider>
  );
}

export default App;
