import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="glass shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 shadow-lg animate-pulse-slow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Student Activity Platform</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign Up
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
              <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                <span className="block mb-2">Welcome to the</span>
                <span className="block text-indigo-600 animate-gradient">Student Activity Platform</span>
              </h1>
              <p className="mt-8 max-w-3xl mx-auto text-lg text-gray-600 sm:text-xl md:mt-10 md:text-2xl leading-relaxed">
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

          {/* Features Grid */}
          <div className="mt-24">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need to succeed</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                Our platform provides comprehensive tools for students, faculty, and administrators.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Student Features */}
              <div className="glass rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
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
              <div className="glass rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
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
              <div className="glass rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
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
    </div>
  );
};

export default Landing;
