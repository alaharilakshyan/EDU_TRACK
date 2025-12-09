import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useClerkUser } from '../../contexts/ClerkContext';
import { useNotifications } from '../../contexts/NotificationContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useClerkUser();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        userRole={userData?.role}
        currentPath={location.pathname}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        <Header
          onMenuClick={toggleSidebar}
          unreadCount={unreadCount}
        />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
