import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/users/UserManagement';
import LoginPage from './components/auth/LoginPage';
import ClientDashboard from './components/client/ClientDashboard';
import ReportsPage from './components/client/ReportsPage';
import ClientVoucherManagement from './components/client/ClientVoucherManagement';
import LandingPage from './components/landing/LandingPage';
import BackupPage from './components/client/BackupPage';
import MikrotikPage from './components/client/MikrotikPage.jsx';
import ArchivePage from './components/client/ArchivePage';
import SettingsPage from './components/client/settings/SettingsPage';
import UserAccessPage from './components/client/user_access/UserAccessPage';
import AccessLogsPage from './components/client/monitoring/AccessLogsPage';
import RealTimeStatsPage from './components/client/stats/RealTimeStatsPage';
import SplashPageCustomizer from './components/client/splash_page/SplashPageCustomizer';
import { NotificationsProvider } from './context/NotificationsContext';
import VoucherManagement from './components/vouchers/VoucherManagement';
import ServiceManagement from './components/admin/ServiceManagement';
import AdminManagement from './components/admin/AdminManagement';
import MasterDashboard from './components/admin/MasterDashboard';
import HelpAndSupportPage from './components/client/help/HelpAndSupportPage';
import IntegrationsPage from './components/client/settings/IntegrationsPage';
import AICopilot from './components/layout/AICopilot';
import HotspotSimulationPage from './components/client/HotspotSimulationPage';
import NotFoundPage from './components/NotFoundPage';
import SignUpPage from './components/auth/SignUpPage';

export type Page =
  'dashboard' | 'vouchers' | 'users' | 'clientDashboard' | 'voucherManagement' |
  'reports' | 'backups' | 'mikrotik' | 'mikrotikAP' | 'archive' | 'settings' | 'userAccess' |
  'accessLogs' | 'realTimeStats' | 'splashPage' | 'services' | 'adminManagement' | 'helpAndSupport' | 'integrations';

export type UserRole = 'admin' | 'client' | 'master-admin';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'login' | 'dashboard' | 'hotspotSimulation'>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [simulationVoucherCode, setSimulationVoucherCode] = useState<string | null>(null);

  const pageTitles: Record<Page, { title: string, subtitle: string }> = {
    dashboard: {
      title: 'Admin Dashboard',
      subtitle: "Here's your network and user overview."
    },
    vouchers: {
      title: 'Voucher Management',
      subtitle: 'Generate, track, and manage user vouchers.'
    },
    users: {
      title: 'Client Management',
      subtitle: 'View and manage your registered clients.'
    },
    services: {
      title: 'Service Management',
      subtitle: 'Monitor and manage core backend services.'
    },
    adminManagement: {
      title: 'Admin User Management',
      subtitle: 'Create and manage administrator accounts.'
    },
    clientDashboard: {
      title: userRole === 'master-admin' ? 'Master Dashboard' : 'Client Dashboard',
      subtitle: userRole === 'master-admin' ? 'An overview of all client accounts.' : 'An overview of your hotspot activity.'
    },
    voucherManagement: {
      title: 'Voucher Management',
      subtitle: 'Generate, track, and manage user vouchers.'
    },
    reports: {
      title: 'Reports',
      subtitle: 'View daily and historical reports for your venue.'
    },
    backups: {
      title: 'Data Backups',
      subtitle: 'Manage automatic and manual data backups.'
    },
    mikrotik: {
      title: 'MikroTik NAS Management',
      subtitle: 'Add and manage your MikroTik network devices.'
    },
    mikrotikAP: {
      title: 'MikroTik Access Point Management',
      subtitle: 'Add and manage your MikroTik access points for hotspot services.'
    },
    archive: {
      title: 'Archived Vouchers',
      subtitle: 'View all your archived and deleted vouchers.'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your profile, billing, and integrations.'
    },
    userAccess: {
      title: 'User Access Management',
      subtitle: 'Manage sub-user accounts and their permissions.'
    },
    accessLogs: {
      title: 'Dashboard Access Logs',
      subtitle: 'Monitor sign-in activity for your account.'
    },
    realTimeStats: {
      title: 'Real-time Statistics',
      subtitle: 'Live hotspot activity and bandwidth usage.'
    },
    splashPage: {
      title: 'Splash Page Customizer',
      subtitle: 'Design and manage your guest login page.'
    },
    helpAndSupport: {
      title: 'Help & Support',
      subtitle: 'Find answers or get in touch with our team.'
    },
    integrations: {
      title: 'API & Service Integrations',
      subtitle: 'Connect and manage third-party services.'
    }
  };

  const handleLogout = () => {
    setAppState('landing');
  };

  const handleStartHotspotSimulation = (voucherCode: string) => {
    setSimulationVoucherCode(voucherCode);
    setAppState('hotspotSimulation');
  }



  return (
    <NotificationsProvider>
      <Routes>
        <Route path="/" element={<LandingPage onNavigateToLogin={() => setAppState('login')} />} />
        <Route
          path="*"
          element={
            <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                role={userRole}
                onLogout={handleLogout}
              />
              <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <Header
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  title={pageTitles[currentPage].title}
                  subtitle={pageTitles[currentPage].subtitle}
                  role={userRole}
                />
                <main>
                  <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    <Routes>
                      <Route path="/supernext/dashboard" element={<AdminDashboard />} />
                      <Route path="/supernext/voucher-management" element={<VoucherManagement />} />
                      <Route path="/supernext/clients" element={<UserManagement />} />
                      <Route path="/supernext/services" element={<ServiceManagement />} />
                      <Route path="/supernext/admin-management" element={<AdminManagement />} />
                      <Route path="/client/dashboard" element={userRole === 'master-admin' ? <MasterDashboard /> : <ClientDashboard />} />
                      <Route path="/client/voucher-management" element={<ClientVoucherManagement onStartSimulation={handleStartHotspotSimulation} />} />
                      <Route path="/client/reports" element={<ReportsPage />} />
                      <Route path="/client/backups" element={<BackupPage />} />
                      <Route path="/client/mikrotik" element={<MikrotikPage />} />
                      <Route path="/client/archive" element={<ArchivePage />} />
                      <Route path="/client/settings" element={<SettingsPage />} />
                      <Route path="/client/user-access" element={<UserAccessPage />} />
                      <Route path="/client/access-logs" element={<AccessLogsPage />} />
                      <Route path="/client/real-time-stats" element={<RealTimeStatsPage />} />
                      <Route path="/client/splash-page" element={<SplashPageCustomizer />} />
                      <Route path="/client/help-and-support" element={<HelpAndSupportPage />} />
                      <Route path="/client/integrations" element={<IntegrationsPage />} />
                    </Routes>
                  </div>
                </main>
                <AICopilot setCurrentPage={setCurrentPage} role={userRole} currentPage={currentPage} />
              </div>
            </div>
          }
        />
        <Route path="/signin" element={<LoginPage setUserRole={setUserRole} onLogin={() => {}} onBack={() => {}} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </NotificationsProvider>
  );
};

export default App;