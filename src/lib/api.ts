import axios from 'axios';

// const API_URL =
  const API_URL = import.meta.env.VITE_API_URL || 'https://gym-web-backend-oxro.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/updatepassword', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getMemberStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

// Classes API
export const classesAPI = {
  getAllClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getClass: async (id: string) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  createClass: async (classData: any) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },

  updateClass: async (id: string, classData: any) => {
    const response = await api.put(`/classes/${id}`, classData);
    return response.data;
  },

  deleteClass: async (id: string) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  enrollClass: async (id: string) => {
    const response = await api.post(`/classes/${id}/enroll`);
    return response.data;
  },

  unenrollClass: async (id: string) => {
    const response = await api.delete(`/classes/${id}/unenroll`);
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  checkIn: async (classId?: string, notes?: string) => {
    const response = await api.post('/attendance/checkin', { classId, notes });
    return response.data;
  },

  checkOut: async (id: string) => {
    const response = await api.put(`/attendance/${id}/checkout`);
    return response.data;
  },

  getUserAttendance: async () => {
    const response = await api.get('/attendance/my-attendance');
    return response.data;
  },

  getAllAttendance: async () => {
    const response = await api.get('/attendance/all');
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createPayment: async (paymentData: any) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  getUserPayments: async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },

  getAllPayments: async () => {
    const response = await api.get('/payments/all');
    return response.data;
  },

  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },
};

// Workouts API
export const workoutsAPI = {
  getUserWorkouts: async () => {
    const response = await api.get('/workouts/my-workouts');
    return response.data;
  },

  createWorkout: async (workoutData: any) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  updateWorkout: async (id: string, workoutData: any) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },

  completeWorkout: async (id: string) => {
    const response = await api.post(`/workouts/${id}/complete`);
    return response.data;
  },
};

// Trainers API
export const trainersAPI = {
  getAllTrainers: async () => {
    const response = await api.get('/trainers');
    return response.data;
  },

  getTrainer: async (id: string) => {
    const response = await api.get(`/trainers/${id}`);
    return response.data;
  },

  updateTrainerProfile: async (id: string, trainerData: any) => {
    const response = await api.put(`/trainers/${id}`, trainerData);
    return response.data;
  },
};

export default api;
