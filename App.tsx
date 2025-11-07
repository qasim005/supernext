import React, { useEffect, useState } from 'react';
import axiosInstance from './utils/axiosInstance';
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
// @ts-ignore
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
import ProtectedRoute from './components/auth/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';

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

  const handleLogout = async () => {
    // Remove token from storage
    localStorage.removeItem('token');
    try {
  await axiosInstance.post('/api/auth/logout');
    } catch (e) {}
    setUserRole('client'); // or set to a default role, or add a 'null' type to UserRole if you want to fully clear
    setAppState('landing');
    window.location.href = '/signin';
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
                      <Route path="/supernext/dashboard" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/supernext/voucher-management" element={
                        <ProtectedRoute requiredRole="admin">
                          <VoucherManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/supernext/clients" element={
                        <ProtectedRoute requiredRole="admin">
                          <UserManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/supernext/services" element={
                        <ProtectedRoute requiredRole="admin">
                          <ServiceManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/supernext/admin-management" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminManagement />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/dashboard" element={
                        <ProtectedRoute>
                          {userRole === 'master-admin' ? <MasterDashboard /> : <ClientDashboard />}
                        </ProtectedRoute>
                      } />
                      <Route path="/client/voucher-management" element={
                        <ProtectedRoute>
                          <ClientVoucherManagement onStartSimulation={handleStartHotspotSimulation} />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/reports" element={
                        <ProtectedRoute>
                          <ReportsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/backups" element={
                        <ProtectedRoute>
                          <BackupPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/mikrotik" element={
                        <ProtectedRoute>
                          <MikrotikPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/archive" element={
                        <ProtectedRoute>
                          <ArchivePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/settings" element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/user-access" element={
                        <ProtectedRoute>
                          <UserAccessPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/access-logs" element={
                        <ProtectedRoute>
                          <AccessLogsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/real-time-stats" element={
                        <ProtectedRoute>
                          <RealTimeStatsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/splash-page" element={
                        <ProtectedRoute>
                          <SplashPageCustomizer />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/help-and-support" element={
                        <ProtectedRoute>
                          <HelpAndSupportPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/client/integrations" element={
                        <ProtectedRoute>
                          <IntegrationsPage />
                        </ProtectedRoute>
                      } />
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
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </NotificationsProvider>
  );
};

export default App;