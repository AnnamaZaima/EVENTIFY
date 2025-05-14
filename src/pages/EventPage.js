import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import Navbar from '../components/Navbar';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAllEvents();
        setEvents(response.data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
 
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

  // Filter events based on the selected filter
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return eventDate >= now;
    } else if (filter === 'past') {
      return eventDate < now;
    }
    return true; // 'all' filter
  });

  // Sort events: upcoming events by date (soonest first), past events by date (most recent first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const now = new Date();
    
    // If both are in the past or both are in the future, sort by date
    if ((dateA < now && dateB < now) || (dateA >= now && dateB >= now)) {
      if (dateA < now) {
        return dateB - dateA; // Past events: most recent first
      } else {
        return dateA - dateB; // Upcoming events: soonest first
      }
    }
    
    // If one is past and one is future, put future first
    return dateA < now ? 1 : -1;
  });

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading events...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Events</h1>
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
        
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setFilter('upcoming')}
            style={{
              padding: '8px 12px',
              backgroundColor: filter === 'upcoming' ? '#2196F3' : '#f0f0f0',
              color: filter === 'upcoming' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            style={{
              padding: '8px 12px',
              backgroundColor: filter === 'past' ? '#2196F3' : '#f0f0f0',
              color: filter === 'past' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 12px',
              backgroundColor: filter === 'all' ? '#2196F3' : '#f0f0f0',
              color: filter === 'all' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            All
          </button>
        </div>
        
        {sortedEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>No events found.</p>
          </div>
        ) : (
          <div>
            {sortedEvents.map(event => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();
              
              return (
                <div 
                  key={event.id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    padding: '15px',
                    marginBottom: '15px',
                    backgroundColor: isPast ? '#f9f9f9' : 'white'
                  }}
                >
                  <h2>{event.name}</h2>
                  <p><strong>Club:</strong> {event.club_name}</p>
                  <p><strong>Date:</strong> {formatDate(event.date)}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  
                  {isPast && (
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: '#757575',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '10px'
                    }}>
                      Past event
                    </div>
                  )}
                  
                  <div>
                    <Link 
                      to={`/events/${event.id}`}
                      style={{
                        display: 'inline-block',
                        padding: '8px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        marginTop: '10px'
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;