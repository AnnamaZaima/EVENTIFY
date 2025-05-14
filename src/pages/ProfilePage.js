import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authAPI, eventAPI } from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?.user_id) {
      navigate('/login');
      return;
    }
  
    const fetchProfileData = async () => {
      try {
        const profileResponse = await authAPI.getProfile(user.user_id);
        console.log("🔹 Full Profile API Response:", profileResponse);
  
        setProfile(profileResponse.data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError(`Failed to load profile: ${err.response?.data?.error || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              {profile?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="profile-details">
              <h1>{profile?.full_name}</h1>
              <p className="profile-email">{profile?.email}</p>
              <p className="profile-joined">Member since: {new Date(profile?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'clubs' ? 'active' : ''}`}
            onClick={() => setActiveTab('clubs')}
          >
            My Clubs
          </button>
          <button 
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            My Events
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Clubs Joined</h3>
                  <p className="stat-value">{profile?.clubs?.length || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Leading Clubs</h3>
                  <p className="stat-value">
                    {profile?.clubs?.filter(club => club.role === 'leader').length || 0}
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Events Registered</h3>
                  <p className="stat-value">{registeredEvents.length}</p>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <Link to="/clubs/create" className="btn-primary">Create New Club</Link>
                  <Link to="/clubs" className="btn-secondary">Explore Clubs</Link>
                  <Link to="/events" className="btn-secondary">Browse Events</Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clubs' && (
            <div className="clubs-tab">
              <h2>My Clubs</h2>
              {profile?.clubs?.length > 0 ? (
                <div className="clubs-grid">
                  {profile.clubs.map(club => (
                    <div key={club.id} className="club-card">
                      <h3>{club.name}</h3>
                      <p className="club-desc">{club.description}</p>
                      <div className="club-card-footer">
                        <span className={`role-badge ${club.role}`}>
                          {club.role === 'leader' ? 'Leader' : 'Member'}
                        </span>
                        <Link to={`/clubs/${club.id}`} className="btn-link">
                          View Club
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't joined any clubs yet.</p>
                  <Link to="/clubs" className="btn-primary">
                    Explore Clubs
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-tab">
              <h2>My Registered Events</h2>
              {registeredEvents.length > 0 ? (
                <div className="events-list">
                  {registeredEvents.map(event => (
                    <div key={event.id} className="event-item">
                      <div className="event-details">
                        <h3>{event.name}</h3>
                        <p className="event-meta">
                          <span className="event-date">
                            <i className="fa fa-calendar"></i> {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="event-club">
                            <i className="fa fa-users"></i> {event.club_name}
                          </span>
                        </p>
                      </div>
                      <div className="event-status">
                        <span className={`status-badge ${event.ticket_status}`}>
                          {event.ticket_status}
                        </span>
                        <Link to={`/events/${event.id}`} className="btn-link">
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't registered for any events yet.</p>
                  <Link to="/events" className="btn-primary">
                    Browse Events
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;