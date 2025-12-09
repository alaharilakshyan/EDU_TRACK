import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { studentAPI } from '../../services/api';
import {
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: ''
  });
  const [blogPosts, setBlogPosts] = useState(() => {
    const savedPosts = localStorage.getItem('userBlogPosts');
    if (savedPosts) {
      return JSON.parse(savedPosts);
    }
    return [
      {
        id: 1,
        title: 'My Journey into Web Development',
        content: 'Sharing my experience learning React and building my first full-stack application...',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        views: 45,
        comments: 12
      },
      {
        id: 2,
        title: 'Tips for Technical Interviews',
        content: 'Based on my recent interview experiences, here are some tips that helped me succeed...',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        views: 32,
        comments: 8
      }
    ];
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  // Listen for profile updates from Profile page
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchDashboardData();
    };

    window.addEventListener('profileUpdate', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdate', handleProfileUpdate);
  }, []);

  // Also listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userProfile' || e.key === 'userReports' || e.key === 'userCertificates' || e.key === 'userInternships' || e.key === 'githubData') {
        fetchDashboardData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also check for changes every 2 seconds (for same-tab updates)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Save blog posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userBlogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      id: blogPosts.length + 1,
      title: postFormData.title,
      content: postFormData.content,
      date: new Date().toISOString(),
      views: 0,
      comments: 0
    };

    setBlogPosts([newPost, ...blogPosts]);
    setPostFormData({ title: '', content: '' });
    setShowPostForm(false);
  };

  const handlePostInputChange = (field, value) => {
    setPostFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to get profile from localStorage first (same as Profile page)
      const savedProfile = localStorage.getItem('userProfile');
      let profileData;
      
      if (savedProfile) {
        profileData = JSON.parse(savedProfile);
      } else {
        // Fallback to user data
        profileData = {
          fullName: user?.fullName || 'Student',
          department: 'Computer Science',
          gpa: '3.8'
        };
      }
      
      // Get actual counts from localStorage
      const savedReports = localStorage.getItem('userReports');
      const reportsCount = savedReports ? JSON.parse(savedReports).length : 0;
      
      const savedCertificates = localStorage.getItem('userCertificates');
      const certificatesCount = savedCertificates ? JSON.parse(savedCertificates).length : 0;
      
      const savedInternships = localStorage.getItem('userInternships');
      const internshipsCount = savedInternships ? JSON.parse(savedInternships).length : 0;
      
      // Get GitHub data if available
      const githubData = localStorage.getItem('githubData');
      let githubContributions = 0;
      if (githubData) {
        const parsed = JSON.parse(githubData);
        githubContributions = parsed.totalContributions || 0;
      }
      
      const mockData = {
        profile: {
          name: profileData.fullName || user?.fullName || 'Student',
          email: user?.primaryEmailAddress?.emailAddress || 'student@university.edu',
          department: profileData.department || 'Computer Science',
          gpa: profileData.gpa || '3.8',
          totalActivities: githubContributions,
          certificates: certificatesCount,
          reports: reportsCount,
          internships: internshipsCount
        },
        recentActivity: [
          { id: 1, type: 'certificate', title: 'Web Development Certificate', date: '2 days ago', points: 50 },
          { id: 2, type: 'activity', title: 'Hackathon Participation', date: '1 week ago', points: 30 },
          { id: 3, type: 'workshop', title: 'AI Workshop', date: '2 weeks ago', points: 20 }
        ],
        upcomingEvents: [
          { id: 1, title: 'Tech Summit 2024', date: 'Dec 15, 2024', type: 'conference' },
          { id: 2, title: 'Coding Competition', date: 'Dec 20, 2024', type: 'competition' },
          { id: 3, title: 'Career Fair', date: 'Jan 5, 2025', type: 'career' }
        ]
      };

      setProfile(mockData.profile);
      setRecentActivity(mockData.recentActivity);
      setUpcomingEvents(mockData.upcomingEvents);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 shadow-lg animate-pulse-slow mb-4">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h1>
          <Link 
            to="/login" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      name: 'Total Activities',
      value: profile?.totalActivities || 0,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      link: '/app/heatmap'
    },
    {
      name: 'Certificates',
      value: profile?.certificates || 0,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      link: '/app/certificates'
    },
    {
      name: 'Reports',
      value: profile?.reports || 0,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
      link: '/app/reports'
    },
    {
      name: 'Internships',
      value: profile?.internships || 0,
      icon: BriefcaseIcon,
      color: 'bg-purple-500',
      link: '/app/internships'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <div className="glass rounded-2xl shadow-xl p-8 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {profile?.name || user?.fullName || 'Student'}!
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Here's what's happening with your student activities today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{profile?.gpa || '3.8'}</div>
                  <div className="text-sm text-gray-500">GPA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{profile?.year || '3rd'}</div>
                  <div className="text-sm text-gray-500">Year</div>
                </div>
                <Link 
                  to="/app/profile"
                  className="glass rounded-xl px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((stat, index) => (
            <Link
              key={stat.name}
              to={stat.link}
              className="group glass rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl backdrop-blur-md animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 bg-gradient-to-br ${stat.color.replace('bg-', 'from-')} to-${stat.color.replace('bg-', '')}-600 rounded-xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {stat.name}
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </dd>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color} rounded-full animate-pulse-slow`} style={{width: '70%'}}></div>
              </div>
            </Link>
          ))}
        </div>

      {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="glass rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <ChartBarIcon className="h-8 w-8 mr-3" />
                  Recent Activity
                </h3>
                <p className="text-blue-100 mt-2">Your latest achievements and activities</p>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={activity.id} 
                        className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
                        style={{animationDelay: `${0.5 + index * 0.1}s`}}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${
                              activity.type === 'certificate' ? 'from-green-400 to-green-600' :
                              activity.type === 'activity' ? 'from-blue-400 to-blue-600' :
                              'from-purple-400 to-purple-600'
                            } flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                              {
                                activity.type === 'certificate' ? 
                                <AcademicCapIcon className="h-6 w-6 text-white" /> :
                                activity.type === 'activity' ?
                                <ChartBarIcon className="h-6 w-6 text-white" /> :
                                <CalendarIcon className="h-6 w-6 text-white" />
                              }
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                                +{activity.points} points
                              </span>
                              {activity.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <ChartBarIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No recent activity to show</p>
                    <p className="text-gray-400 text-sm mt-2">Start participating in activities to see them here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-1 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="glass rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2" />
                  Upcoming Events
                </h3>
                <p className="text-purple-100 text-sm mt-1">Don't miss these opportunities</p>
              </div>
              <div className="p-4">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div 
                        key={event.id} 
                        className="group p-3 rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in border border-purple-100"
                        style={{animationDelay: `${0.7 + index * 0.1}s`}}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                              <CalendarIcon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {event.date}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
                      <CalendarIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <p className="text-gray-500">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <div className="glass rounded-2xl shadow-xl backdrop-blur-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/app/heatmap" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 border border-blue-100"
              >
                <ChartBarIcon className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">Heatmap</span>
              </Link>
              <Link 
                to="/app/certificates" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 border border-green-100"
              >
                <AcademicCapIcon className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300">Certificates</span>
              </Link>
              <Link 
                to="/app/reports" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 border border-yellow-100"
              >
                <DocumentTextIcon className="h-8 w-8 text-yellow-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors duration-300">Reports</span>
              </Link>
              <Link 
                to="/app/internships" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 border border-purple-100"
              >
                <BriefcaseIcon className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-300">Internships</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <div className="mt-8 animate-fade-in" style={{animationDelay: '0.9s'}}>
          <div className="glass rounded-2xl shadow-xl backdrop-blur-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <PencilSquareIcon className="h-6 w-6 text-indigo-600 mr-2" />
                Student Blog
              </h3>
              <button 
                onClick={() => setShowPostForm(!showPostForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <PencilSquareIcon className="h-4 w-4" />
                <span>Write Post</span>
              </button>
            </div>
            
            {showPostForm && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a New Post</h4>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={postFormData.title}
                      onChange={(e) => handlePostInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your post title..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={postFormData.content}
                      onChange={(e) => handlePostInputChange('content', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="4"
                      placeholder="Share your thoughts..."
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Publish Post
                    </button>
                    <button type="button" onClick={() => setShowPostForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">{post.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      Posted {new Date(post.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {post.views} views
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments} comments
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
