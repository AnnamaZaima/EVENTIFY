import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies with requests
});

// Auth APIs
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: (userId) => apiClient.get(`/auth/profile?user_id=${userId}`),
  logout: () => apiClient.post('/auth/logout'),
};

// Club APIs
export const clubAPI = {
  getAllClubs: () => apiClient.get('/clubs'),
  getClubById: (clubId) => apiClient.get(`/clubs/${clubId}`),
  createClub: (clubData) => apiClient.post('/clubs', clubData),
  joinClub: (clubId, userId) => apiClient.post(`/clubs/${clubId}/join`, { user_id: userId }),
  leaveClub: (clubId, userId) => apiClient.post(`/clubs/${clubId}/leave`, { user_id: userId }),
  searchClubs: (query) => apiClient.get('/clubs/search', { params: { q: query } }), // New search endpoint
};

// Events APIs
export const eventAPI = {
  getAllEvents: () => apiClient.get('/events'),
  getEventsByClub: (clubId) => apiClient.get(`/events/club/${clubId}`),
  getEventById: (eventId) => apiClient.get(`/events/${eventId}`),
  createEvent: (eventData) => apiClient.post('/events', eventData),
  attendEvent: (eventId, userId) => apiClient.post(`/events/${eventId}/attend`, { user_id: userId }),
  cancelAttendance: (eventId, userId) => apiClient.post(`/events/${eventId}/cancel`, { user_id: userId }),
  searchEvents: (query) => apiClient.get('/events/search', { params: { q: query } }), // New search endpoint
  searchEventsAndClubs: (query) => apiClient.get('/search', { params: { q: query } }), // Combined search endpoint
  deleteEvent: (id) => apiClient.delete(`/events/${id}`), // ✅ New delete method using apiClient
  editEvent: (id, updatedEvent) => apiClient.put(`/events/${id}`, updatedEvent), // ✅ Updated edit method using apiClient
};

// FAQ APIs
export const faqAPI = {
  getAllFAQs: () => apiClient.get('/faq'),
};

// AboutUs APIs
export const AboutUsAPI = {
  getAllAbout: () => apiClient.get('/about'),
};

export default {
  auth: authAPI,
  clubs: clubAPI,
  events: eventAPI,
  faq: faqAPI,
  aboutus: AboutUsAPI,
};