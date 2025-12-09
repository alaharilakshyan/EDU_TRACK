import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: (data) => api.post('/auth/logout', data),
  refresh: (data) => api.post('/auth/refresh', data),
  getMe: () => api.get('/auth/me'),
};

// Student API
export const studentAPI = {
  getProfile: (uid7) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.get(`/students/${uid7}/profile`);
  },
  updateProfile: (uid7, data) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.put(`/students/${uid7}/profile`, data);
  },
  uploadCertificate: (uid7, formData) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.post(`/students/${uid7}/upload/certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadReport: (uid7, formData) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.post(`/students/${uid7}/upload/report`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadInternship: (uid7, data) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.post(`/students/${uid7}/upload/internship`, data);
  },
  uploadCV: (uid7, formData) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.post(`/students/${uid7}/cv`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  scoreCV: (uid7, data) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.post(`/students/${uid7}/cv/score`, data);
  },
  getCVVersions: (uid7) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.get(`/students/${uid7}/cv/versions`);
  },
  getHeatmap: (uid7, params) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.get(`/activity/${uid7}/heatmap`, { params });
  },
  getEvents: (params) => api.get('/events', { params }),
  getNotifications: (uid7, params) => {
    if (!uid7 || uid7 === 'undefined') {
      return Promise.reject(new Error('Invalid user ID'));
    }
    return api.get(`/notifications/${uid7}`, { params });
  },
};

// Faculty API
export const facultyAPI = {
  getStudents: (uid7, params) => api.get(`/faculty/${uid7}/students`, { params }),
  getPendingApprovals: (uid7, params) => api.get(`/faculty/${uid7}/pending-approvals`, { params }),
  approveItem: (uid7, itemId, data) => api.post(`/faculty/${uid7}/approve/${itemId}`, data),
  rejectItem: (uid7, itemId, data) => api.post(`/faculty/${uid7}/reject/${itemId}`, data),
  getStudentAnalytics: (uid7, studentUid7) => api.get(`/faculty/${uid7}/student/${studentUid7}/analytics`),
  createEvent: (uid7, data) => api.post(`/faculty/${uid7}/events`, data),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/create-user', data),
  updateUser: (uid7, data) => api.put(`/admin/users/${uid7}`, data),
  deleteUser: (uid7) => api.delete(`/admin/users/${uid7}`),
  assignRole: (data) => api.post('/admin/assign-role', data),
  getUniversities: (params) => api.get('/admin/universities', { params }),
  createUniversity: (data) => api.post('/admin/universities', data),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
};

// University API
export const universityAPI = {
  search: (params) => api.get('/universities', { params }),
};

// Notification API
export const notificationAPI = {
  getNotifications: (uid7, params) => api.get(`/notifications/${uid7}`, { params }),
  send: (data) => api.post('/notifications/send', data),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
};

// Blog API
export const blogAPI = {
  getPosts: (params) => api.get('/blog/posts', { params }),
  createPost: (data) => api.post('/blog/posts', data),
};

export default api;
