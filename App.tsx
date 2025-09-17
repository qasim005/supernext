import React, { useState } from 'react';
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
import MikrotikPage from './components/client/MikrotikPage';
import MikrotikAPPage from './components/client/MikrotikAPPage';
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

export type Page =
  'dashboard' | 'vouchers' | 'users' | 'clientDashboard' | 'voucherManagement' |
  'reports' | 'backups' | 'mikrotik' | 'mikrotikAP' | 'archive' | 'settings' | 'userAccess' |
  'accessLogs' | 'realTimeStats' | 'splashPage' | 'services' | 'adminManagement' | 'helpAndSupport' | 'integrations';

export type UserRole = 'admin' | 'client' | 'master-admin';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'login' | 'dashboard' | 'hotspotSimulation'>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
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

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage(role === 'client' ? 'clientDashboard' : 'dashboard');
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setAppState('landing');
  };

  const handleStartHotspotSimulation = (voucherCode: string) => {
    setSimulationVoucherCode(voucherCode);
    setAppState('hotspotSimulation');
  }

  const handleEndHotspotSimulation = () => {
    setSimulationVoucherCode(null);
    setAppState('dashboard');
  }

  if (appState === 'landing') {
    return <LandingPage onNavigateToLogin={() => setAppState('login')} />;
  }

  if (appState === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setAppState('landing')} />;
  }

  if (appState === 'hotspotSimulation' && simulationVoucherCode) {
    return <HotspotSimulationPage voucherCode={simulationVoucherCode} onBack={handleEndHotspotSimulation} />;
  }


  return (
    <NotificationsProvider>
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
              {currentPage === 'dashboard' && <AdminDashboard />}
              {currentPage === 'vouchers' && <VoucherManagement />}
              {currentPage === 'users' && <UserManagement />}
              {currentPage === 'services' && <ServiceManagement />}
              {currentPage === 'adminManagement' && <AdminManagement />}
              {currentPage === 'clientDashboard' && (userRole === 'master-admin' ? <MasterDashboard /> : <ClientDashboard />)}
              {currentPage === 'voucherManagement' && <ClientVoucherManagement onStartSimulation={handleStartHotspotSimulation} />}
              {currentPage === 'reports' && <ReportsPage />}
              {currentPage === 'backups' && <BackupPage />}
              {currentPage === 'mikrotik' && <MikrotikPage />}
              {currentPage === 'mikrotikAP' && <MikrotikAPPage />}
              {currentPage === 'archive' && <ArchivePage />}
              {currentPage === 'settings' && <SettingsPage />}
              {currentPage === 'userAccess' && <UserAccessPage />}
              {currentPage === 'accessLogs' && <AccessLogsPage />}
              {currentPage === 'realTimeStats' && <RealTimeStatsPage />}
              {currentPage === 'splashPage' && <SplashPageCustomizer />}
              {currentPage === 'helpAndSupport' && <HelpAndSupportPage />}
              {currentPage === 'integrations' && <IntegrationsPage />}
            </div>
          </main>
          <AICopilot setCurrentPage={setCurrentPage} role={userRole} currentPage={currentPage} />
        </div>
      </div>
    </NotificationsProvider>
  );
};

export default App;