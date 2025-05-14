import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI, clubAPI } from '../services/api';
import Navbar from '../components/Navbar';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    club_id: '',
    event_type: '', // New field for event type
  });
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClubs, setIsLoadingClubs] = useState(true);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch clubs where the user is a member
    const fetchUserClubs = async () => {
      try {
        const response = await clubAPI.getAllClubs();
        // Filter clubs where user is a member or leader
        setClubs(response.data.clubs || []);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError('Failed to load clubs');
      } finally {
        setIsLoadingClubs(false);
      }
    };
    
    fetchUserClubs();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Format the date properly for the API
      const eventData = {
        ...formData,
        created_by: user.user_id
      };
      
      const response = await eventAPI.createEvent(eventData);
      alert('Event created successfully!');
      navigate(`/events/${response.data.event_id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Set minimum date to today for the date picker
  const today = new Date().toISOString().split('T')[0];

  if (isLoadingClubs) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading clubs...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <h2>Create New Event</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Event Name</label>
            <input 
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="club_id" style={{ display: 'block', marginBottom: '5px' }}>Club</label>
            <select
              id="club_id"
              name="club_id"
              value={formData.club_id}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Select a club</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="event_type" style={{ display: 'block', marginBottom: '5px' }}>Event Type</label>
            <select
              id="event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Select Event Type</option>
              <option value="seminar">Seminar</option>
              <option value="fest">Fest</option>
              <option value="competition">Competition</option>
              <option value="multiple">Multiple</option>
            </select>
          </div>

          {formData.event_type && formData.event_type !== "multiple" && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Date and Time</label>
                <input 
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="location" style={{ display: 'block', marginBottom: '5px' }}>Location</label>
                <input 
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Event location"
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
            </>
          )}

          {formData.event_type === "multiple" && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Date and Time</label>
                <input 
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="location" style={{ display: 'block', marginBottom: '5px' }}>Location</label>
                <input 
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Event location"
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
            </>
          )}
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event"
              rows="5"
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '10px 15px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;