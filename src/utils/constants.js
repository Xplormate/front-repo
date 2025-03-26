// API Constants
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Message Types
export const MESSAGE_TYPE = {
  USER: 'user',
  ASSISTANT: 'assistant',
  LOADING: 'loading',
  ERROR: 'error',
  SUGGESTIONS: 'suggestions'
};

// Citation Regular Expression
export const CITATION_REGEX = /\[(\d+)\]/g;

// Various display constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 5;
export const ALLOWED_FILE_TYPES = ['application/pdf']; 