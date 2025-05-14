import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Auth & Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Pages
import Dashboard from './pages/Dashboard';
import EventPage from './pages/EventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CreateEventPage from './pages/CreateEventPage';
import AllClubsPage from './pages/AllClubsPage';
import ClubDetailsPage from './pages/ClubDetailsPage';
import CreateClubPage from './pages/CreateClubPage';
import ProfilePage from './pages/ProfilePage';
import FAQPage from './pages/FAQPage';
import AboutUsPage from './pages/AboutUsPage';

//import SearchResults from './SearchResults';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/about" 
          element={
            <ProtectedRoute>
              <AboutUsPage /> {/* Add AboutUs as a protected route */}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/faq" 
          element={
            <ProtectedRoute>
              <FAQPage /> {/* Add FAQ as a protected route */}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <EventPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/:id" 
          element={
            <ProtectedRoute>
              <EventDetailsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/create" 
          element={
            <ProtectedRoute>
              <CreateEventPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clubs" 
          element={
            <ProtectedRoute>
              <AllClubsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clubs/:id" 
          element={
            <ProtectedRoute>
              <ClubDetailsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clubs/create" 
          element={
            <ProtectedRoute>
              <CreateClubPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;