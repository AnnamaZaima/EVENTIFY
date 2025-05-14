import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import Navbar from '../components/Navbar';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('none');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    event_type: '', // Added event type field
  });

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.user_id;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await eventAPI.getEventById(id);
        setEvent(response.data);
        if (userId && response.data.attendees) {
          const userAttendance = response.data.attendees.find(a => a.user_id === userId);
          if (userAttendance) {
            setRegistrationStatus(userAttendance.ticket_status);
          }
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventDetails();
  }, [id, userId]);

  const handleRegister = async () => {
    setRegistrationStatus('loading');
    try {
      await eventAPI.attendEvent(id, userId);
      setRegistrationStatus('pending');
      const response = await eventAPI.getEventById(id);
      setEvent(response.data);
    } catch (err) {
      console.error('Error registering:', err);
      setError('Failed to register');
      setRegistrationStatus('none');
    }
  };

  const handleCancel = async () => {
    setRegistrationStatus('loading');
    try {
      await eventAPI.cancelAttendance(id, userId);
      setRegistrationStatus('cancelled');
      const response = await eventAPI.getEventById(id);
      setEvent(response.data);
    } catch (err) {
      console.error('Error cancelling:', err);
      setError('Failed to cancel');
    }
  };

  const handleDelete = async () => {
    try {
      await eventAPI.deleteEvent(id);
      // Redirect to the events list page after deleting
      window.location.href = '/events';
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = () => {
    setFormData({
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      event_type: event.event_type, // Added event type to formData
    });
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventAPI.editEvent(id, formData);
      const updated = await eventAPI.getEventById(id);
      setEvent(updated.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div><Navbar />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div><Navbar />
        <div style={{ padding: '20px', color: 'red' }}>{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div><Navbar />
        <div style={{ padding: '20px' }}>Event not found.</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        <Link to="/events" style={{ display: 'inline-block', marginBottom: '20px' }}>Back to Events</Link>

        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '20px' }}>
          {!isEditing ? (
            <>
              <h1>{event.name}</h1>
              <p><strong>Event Type:</strong> {event.event_type}</p> {/* Display event type */}
              <p><strong>Organized by:</strong> {event.club_name}</p>
              <p><strong>Date:</strong> {formatDate(event.date)}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Created by:</strong> {event.created_by_name}</p>
              <p><strong>Description:</strong> {event.description}</p>

              {userId === event.created_by && (
                <>
                  <button onClick={handleEditClick} style={{
                    padding: '8px 12px', marginTop: '10px',
                    backgroundColor: '#FFA726', color: 'white', border: 'none', borderRadius: '4px'
                  }}>
                    Edit Event
                  </button>
                  <button onClick={handleDelete} style={{
                    padding: '8px 12px', marginTop: '10px',
                    backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px'
                  }}>
                    Delete Event
                  </button>
                </>
              )}
            </>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <h2>Edit Event</h2>
              <label>Name:</label><br />
              <input type="text" name="name" value={formData.name} onChange={handleChange} required /><br />
              <label>Date:</label><br />
              <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required /><br />
              <label>Location:</label><br />
              <input type="text" name="location" value={formData.location} onChange={handleChange} required /><br />
              <label>Description:</label><br />
              <textarea name="description" value={formData.description} onChange={handleChange} required /><br />
              <label>Event Type:</label><br />
              <select name="event_type" value={formData.event_type} onChange={handleChange} required>
                <option value="seminar">Seminar</option>
                <option value="fest">Fest</option>
                <option value="competition">Competition</option>
                <option value="multiple">Multiple</option>
              </select><br />
              <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '10px' }}>Save</button>
              <button onClick={() => setIsEditing(false)} type="button">Cancel</button>
            </form>
          )}

          {userId && !isEditing && (
            <div style={{ marginTop: '20px' }}>
              {registrationStatus === 'none' && (
                <button onClick={handleRegister} style={btnStyle('#2196F3')}>Register</button>
              )}
              {registrationStatus === 'pending' && (
                <>
                  <div style={msgStyle('#4CAF50')}>Registered</div>
                  <button onClick={handleCancel} style={btnStyle('#f44336')}>Cancel</button>
                </>
              )}
              {registrationStatus === 'cancelled' && (
                <>
                  <div style={msgStyle('#f44336')}>Cancelled</div>
                  <button onClick={handleRegister} style={btnStyle('#2196F3')}>Register Again</button>
                </>
              )}
              {registrationStatus === 'loading' && <div style={msgStyle('#ddd')}>Processing...</div>}
            </div>
          )}
        </div>

        <div>
          <h2>Attendees</h2>
          {event.attendees?.length > 0 ? (
            <>
              <div style={{ fontWeight: 'bold' }}>
                {event.attendees.filter(a => a.ticket_status !== 'cancelled').length} attending
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {event.attendees
                  .filter(a => a.ticket_status !== 'cancelled')
                  .map(a => (
                    <li key={a.user_id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>{a.full_name}</li>
                  ))}
              </ul>
            </>
          ) : <p>No attendees yet.</p>}
        </div>
      </div>
    </div>
  );
};

const btnStyle = (bg) => ({
  padding: '10px 15px',
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px'
});

const msgStyle = (bg) => ({
  padding: '10px',
  backgroundColor: bg,
  color: 'white',
  borderRadius: '4px',
  marginBottom: '10px'
});

export default EventDetailsPage;
