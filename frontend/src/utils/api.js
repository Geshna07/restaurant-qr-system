// This file handles ALL API calls to our backend
// Instead of writing fetch() everywhere, we use this helper

import axios from 'axios';

// Base URL of our backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// INTERCEPTOR — runs before every request
// Automatically adds the login token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR — runs after every response
// If token expired, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────
// AUTH APIs
// ─────────────────────────────────────────
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  me: () => 
    api.get('/auth/me')
};

// ─────────────────────────────────────────
// MENU APIs
// ─────────────────────────────────────────
export const menuAPI = {
  getMenu: () => 
    api.get('/menu'),
  
  getAllMenu: () => 
    api.get('/menu/all'),
  
  addItem: (item) => 
    api.post('/menu/items', item),
  
  updateItem: (id, item) => 
    api.put(`/menu/items/${id}`, item),
  
  deleteItem: (id) => 
    api.delete(`/menu/items/${id}`)
};

// ─────────────────────────────────────────
// ORDER APIs
// ─────────────────────────────────────────
export const orderAPI = {
  placeOrder: (orderData) => 
    api.post('/orders', orderData),
  
  getOrders: () => 
    api.get('/orders'),
  
  getOrder: (id) => 
    api.get(`/orders/${id}`),
  
  updateStatus: (id, status) => 
    api.put(`/orders/${id}/status`, { status })
};

// ─────────────────────────────────────────
// ADMIN APIs
// ─────────────────────────────────────────
export const adminAPI = {
  getStaff: () => 
    api.get('/admin/staff'),
  
  addStaff: (staffData) => 
    api.post('/admin/staff', staffData),
  
  toggleStaff: (id) => 
    api.put(`/admin/staff/${id}/toggle`),
  
  getAnalytics: () => 
    api.get('/admin/analytics'),
  
  getSettings: () => 
    api.get('/admin/settings'),
  
  updateSettings: (settings) => 
    api.put('/admin/settings', settings),
  
  getTables: () => 
    api.get('/admin/tables')
};

export default api;