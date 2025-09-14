import React, { useEffect, useRef } from 'react';
import { HomeIcon, TicketIcon, UsersIcon, LogoutIcon, FileDownIcon, DatabaseIcon, RouterIcon, ArchiveIcon, SettingsIcon, ShieldIcon, ZapIcon, PaintBrushIcon, ServerIcon, ShieldAlertIcon, SuperNextLogo, LifeBuoyIcon, LinkIcon } from '../icons/IconComponents';
import { Page, UserRole } from '../../App';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage, role, onLogout }) => {
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const NavLink: React.FC<{page: Page, icon: React.ReactNode, text: string}> = ({ page, icon, text }) => {
    const isActive = currentPage === page;
    const baseClasses = "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out w-full text-left";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";
    
    return (
        <li>
            <button onClick={() => setCurrentPage(page)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                {icon}
                {text}
            </button>
        </li>
    );
  };
  
  const AdminMenu = () => (
    <>
      <NavLink page="dashboard" icon={<HomeIcon />} text="Dashboard" />
      <NavLink page="vouchers" icon={<TicketIcon />} text="Voucher Management" />
      <NavLink page="users" icon={<UsersIcon />} text="Clients" />
      <NavLink page="services" icon={<ServerIcon />} text="Services" />
      {role === 'master-admin' && <NavLink page="adminManagement" icon={<ShieldAlertIcon />} text="Admin Management" />}
    </>
  );

  const ClientMenu = () => (
    <>
        <NavLink page="clientDashboard" icon={<HomeIcon />} text="Dashboard" />
        <NavLink page="voucherManagement" icon={<TicketIcon />} text="Voucher Management" />
        <NavLink page="realTimeStats" icon={<ZapIcon />} text="Real-time Stats" />
        <NavLink page="reports" icon={<FileDownIcon />} text="Reports" />
        <NavLink page="splashPage" icon={<PaintBrushIcon />} text="Splash Page" />
        <NavLink page="mikrotik" icon={<RouterIcon />} text="MikroTik NAS" />
        <NavLink page="userAccess" icon={<UsersIcon />} text="User Access" />
        <NavLink page="accessLogs" icon={<ShieldIcon />} text="Access Logs" />
        <NavLink page="archive" icon={<ArchiveIcon />} text="Archive" />
        <NavLink page="settings" icon={<SettingsIcon />} text="Settings" />
        <NavLink page="integrations" icon={<LinkIcon />} text="Integrations" />
        <NavLink page="helpAndSupport" icon={<LifeBuoyIcon />} text="Help & Support" />
    </>
  );


  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-y-hidden bg-gray-800 text-gray-300 duration-300 ease-linear dark:bg-gray-900 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <a href="/" className="flex items-center gap-2">
            <SuperNextLogo className="h-10 w-8" />
            <span className="text-2xl font-bold text-white">SuperNext Cloud</span>
        </a>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg className="fill-current" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" />
          </svg>
        </button>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400">MENU</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {role === 'client' ? <ClientMenu /> : <AdminMenu />}
              <li><button onClick={onLogout} className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-300 duration-300 ease-in-out hover:bg-gray-700 hover:text-white w-full"><LogoutIcon />Sign Out</button></li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;