import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { clubAPI, eventAPI } from '../services/api';
import './ClubDetailsPage.css';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [joinLoading, setJoinLoading] = useState(false);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }
});
    useEffect(() => {
        const fetchClubDetails = async () => {
          try {
            const response = await clubAPI.getClubById(id);
            setClub(response.data);
      
            const currentUser = response.data.members?.find(
              member => member.id === user?.user_id
            );
            setUserRole(currentUser?.role || null);
          } catch (err) {
            setError('Failed to load club details. Please try again.');
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchClubDetails();
      }, [id]);

  const handleJoinClub = async () => {
    setJoinLoading(true);
    try {
      await clubAPI.joinClub(id, user.user_id);
      // Refresh club details
      const response = await clubAPI.getClubById(id);
      setClub(response.data);
      setUserRole('member');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join club.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      try {
        await clubAPI.leaveClub(id, user.user_id);
        // Refresh club details
        const response = await clubAPI.getClubById(id);
        setClub(response.data);
        setUserRole(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to leave club.');
      }
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading club details...</p>
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
          <button onClick={() => navigate('/clubs')} className="btn-secondary">
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="club-details-container">
        <div className="club-header">
          <h1>{club.name}</h1>
          <div className="club-actions">
            {!userRole && (
              <button 
                onClick={handleJoinClub} 
                disabled={joinLoading}
                className="btn-primary"
              >
                {joinLoading ? 'Joining...' : 'Join Club'}
              </button>
            )}
            {userRole === 'member' && (
              <button onClick={handleLeaveClub} className="btn-danger">
                Leave Club
              </button>
            )}
            {userRole === 'leader' && (
              <div className="leader-actions">
                <Link to={`/events/create?club_id=${club.id}`} className="btn-primary">
                  Create Event
                </Link>
                <button onClick={handleLeaveClub} className="btn-danger">
                  Step Down as Leader
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="club-info">
          <p className="club-description">{club.description}</p>
          <div className="club-meta">
            <p><strong>Created by:</strong> {club.leader_name}</p>
            <p><strong>Founded on:</strong> {new Date(club.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="club-content">
          <div className="club-members">
            <h2>Members ({club.members?.length || 0})</h2>
            <ul className="members-list">
              {club.members?.map(member => (
                <li key={member.id} className={`member-item ${member.role === 'leader' ? 'leader' : ''}`}>
                  <span className="member-name">{member.full_name}</span>
                  {member.role === 'leader' && <span className="leader-badge">Leader</span>}
                  <span className="member-joined">Joined: {new Date(member.joined_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="club-events">
            <h2>Upcoming Events</h2>
            {club.upcoming_events?.length > 0 ? (
              <div className="events-list">
                {club.upcoming_events.map(event => (
                  <div key={event.id} className="event-card">
                    <h3>{event.name}</h3>
                    <p className="event-date">
                      <i className="fa fa-calendar"></i> {new Date(event.date).toLocaleString()}
                    </p>
                    <p className="event-location">
                      <i className="fa fa-map-marker"></i> {event.location || 'TBA'}
                    </p>
                    <Link to={`/events/${event.id}`} className="btn-secondary">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-events">No upcoming events scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsPage;