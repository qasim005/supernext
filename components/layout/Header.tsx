import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, BellIcon, SuperNextLogo } from '../icons/IconComponents';
import { UserRole } from '../../App';
import { useNotificationsContext } from '../../context/NotificationsContext';
import { NotificationsPanel } from './NotificationsPanel';
import { useNavigate } from 'react-router-dom';


interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
  subtitle: string;
  role: UserRole;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, title, subtitle, role }) => {
  const { unreadCount } = useNotificationsContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()

  // Close notifications panel on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!notificationRef.current) return;
      if (
        !showNotifications ||
        notificationRef.current.contains(target as Node)
      ) return;
      setShowNotifications(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white dark:bg-gray-800 drop-shadow-sm">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-sm md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-40 block rounded-sm border border-gray-300 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <SuperNextLogo className="h-8 w-6" />
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              SuperNext Cloud
            </h1>
          </div>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
          </div>
          <div className="relative">
            <button className="flex items-center gap-4">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  {role === 'admin' ? 'John Doe' : 'Client User'}
                </span>
                <span className="block text-xs capitalize">{role}</span>
              </span>
              <img
                src="https://picsum.photos/40/40"
                alt="User"
                className="h-10 w-10 rounded-full"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;