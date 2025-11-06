import api from './api';

export const authService = {
  login: async (organizerId, password) => {
    const response = await api.post('/auth/login', { organizerId, password });
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

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getStats: () => api.get('/events/stats')
};

export const zoneService = {
  getAll: () => api.get('/zones'),
  getByEvent: (eventId) => api.get(`/zones/event/${eventId}`),
  getById: (id) => api.get(`/zones/${id}`),
  create: (data) => api.post('/zones', data),
  update: (id, data) => api.put(`/zones/${id}`, data),
  updateCrowdCount: (id, currentCount) => api.put(`/zones/${id}/crowd`, { currentCount }),
  delete: (id) => api.delete(`/zones/${id}`)
};

export const lostPersonService = {
  getAll: () => api.get('/lost-persons'),
  getByEvent: (eventId) => api.get(`/lost-persons/event/${eventId}`),
  getById: (id) => api.get(`/lost-persons/${id}`),
  create: (data) => api.post('/lost-persons', data),
  update: (id, data) => api.put(`/lost-persons/${id}`, data),
  delete: (id) => api.delete(`/lost-persons/${id}`),
  getStats: () => api.get('/lost-persons/stats')
};

export const medicalService = {
  getAll: () => api.get('/medical'),
  getByEvent: (eventId) => api.get(`/medical/event/${eventId}`),
  getById: (id) => api.get(`/medical/${id}`),
  create: (data) => api.post('/medical', data),
  update: (id, data) => api.put(`/medical/${id}`, data),
  delete: (id) => api.delete(`/medical/${id}`)
};

export const emergencyExitService = {
  getAll: () => api.get('/emergency-exits'),
  getByEvent: (eventId) => api.get(`/emergency-exits/event/${eventId}`),
  getById: (id) => api.get(`/emergency-exits/${id}`),
  create: (data) => api.post('/emergency-exits', data),
  update: (id, data) => api.put(`/emergency-exits/${id}`, data),
  updateCrowdLevel: (id, currentCrowdLevel) => api.put(`/emergency-exits/${id}/crowd`, { currentCrowdLevel }),
  delete: (id) => api.delete(`/emergency-exits/${id}`)
};

export const feedbackService = {
  getAll: () => api.get('/feedback'),
  getByEvent: (eventId) => api.get(`/feedback/event/${eventId}`),
  getById: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  getAnalytics: (eventId) => {
    const url = eventId ? `/feedback/analytics/event/${eventId}` : '/feedback/analytics';
    return api.get(url);
  }
};
