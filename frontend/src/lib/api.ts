import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const scheduleApi = {
  getAll: () => api.get('/schedules'),
  getById: (id: string) => api.get(`/schedules/${id}`),
  create: (data: any) => api.post('/schedules', data),
  update: (id: string, data: any) => api.put(`/schedules/${id}`, data),
  delete: (id: string) => api.delete(`/schedules/${id}`),
  activate: (id: string) => api.post(`/schedules/${id}/activate`),
  deactivate: (id: string) => api.post(`/schedules/${id}/deactivate`),
};

export const analyticsApi = {
  getAllWithSuccessRates: () => api.get('/analytics/schedules'),
  search: (term: string) => api.get(`/analytics/schedules/search?term=${term}`),
  getSuccessRateStatistics: () => api.get('/analytics/success-rates'),
  getScheduleSuccessRate: (id: string) => api.get(`/analytics/schedules/${id}/success-rate`),
};

export const executionHistoryApi = {
  getAll: () => api.get('/execution-histories'),
  getByScheduleId: (scheduleId: string) => api.get(`/execution-histories/schedule/${scheduleId}`),
  getById: (id: string) => api.get(`/execution-histories/${id}`),
};
