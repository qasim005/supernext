import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminManagement from './components/admin/AdminManagement';
import MasterDashboard from './components/admin/MasterDashboard';
import ServiceManagement from './components/admin/ServiceManagement';
import LoginPage from './components/auth/LoginPage';
import ClientDashboard from './components/client/ClientDashboard';
import ArchivePage from './components/client/ArchivePage';
import BackupPage from './components/client/BackupPage';
import MikrotikAPPage from './components/client/MikrotikAPPage';
import MikrotikPage from './components/client/MikrotikPage';
import ReportsPage from './components/client/ReportsPage';
import HotspotSimulationPage from './components/client/hotspot_simulation/HotspotSimulationPage';
import AccessLogsPage from './components/client/monitoring/AccessLogsPage';
import IntegrationsPage from './components/client/settings/IntegrationsPage';
import SettingsPage from './components/client/settings/SettingsPage';
import SplashPageCustomizer from './components/client/splash_page/SplashPageCustomizer';
import UserAccessPage from './components/client/user_access/UserAccessPage';
import RealTimeStatsPage from './components/client/stats/RealTimeStatsPage';
import HelpAndSupportPage from './components/client/help/HelpAndSupportPage';
import LandingPage from './components/landing/LandingPage';
import AICopilot from './components/layout/AICopilot';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import UserManagement from './components/users/UserManagement';
import VoucherManagement from './components/vouchers/VoucherManagement';
import { NotificationsProvider } from './context/NotificationsContext';

export type UserRole = 'admin' | 'client' | 'master-admin';

export type Page =
    | 'dashboard'
    | 'vouchers'
    | 'voucherManagement'
    | 'users'
    | 'services'
    | 'adminManagement'
    | 'clientDashboard'
    | 'reports'
    | 'backups'
    | 'mikrotik'
    | 'mikrotikAP'
    | 'archive'
    | 'settings'
    | 'userAccess'
    | 'accessLogs'
    | 'realTimeStats'
    | 'splashPage'
    | 'helpAndSupport'
    | 'integrations';

// Authentication helpers
const getStoredAuth = () => {
    return {
        isAuthenticated: localStorage.getItem('auth') === 'true',
        userRole: localStorage.getItem('userRole') as UserRole || 'admin'
    };
};

const setStoredAuth = (role: UserRole) => {
    localStorage.setItem('auth', 'true');
    localStorage.setItem('userRole', role);
};

const clearStoredAuth = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('userRole');
};

// Route Components
const LandingPageRoute: React.FC = () => {
    const navigate = useNavigate();
    return <LandingPage onNavigateToLogin={() => navigate('/login')} />;
};

const LoginPageRoute: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = (role: UserRole) => {
        setStoredAuth(role);
        if (role === 'client') {
            navigate('/dashboard/client');
        } else if (role === 'master-admin') {
            navigate('/dashboard/master');
        } else {
            navigate('/dashboard/admin');
        }
    };

    return <LoginPage onLogin={handleLogin} onBack={() => navigate('/')} />;
};

const HotspotSimulationRoute: React.FC = () => {
    const { voucherCode } = useParams<{ voucherCode: string }>();
    const navigate = useNavigate();

    return (
        <HotspotSimulationPage
            voucherCode={voucherCode || ''}
            onBack={() => navigate('/dashboard')}
        />
    );
};

