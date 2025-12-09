import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  BookOpenIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const navigation = {
  student: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Activity Heatmap', href: '/heatmap', icon: ChartBarIcon },
    { name: 'Certificates', href: '/certificates', icon: AcademicCapIcon },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
    { name: 'Internships', href: '/internships', icon: BriefcaseIcon },
    { name: 'Placement Portal', href: '/placement', icon: BriefcaseIcon },
    { name: 'Events', href: '/events', icon: CalendarIcon },
    { name: 'Blog', href: '/blog', icon: BookOpenIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ],
  faculty: [
    { name: 'Dashboard', href: '/faculty/dashboard', icon: HomeIcon },
    { name: 'Students', href: '/faculty/students', icon: UserGroupIcon },
    { name: 'Pending Approvals', href: '/faculty/approvals', icon: ClipboardDocumentListIcon },
    { name: 'Events', href: '/events', icon: CalendarIcon },
    { name: 'Blog', href: '/blog', icon: BookOpenIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Universities', href: '/admin/universities', icon: BuildingOfficeIcon },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheckIcon },
    { name: 'Events', href: '/events', icon: CalendarIcon },
    { name: 'Blog', href: '/blog', icon: BookOpenIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ]
};

const Sidebar = ({ isOpen, onClose, userRole, currentPath }) => {
  const location = useLocation();
  const navItems = navigation[userRole] || navigation.student;

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Student Platform</h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col bg-white border-r">
          {/* Desktop header */}
          <div className="flex h-16 items-center px-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Student Platform</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
