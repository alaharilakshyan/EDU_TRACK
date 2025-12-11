import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hyperspeed from '../components/Hyperspeed';

const Landing = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hyperspeed Background */}
      <div className="fixed inset-0 z-0">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xFFFFFF,
              brokenLines: 0xFFFFFF,
              leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
              rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
              sticks: 0x03B3C3,
            }
          }}
        />
      </div>

      {/* Semi-transparent overlay for better text readability */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 min-h-screen">

      {/* Header */}
      <header className="bg-black bg-opacity-80 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 shadow-lg animate-pulse-slow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">Student Activity Platform</span>
            </div>
            <div className="flex space-x-2">
              <Link
                to="/login/student"
                className="text-white hover:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white hover:bg-opacity-10 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Student</span>
              </Link>
              <Link
                to="/login/faculty"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Faculty</span>
              </Link>
              <Link
                to="/login/admin"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl">
                <span className="block mb-2">Welcome to the</span>
                <span className="block text-indigo-400 animate-gradient">Student Activity Platform</span>
              </h1>
              <p className="mt-8 max-w-3xl mx-auto text-lg text-gray-200 sm:text-xl md:mt-10 md:text-2xl leading-relaxed">
                Track your academic journey, manage activities, earn certificates, and connect with opportunities all in one place.
              </p>
              <div className="mt-12 max-w-lg mx-auto sm:flex sm:justify-center md:mt-16 space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-4 border-2 border-indigo-300 text-lg font-semibold rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Quick Access</h2>
              <p className="text-lg text-gray-300 mb-8">Select your role for tailored access and features</p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Faculty Card */}
              <Link
                to="/login/faculty"
                className="group bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-700 hover:border-orange-500 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 013 12a9.001 9.001 0 019-9 9.001 9.001 0 019 9.255z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Faculty</h3>
                  <p className="text-gray-300">Staff access portal</p>
                </div>
              </Link>

              {/* Admin Card */}
              <Link
                to="/login/admin"
                className="group bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-700 hover:border-green-500 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-300">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Admin</h3>
                  <p className="text-gray-300">System administration</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-white mb-4">Everything you need to succeed</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
                Our platform provides comprehensive tools for students, faculty, and administrators.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Student Features */}
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Students</h3>
                <p className="text-gray-600 mb-6 text-lg">Track activities, earn certificates, manage internships, and build your academic profile.</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Activity Tracking
                  </li>
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Certificate Management
                  </li>
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Internship Portal
                  </li>
                </ul>
              </div>

              {/* Faculty Features */}
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Faculty</h3>
                <p className="text-gray-600 mb-6 text-lg">Monitor student progress, approve activities, and provide guidance through analytics.</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Student Analytics
                  </li>
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Activity Approval
                  </li>
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Event Management
                  </li>
                </ul>
              </div>

              {/* Admin Features */}
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Admins</h3>
                <p className="text-gray-600 mb-6 text-lg">Manage users, universities, and system settings with comprehensive admin tools.</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    User Management
                  </li>
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    System Analytics
                  </li>
                  <li className="flex items-center text-base">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Audit Logs
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 glass rounded-3xl shadow-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-900">Trusted by educational institutions</h2>
              <p className="mt-4 text-xl text-gray-600">Join thousands of students and faculty already using our platform</p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">10+</div>
                <div className="text-lg text-gray-600">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-lg text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-lg text-gray-600">Faculty Members</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">1000+</div>
                <div className="text-lg text-gray-600">Activities Tracked</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold group-hover:text-indigo-200 transition-colors">Student Activity Platform</h3>
              </Link>
              <p className="text-gray-300 mb-4 max-w-md">
                Empowering students to track their academic journey, manage activities, and build comprehensive portfolios for future success.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/login/student" className="text-gray-300 hover:text-white transition-colors block py-1">Student Portal</Link></li>
                <li><Link to="/login/faculty" className="text-gray-300 hover:text-white transition-colors block py-1">Faculty Portal</Link></li>
                <li><Link to="/login/admin" className="text-gray-300 hover:text-white transition-colors block py-1">Admin Portal</Link></li>
                <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors block py-1">Get Started</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors block py-1">About Us</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors block py-1">FAQ</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors block py-1">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors block py-1">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors block py-1">
                © 2024 Student Activity Platform. All rights reserved.
              </Link>
              <Link to="/" className="text-gray-400 text-sm mt-2 md:mt-0 hover:text-white transition-colors block py-1">
                Built with ❤️ for educational institutions
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 z-40"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      </div>
    </div>
  );
};

export default Landing;