// Protected Dashboard Component
const ProtectedDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, userRole } = getStoredAuth();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        clearStoredAuth();
        navigate('/');
    };

    // Get current page from URL
    const getCurrentPage = (): Page => {
        const path = location.pathname;
        if (path.includes('/vouchers')) return 'vouchers';
        if (path.includes('/users')) return 'users';
        if (path.includes('/reports')) return 'reports';
        if (path.includes('/backups')) return 'backups';
        if (path.includes('/mikrotik-ap')) return 'mikrotikAP';
        if (path.includes('/mikrotik')) return 'mikrotik';
        if (path.includes('/archive')) return 'archive';
        if (path.includes('/settings')) return 'settings';
        if (path.includes('/user-access')) return 'userAccess';
        if (path.includes('/access-logs')) return 'accessLogs';
        if (path.includes('/real-time-stats')) return 'realTimeStats';
        if (path.includes('/splash-page')) return 'splashPage';
        if (path.includes('/services')) return 'services';
        if (path.includes('/admin-management')) return 'adminManagement';
        if (path.includes('/help')) return 'helpAndSupport';
        if (path.includes('/integrations')) return 'integrations';
        if (path.includes('/client')) return 'clientDashboard';
        if (path.includes('/master')) return 'clientDashboard';
        return 'dashboard';
    };

    const currentPage = getCurrentPage();

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentPage={currentPage}
                setCurrentPage={(page: Page) => {
                    const routeMap: Record<Page, string> = {
                        dashboard: userRole === 'client' ? '/dashboard/client' : userRole === 'master-admin' ? '/dashboard/master' : '/dashboard/admin',
                        vouchers: '/dashboard/vouchers',
                        users: '/dashboard/users',
                        services: '/dashboard/services',
                        adminManagement: '/dashboard/admin-management',
                        clientDashboard: userRole === 'master-admin' ? '/dashboard/master' : '/dashboard/client',
                        voucherManagement: '/dashboard/vouchers',
                        reports: '/dashboard/reports',
                        backups: '/dashboard/backups',
                        mikrotik: '/dashboard/mikrotik',
                        mikrotikAP: '/dashboard/mikrotik-ap',
                        archive: '/dashboard/archive',
                        settings: '/dashboard/settings',
                        userAccess: '/dashboard/user-access',
                        accessLogs: '/dashboard/access-logs',
                        realTimeStats: '/dashboard/real-time-stats',
                        splashPage: '/dashboard/splash-page',
                        helpAndSupport: '/dashboard/help',
                        integrations: '/dashboard/integrations'
                    };
                    navigate(routeMap[page]);
                }}
                role={userRole}
                onLogout={handleLogout}
            />

            <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    title={pageTitles[currentPage].title}
                    subtitle={pageTitles[currentPage].subtitle}
                    role={userRole}
                />

                <main className="p-4 lg:p-6">
                    <Routes>
                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/vouchers" element={<VoucherManagement />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/services" element={<ServiceManagement />} />
                        <Route path="/admin-management" element={<AdminManagement />} />

                        {/* Client Routes */}
                        <Route path="/client" element={<ClientDashboard />} />
                        <Route path="/master" element={<MasterDashboard />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/backups" element={<BackupPage />} />
                        <Route path="/mikrotik" element={<MikrotikPage />} />
                        <Route path="/mikrotik-ap" element={<MikrotikAPPage />} />
                        <Route path="/archive" element={<ArchivePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/user-access" element={<UserAccessPage />} />
                        <Route path="/access-logs" element={<AccessLogsPage />} />
                        <Route path="/real-time-stats" element={<RealTimeStatsPage />} />
                        <Route path="/splash-page" element={<SplashPageCustomizer />} />
                        <Route path="/help" element={<HelpAndSupportPage />} />
                        <Route path="/integrations" element={<IntegrationsPage />} />

                        {/* Default redirect based on user role */}
                        <Route path="/" element={
                            <Navigate
                                to={userRole === 'client' ? '/dashboard/client' : userRole === 'master-admin' ? '/dashboard/master' : '/dashboard/admin'}
                                replace
                            />
                        } />
                    </Routes>
                </main>
            </div>

            <AICopilot
                setCurrentPage={(page: Page) => {
                    const routeMap: Record<Page, string> = {
                        dashboard: userRole === 'client' ? '/dashboard/client' : userRole === 'master-admin' ? '/dashboard/master' : '/dashboard/admin',
                        vouchers: '/dashboard/vouchers',
                        users: '/dashboard/users',
                        services: '/dashboard/services',
                        adminManagement: '/dashboard/admin-management',
                        clientDashboard: userRole === 'master-admin' ? '/dashboard/master' : '/dashboard/client',
                        voucherManagement: '/dashboard/vouchers',
                        reports: '/dashboard/reports',
                        backups: '/dashboard/backups',
                        mikrotik: '/dashboard/mikrotik',
                        mikrotikAP: '/dashboard/mikrotik-ap',
                        archive: '/dashboard/archive',
                        settings: '/dashboard/settings',
                        userAccess: '/dashboard/user-access',
                        accessLogs: '/dashboard/access-logs',
                        realTimeStats: '/dashboard/real-time-stats',
                        splashPage: '/dashboard/splash-page',
                        helpAndSupport: '/dashboard/help',
                        integrations: '/dashboard/integrations'
                    };
                    navigate(routeMap[page]);
                }}
                currentPage={currentPage}
                role={userRole}
            />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <NotificationsProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPageRoute />} />
                    <Route path="/login" element={<LoginPageRoute />} />
                    <Route path="/hotspot-simulation/:voucherCode" element={<HotspotSimulationRoute />} />

                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard/*" element={<ProtectedDashboard />} />
                </Routes>
            </NotificationsProvider>
        </Router>
    );
};

export default App;