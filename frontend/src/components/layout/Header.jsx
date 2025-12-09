import React, { useState, useEffect } from 'react';
import { Bars3Icon, BellIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { UserButton } from '@clerk/clerk-react';
import { useClerkUser } from '../../contexts/ClerkContext';

const Header = ({ onMenuClick, unreadCount }) => {
  const { userData } = useClerkUser();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-white', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-white', 'text-gray-900');
      document.body.classList.remove('bg-gray-900', 'text-white');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden rounded-md p-2 text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-200"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Search bar (desktop only) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search..."
                type="search"
                name="search"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Dark theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200">
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
            )}
          </button>

          {/* User menu - Clerk UserButton */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{userData?.fullName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userData?.role}</div>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonOuter: "hover:opacity-80 transition-opacity"
                }
              }}
              afterSignOutUrl="/"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
