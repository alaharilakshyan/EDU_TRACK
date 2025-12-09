import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { studentAPI } from '../../services/api';
import Heatmap from '../../components/student/Heatmap';
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PencilIcon,
  LinkIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  FireIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student'
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    year: '',
    gpa: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [socialPlatforms, setSocialPlatforms] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    leetcode: '',
    codeforces: '',
    hackerrank: '',
    portfolio: ''
  });
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    let profileData = null;
    
    // Don't try to fetch if user is not available
    if (!user || !user.uid7) {
      console.log('User not available, using fallback data');
      // Use mock data when user is not available
      profileData = {
        fullName: user?.fullName || 'John Doe',
        department: 'Computer Science',
        year: '3rd',
        gpa: '3.8',
        totalActivities: 45,
        certificates: 12
      };
      setProfile(profileData);
      setFormData({
        fullName: profileData.fullName || '',
        department: profileData.department || '',
        year: profileData.year || '',
        gpa: profileData.gpa || ''
      });
      
      // Load profile picture from localStorage
      const savedPicture = localStorage.getItem('profilePicture');
      if (savedPicture) {
        setProfilePictureUrl(savedPicture);
      }
    } else {
      try {
        // Try to fetch from API first
        const response = await studentAPI.getProfile(user.uid7);
        profileData = response.data;
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || '',
          department: profileData.department || '',
          year: profileData.year || '',
          gpa: profileData.gpa || ''
        });
        
        // Load profile picture if exists
        if (profileData && profileData.profilePictureUrl) {
          setProfilePictureUrl(profileData.profilePictureUrl);
        } else {
          const savedPicture = localStorage.getItem('profilePicture');
          if (savedPicture) {
            setProfilePictureUrl(savedPicture);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile from API, using fallback:', error);
        
        // Fallback to localStorage or mock data
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          profileData = JSON.parse(savedProfile);
          setProfile(profileData);
          setFormData({
            fullName: profileData.fullName || '',
            department: profileData.department || '',
            year: profileData.year || '',
            gpa: profileData.gpa || ''
          });
        } else {
          // Mock data for development
          profileData = {
            fullName: user?.fullName || 'John Doe',
            department: 'Computer Science',
            year: '3rd',
            gpa: '3.8',
            totalActivities: 45,
            certificates: 12
          };
          setProfile(profileData);
          setFormData({
            fullName: profileData.fullName || '',
            department: profileData.department || '',
            year: profileData.year || '',
            gpa: profileData.gpa || ''
          });
        }
        
        // Load profile picture from localStorage
        const savedPicture = localStorage.getItem('profilePicture');
        if (savedPicture) {
          setProfilePictureUrl(savedPicture);
        }
      }
    }
    
    // Get certificate count from localStorage
    const savedCertificates = localStorage.getItem('userCertificates');
    const certificatesCount = savedCertificates ? JSON.parse(savedCertificates).length : 0;
    
    // Update profile with certificate count
    if (profileData) {
      const updatedProfile = { ...profileData, certificatesCount };
      setProfile(updatedProfile);
    } else if (profile) {
      // Fallback to current profile state
      const updatedProfile = { ...profile, certificatesCount };
      setProfile(updatedProfile);
    }
    
    setLoading(false);
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setNotification({
          show: true,
          message: 'Profile picture must be less than 5MB',
          type: 'error'
        });
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setProfilePictureUrl(result);
        setProfilePicture(file);
        
        // Save to localStorage
        localStorage.setItem('profilePicture', result);
        
        // Update profile with new picture
        const updatedProfile = { ...profile, profilePictureUrl: result };
        setProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        setNotification({
          show: true,
          message: 'Profile picture updated successfully!',
          type: 'success'
        });
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Only try API if user is available
      if (user && user.uid7) {
        await studentAPI.updateProfile(user.uid7, formData);
      }
      
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
      
      // Also save to localStorage as backup
      const updatedProfile = { ...profile, ...formData };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Dispatch event to notify other components (Dashboard)
      window.dispatchEvent(new CustomEvent('profileUpdate', { 
        detail: updatedProfile 
      }));
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Profile updated successfully!',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile via API, saving locally:', error);
      
      // Save to localStorage as fallback
      const updatedProfile = { ...profile, ...formData };
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setEditing(false);
      
      // Dispatch event to notify other components (Dashboard)
      window.dispatchEvent(new CustomEvent('profileUpdate', { 
        detail: updatedProfile 
      }));
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Profile saved locally!',
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLinkedAccountChange = (platform, value) => {
    setSocialPlatforms(prev => ({
      ...prev,
      [platform]: value
    }));
    
    // Update formData as well
    setFormData(prev => ({
      ...prev,
      linkedAccounts: {
        ...prev.linkedAccounts,
        [platform]: value
      }
    }));
  };

  const fetchPlatformData = async (platform, url) => {
    if (!url) return;
    
    try {
      // This would typically call your backend API which then fetches from the actual platforms
      // For now, we'll simulate with mock data
      const mockData = {
        github: {
          contributions: Array.from({ length: 365 }, (_, i) => ({
            date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10)
          })),
          totalContributions: Math.floor(Math.random() * 1000) + 100,
          streak: Math.floor(Math.random() * 30) + 1
        },
        leetcode: {
          problemsSolved: Math.floor(Math.random() * 500) + 50,
          totalSubmissions: Math.floor(Math.random() * 1000) + 200,
          acceptanceRate: Math.floor(Math.random() * 30) + 60,
          submissions: Array.from({ length: 365 }, (_, i) => ({
            date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 5)
          }))
        },
        codeforces: {
          contests: Math.floor(Math.random() * 50) + 10,
          rating: Math.floor(Math.random() * 1000) + 1200,
          submissions: Array.from({ length: 365 }, (_, i) => ({
            date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 3)
          }))
        },
        hackerrank: {
          certificates: Math.floor(Math.random() * 10) + 1,
          problemsSolved: Math.floor(Math.random() * 200) + 20,
          submissions: Array.from({ length: 365 }, (_, i) => ({
            date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 4)
          }))
        }
      };

      const platformData = mockData[platform];
      if (platformData) {
        // Store the fetched data
        localStorage.setItem(`${platform}Data`, JSON.stringify(platformData));
        
        // Show notification
        setNotification({
          show: true,
          message: `Successfully fetched ${platform} data!`,
          type: 'success'
        });
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
        
        // Update heatmap data (this would typically update a global state or context)
        window.dispatchEvent(new CustomEvent('heatmapUpdate', { 
          detail: { platform, data: platformData } 
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch ${platform} data:`, error);
      setNotification({
        show: true,
        message: `Failed to fetch ${platform} data. Please check the URL.`,
        type: 'error'
      });
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleLinkAccount = (platform) => {
    const url = socialPlatforms[platform];
    if (url) {
      fetchPlatformData(platform, url);
    } else {
      setNotification({
        show: true,
        message: `Please enter a valid ${platform} profile URL`,
        type: 'error'
      });
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'heatmap', name: 'Activity Heatmap', icon: ChartBarIcon },
    { id: 'accounts', name: 'Linked Accounts', icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link 
            to="/app/dashboard"
            className="glass rounded-xl px-4 py-2 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
          >
            <HomeIcon className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Back to Dashboard</span>
          </Link>
        </div>
        
        {/* Profile Header */}
        <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-md mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative group">
                {profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt="Profile" 
                    className="h-24 w-24 rounded-full object-cover shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-4 border-white/50"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    {profile?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 border-2 border-white/50 cursor-pointer">
                  <PencilIcon className="h-5 w-5 text-indigo-600" />
                  <input 
                    type="file" 
                    onChange={handleProfilePictureUpload}
                    className="hidden" 
                    accept="image/*"
                  />
                </label>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {profile?.fullName || 'Student Name'}
                </h1>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <div className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    University ID: {user?.uid7 || 'UID2024001'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {profile?.department || 'Computer Science'}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="glass rounded-xl px-6 py-3 flex items-center space-x-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
            >
              <PencilIcon className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">{editing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

      {/* Tabs */}
      <div className="glass rounded-2xl shadow-xl backdrop-blur-md mb-6">
        <nav className="flex space-x-8 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="glass rounded-2xl shadow-xl backdrop-blur-md">
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{profile?.fullName || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{profile?.department || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">{profile?.year || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GPA:</span>
                        <span className="font-medium">{profile?.gpa || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">University ID:</span>
                        <span className="font-medium">{user?.uid7 || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Activities:</span>
                        <span className="font-medium">{profile?.totalActivities || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certificates:</span>
                        <span className="font-medium">{profile?.certificates || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'heatmap' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Activity Heatmap</h3>
              <div className="glass rounded-xl p-6 backdrop-blur-md">
                <div className="text-center py-8">
                  <FireIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-gray-600">Activity heatmap will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Shows your coding activity across all platforms</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Linked Accounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(socialPlatforms).map(([platform, url]) => (
                  <div key={platform} className="glass rounded-xl p-4 backdrop-blur-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {platform === 'github' ? 'GitHub' :
                       platform === 'linkedin' ? 'LinkedIn' :
                       platform === 'twitter' ? 'Twitter' :
                       platform === 'leetcode' ? 'LeetCode' :
                       platform === 'codeforces' ? 'Codeforces' :
                       platform === 'hackerrank' ? 'HackerRank' :
                       platform === 'portfolio' ? 'Portfolio' : platform}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleLinkedAccountChange(platform, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={`Enter your ${platform} profile URL`}
                      />
                      <button 
                        onClick={() => handleLinkAccount(platform)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span>Link & Fetch</span>
                      </button>
                    </div>
                    {url && (
                      <div className="mt-2 text-xs text-gray-500">
                        ✓ Ready to fetch data from {platform}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
