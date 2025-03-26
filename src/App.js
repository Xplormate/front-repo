import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import PDFAnalysis from './pages/PDFAnalysis';
import NotFound from './pages/NotFound';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/chat" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/chat" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            
            <Route path="/pdf-analysis" element={
              <ProtectedRoute>
                <PDFAnalysis />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>© {new Date().getFullYear()} Equity Research Assistant</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 