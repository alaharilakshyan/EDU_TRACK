import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClerkUser } from '../../contexts/ClerkContext';

const AdminDashboard = () => {
  const { userData } = useClerkUser();
  const [stats, setStats] = useState({
    users: { total: 0, students: 0, faculty: 0, admins: 0 },
    universities: 0,
    activities: { certificates: 0, reports: 0, internships: 0, pendingApprovals: 0 },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      setTimeout(() => {
        setStats({
          users: { total: 150, students: 120, faculty: 25, admins: 5 },
          universities: 10,
          activities: { certificates: 450, reports: 320, internships: 180, pendingApprovals: 25 },
          recentActivity: [
            { action: 'login', user: userData?.email || 'admin@studentplatform.com', timestamp: new Date() },
            { action: 'user_created', user: 'faculty@demo.edu', timestamp: new Date(Date.now() - 3600000) },
            { action: 'certificate_approved', user: userData?.email || 'admin@studentplatform.com', timestamp: new Date(Date.now() - 7200000) }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend, link }) => (
    <Link to={link || '#'} className="transform transition-all duration-300 hover:scale-105">
      <div className={`${color} rounded-xl shadow-lg p-6 h-full`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
              </p>
            )}
          </div>
          <div className="bg-white/20 rounded-full p-3">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening across your platform.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12}
          link="/app/admin/users"
        />
        <StatCard
          title="Students"
          value={stats.users.students}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={8}
        />
        <StatCard
          title="Faculty"
          value={stats.users.faculty}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={5}
        />
        <StatCard
          title="Universities"
          value={stats.universities}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          trend={15}
          link="/app/admin/universities"
        />
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Certificates"
          value={stats.activities.certificates}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
          color="bg-gradient-to-r from-cyan-500 to-cyan-600"
          trend={20}
        />
        <StatCard
          title="Reports"
          value={stats.activities.reports}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m0 0V9a2 2 0 012-2h8a2 2 0 012 2v6m0 0a2 2 0 002 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="bg-gradient-to-r from-pink-500 to-pink-600"
          trend={-5}
        />
        <StatCard
          title="Internships"
          value={stats.activities.internships}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          trend={18}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.activities.pendingApprovals}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-gradient-to-r from-red-500 to-red-600"
          trend={10}
          link="/app/admin/approvals"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 rounded-full p-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/app/admin/users" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              Manage Users
            </Link>
            <Link to="/app/admin/universities" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              Manage Universities
            </Link>
            <Link to="/app/admin/audit-logs" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              View Audit Logs
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Platform Growth</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Monthly Active Users</span>
              <span className="font-bold">142</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">New Registrations</span>
              <span className="font-bold">+28</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Activities Completed</span>
              <span className="font-bold">950</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
