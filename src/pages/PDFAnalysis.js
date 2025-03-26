import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiFilePlus, FiSend, FiLoader } from 'react-icons/fi';
import { processPdfQuery } from '../services/researchService';
import { MAX_FILE_SIZE, MAX_FILES, ALLOWED_FILE_TYPES } from '../utils/constants';

const PDFAnalysis = () => {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file count
    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} files at once.`);
      return;
    }
    
    // Validate file types and sizes
    const invalidFiles = selectedFiles.filter(
      file => !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );
    
    if (invalidFiles.length > 0) {
      setError(`Some files are invalid. Please upload PDF files under 10MB.`);
      return;
    }
    
    // Add valid files
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setError('');
    
    // Reset file input
    e.target.value = null;
  };
  
  // Remove file from list
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim() || files.length === 0 || loading) {
      setError('Please upload at least one PDF file and enter a query.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create form data
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('query', query);
      
      // Process PDF files with query
      const result = await processPdfQuery(formData);
      setAnswer(result.answer);
      
    } catch (error) {
      setError(error.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">PDF Document Analysis</h1>
        
        {/* File upload section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-700 font-medium">
              Upload PDF Documents
            </label>
            <span className="text-sm text-gray-500">
              {files.length}/{MAX_FILES} files
            </span>
          </div>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 ${
              files.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => files.length < MAX_FILES && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              disabled={files.length >= MAX_FILES}
            />
            
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop PDF files here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max {MAX_FILES} files, 10MB each
            </p>
          </div>
          
          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div className="flex items-center">
                    <FiFilePlus className="text-gray-500 mr-2" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Query input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Your Question
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question about the document(s)..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            disabled={loading}
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !query.trim() || files.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FiSend />
                Analyze Documents
              </>
            )}
          </button>
        </div>
        
        {/* Results section */}
        {answer && !loading && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="prose max-w-none">
                <p>{answer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFAnalysis; 