// api.js - API configuration for frontend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:3001' : '<your-lambda-url>');

export { API_BASE_URL };