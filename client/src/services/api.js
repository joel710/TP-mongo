import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const studentService = {
  getAll: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  search: (query) => api.get(`/students/search?q=${query}`),
  getReport: (id) => api.get(`/students/${id}/report`),
};

export const courseService = {
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  enroll: (courseId, studentId) => api.post(`/courses/${courseId}/enroll/${studentId}`),
  getStudents: (courseId) => api.get(`/courses/${courseId}/students`),
  addGrade: (courseId, studentId, score) => api.post(`/courses/${courseId}/students/${studentId}/grade`, { score }),
};

export default api;
