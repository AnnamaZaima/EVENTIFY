import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventAPI, clubAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    events: [],
    clubs: []
  });
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'clubs'
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, clubsResponse] = await Promise.all([
          eventAPI.getAllEvents(),
          clubAPI.getAllClubs()
        ]);
        
        setEvents(eventsResponse.data.events || []);
        setClubs(clubsResponse.data.clubs || []);
        setSearchResults({
          events: eventsResponse.data.events || [],
          clubs: clubsResponse.data.clubs || []
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults({
        events: events,
        clubs: clubs
      });
    } else {
      const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.club_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.leader_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults({
        events: filteredEvents,
        clubs: filteredClubs
      });
    }
  }, [searchTerm, events, clubs]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events or clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        {/* Search Tabs */}
        {searchTerm && (
          <div className="search-tabs">
            <button
              className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events ({searchResults.events.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'clubs' ? 'active' : ''}`}
              onClick={() => setActiveTab('clubs')}
            >
              Clubs ({searchResults.clubs.length})
            </button>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
          <Link 
            to="/clubs/create" 
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Create New Club
          </Link>
          
          <Link 
            to="/events/create" 
            style={{
              padding: '10px 15px',
              backgroundColor: '#2196F3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Create New Event
          </Link>
        </div>
        
        {/* Search Results or Default View */}
        {searchTerm ? (
          <div className="search-results">
            {activeTab === 'events' ? (
              <div className="events-section">
                <h2 className="section-title">Matching Events ({searchResults.events.length})</h2>
                {searchResults.events.length === 0 ? (
                  <p>No events match your search.</p>
                ) : (
                  <div>
                    {searchResults.events.map(event => (
                      <div key={event.id} className="card">
                        <h3>{event.name}</h3>
                        <p><strong>Club:</strong> {event.club_name}</p>
                        <p><strong>Date:</strong> {formatDate(event.date)}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <Link to={`/events/${event.id}`} className="card-btn card-btn-blue">
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="clubs-section">
                <h2 className="section-title">Matching Clubs ({searchResults.clubs.length})</h2>
                {searchResults.clubs.length === 0 ? (
                  <p>No clubs match your search.</p>
                ) : (
                  <div>
                    {searchResults.clubs.map(club => (
                      <div key={club.id} className="card">
                        <h3>{club.name}</h3>
                        <p><strong>Leader:</strong> {club.leader_name}</p>
                        <Link to={`/clubs/${club.id}`} className="card-btn card-btn-green">
                          View Club
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="dashboard-content">
            {/* Upcoming Events */}
            <div className="events-section">
              <h2 className="section-title">Upcoming Events</h2>
              {events.length === 0 ? (
                <p>No upcoming events found.</p>
              ) : (
                <div>
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} className="card">
                      <h3>{event.name}</h3>
                      <p><strong>Club:</strong> {event.club_name}</p>
                      <p><strong>Date:</strong> {formatDate(event.date)}</p>
                      <p><strong>Location:</strong> {event.location}</p>
                      <Link to={`/events/${event.id}`} className="card-btn card-btn-blue">
                        View Details
                      </Link>
                    </div>
                  ))}
                  <Link to="/events" className="view-all-link">
                    View All Events
                  </Link>
                </div>
              )}
            </div>
            
            {/* Popular Clubs */}
            <div className="clubs-section">
              <h2 className="section-title">Clubs</h2>
              {clubs.length === 0 ? (
                <p>No clubs found.</p>
              ) : (
                <div>
                  {clubs.slice(0, 5).map(club => (
                    <div key={club.id} className="card">
                      <h3>{club.name}</h3>
                      <p><strong>Leader:</strong> {club.leader_name}</p>
                      <Link to={`/clubs/${club.id}`} className="card-btn card-btn-green">
                        View Club
                      </Link>
                    </div>
                  ))}
                  <Link to="/clubs" className="view-all-link">
                    View All Clubs
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;