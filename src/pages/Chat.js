import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCheck, FiLoader } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { generateSuggestions, selectSuggestions, getCitationDetails } from '../services/researchService';
import { MESSAGE_TYPE, CITATION_REGEX } from '../utils/constants';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [citations, setCitations] = useState([]);
  const [citationDetails, setCitationDetails] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [currentStep, setCurrentStep] = useState('query'); // query, suggestions, response
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle the submission of a user query
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim() || loading) return;
    
    try {
      // Add user query to messages
      const userMessage = { type: MESSAGE_TYPE.USER, content: query };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Show loading indicator
      setMessages(prevMessages => [...prevMessages, { type: MESSAGE_TYPE.LOADING }]);
      setLoading(true);
      setCurrentStep('query');
      
      // Reset state for new conversation
      setThreadId(null);
      setSuggestions([]);
      setCitations([]);
      setCitationDetails([]);
      setSelectedSuggestions([]);
      
      // Send query to API
      const result = await generateSuggestions(query);
      
      // Remove loading message
      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== MESSAGE_TYPE.LOADING));
      
      // Check if query is equity related
      if (!result.is_equity_related) {
        // Display non-equity response
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: MESSAGE_TYPE.ASSISTANT, 
            content: result.final_response,
            isEquityRelated: false
          }
        ]);
        setCurrentStep('response');
      } else {
        // Store thread ID, suggestions, and citations
        setThreadId(result.thread_id);
        setSuggestions(result.suggestions);
        setCitations(result.citations);
        
        // Display suggestions
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: MESSAGE_TYPE.SUGGESTIONS,
            suggestions: result.suggestions,
            citations: result.citations,
            threadId: result.thread_id
          }
        ]);
        setCurrentStep('suggestions');
        
        // Fetch citation details in background
        if (result.citations && result.citations.length > 0) {
          const details = await getCitationDetails(result.thread_id);
          setCitationDetails(details);
        }
      }
    } catch (error) {
      // Display error message
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.type !== MESSAGE_TYPE.LOADING)
      );
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          type: MESSAGE_TYPE.ERROR, 
          content: error.response?.data?.detail || 'An error occurred. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };
  
  // Handle selection of suggestions
  const handleSuggestionSelect = (index) => {
    if (selectedSuggestions.includes(index)) {
      setSelectedSuggestions(selectedSuggestions.filter(i => i !== index));
    } else {
      setSelectedSuggestions([...selectedSuggestions, index]);
    }
  };
  
  // Submit selected suggestions
  const handleSuggestionsSubmit = async () => {
    if (selectedSuggestions.length === 0 || !threadId) return;
    
    try {
      setLoading(true);
      
      // Show loading indicator
      setMessages(prevMessages => [...prevMessages, { type: MESSAGE_TYPE.LOADING }]);
      
      // Send selected suggestions to API
      const result = await selectSuggestions(threadId, selectedSuggestions);
      
      // Remove loading message
      setMessages(prevMessages => prevMessages.filter(msg => msg.type !== MESSAGE_TYPE.LOADING));
      
      // Display final response
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          type: MESSAGE_TYPE.ASSISTANT, 
          content: result.response,
          citations: citations
        }
      ]);
      
      // Reset selection state
      setSelectedSuggestions([]);
      setCurrentStep('response');
      
    } catch (error) {
      // Display error message
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.type !== MESSAGE_TYPE.LOADING)
      );
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          type: MESSAGE_TYPE.ERROR, 
          content: error.response?.data?.detail || 'An error occurred. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Format content with citations
  const formatContentWithCitations = (content) => {
    if (!content) return "";
    
    // Replace citation markers with clickable spans
    return content.replace(CITATION_REGEX, (match, index) => {
      const citationIndex = parseInt(index, 10) - 1;
      return (
        `<span 
           class="citation" 
           data-citation-index="${citationIndex}"
          >[${index}]</span>`
      );
    });
  };
  
  // Handle citation click
  const handleCitationClick = (e) => {
    if (e.target.classList.contains('citation')) {
      const index = parseInt(e.target.getAttribute('data-citation-index'), 10);
      
      // Find the citation
      const citation = citations[index];
      const detail = citationDetails.find(d => d.citation === citation);
      
      if (detail) {
        // Create or update citation popup
        const popup = document.createElement('div');
        popup.classList.add('fixed', 'z-50', 'bg-white', 'p-4', 'rounded-md', 'shadow-xl', 'max-w-md', 'w-full', 'border', 'border-gray-200');
        popup.style.top = `${e.clientY + 20}px`;
        popup.style.left = `${e.clientX - 100}px`;
        
        popup.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold">${detail.title || 'Citation Source'}</h3>
            <button class="text-gray-500 hover:text-gray-700">×</button>
          </div>
          <p class="text-sm text-gray-600">${detail.description || 'No description available'}</p>
          <a href="${citation}" target="_blank" rel="noopener noreferrer" 
             class="text-blue-600 hover:underline text-sm block mt-2">
            ${citation}
          </a>
        `;
        
        // Remove existing popups
        document.querySelectorAll('.citation-popup').forEach(p => p.remove());
        
        // Add class for identification
        popup.classList.add('citation-popup');
        
        // Add close button listener
        popup.querySelector('button').addEventListener('click', () => {
          popup.remove();
        });
        
        // Add to DOM
        document.body.appendChild(popup);
        
        // Close on click outside
        document.addEventListener('click', (event) => {
          if (!popup.contains(event.target) && !event.target.classList.contains('citation')) {
            popup.remove();
          }
        }, { once: true });
      }
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat messages container */}
      <div 
        className="flex-grow overflow-y-auto p-4 space-y-6"
        onClick={handleCitationClick}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <h1 className="text-2xl font-semibold mb-2">Equity Research Assistant</h1>
            <p className="text-center max-w-md">
              Ask any equity research question and get research-backed suggestions and answers with citations.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`max-w-4xl mx-auto ${message.type === MESSAGE_TYPE.USER ? 'ml-auto' : ''}`}>
              {/* User message */}
              {message.type === MESSAGE_TYPE.USER && (
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <p className="text-blue-800">{message.content}</p>
                </div>
              )}
              
              {/* Loading indicator */}
              {message.type === MESSAGE_TYPE.LOADING && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                  <span>Thinking...</span>
                </div>
              )}
              
              {/* Error message */}
              {message.type === MESSAGE_TYPE.ERROR && (
                <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                  <p className="text-red-600">{message.content}</p>
                </div>
              )}
              
              {/* Suggestions */}
              {message.type === MESSAGE_TYPE.SUGGESTIONS && (
                <div className="suggestions-card">
                  <h3 className="text-lg font-semibold mb-3">Suggested Research Directions</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select one or more suggestions to explore:
                  </p>
                  
                  <div className="space-y-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <div 
                        key={idx}
                        className={`suggestion-item ${selectedSuggestions.includes(idx) ? 'suggestion-selected' : ''}`}
                        onClick={() => handleSuggestionSelect(idx)}
                      >
                        <div className="flex-shrink-0">
                          {selectedSuggestions.includes(idx) ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white">
                              <FiCheck size={16} />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-600">
                              {idx + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow">
                          {suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      onClick={handleSuggestionsSubmit}
                      disabled={selectedSuggestions.length === 0 || loading}
                    >
                      Generate Response
                    </button>
                  </div>
                </div>
              )}
              
              {/* Assistant response */}
              {message.type === MESSAGE_TYPE.ASSISTANT && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formatContentWithCitations(message.content)
                    }}
                  />
                  
                  {/* Citations section */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">Sources</h4>
                      <ol className="text-xs text-gray-500 list-decimal list-inside">
                        {message.citations.map((citation, i) => (
                          <li key={i} className="truncate hover:text-blue-600">
                            <a href={citation} target="_blank" rel="noopener noreferrer">
                              {citation}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about equity research, stocks, market trends..."
              className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || currentStep === 'suggestions'}
            />
            
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 flex items-center justify-center"
              disabled={loading || !query.trim() || currentStep === 'suggestions'}
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;