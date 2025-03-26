import axios from 'axios';
import { API_URL } from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
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

/**
 * Generate suggestions for a user query
 * @param {string} query - User's equity research query
 * @returns {Promise} Promise with suggestions response data
 */
export const generateSuggestions = async (query) => {
  try {
    const response = await api.post('/generate/suggestions', { query });
    return response.data;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    throw error;
  }
};

/**
 * Select suggestions and get final response
 * @param {string} threadId - Thread ID from suggestions
 * @param {Array<number>} selectedIndices - Indices of selected suggestions
 * @returns {Promise} Promise with final response data
 */
export const selectSuggestions = async (threadId, selectedIndices) => {
  try {
    const response = await api.post('/select/suggestions', {
      thread_id: threadId,
      selected_indices: selectedIndices,
    });
    return response.data;
  } catch (error) {
    console.error('Error selecting suggestions:', error);
    throw error;
  }
};

/**
 * Get citation details for a specific thread
 * @param {string} threadId - Thread ID
 * @returns {Promise} Promise with citation details
 */
export const getCitationDetails = async (threadId) => {
  try {
    const response = await api.post('/citations/details', {
      thread_id: threadId,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching citation details:', error);
    throw error;
  }
};

/**
 * Process PDF documents with a query
 * @param {FormData} formData - Form data with files and query
 * @returns {Promise} Promise with query response
 */
export const processPdfQuery = async (formData) => {
  try {
    const response = await api.post('/rag/qa', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error processing PDF query:', error);
    throw error;
  }
}; 