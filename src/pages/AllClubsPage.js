import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clubAPI } from '../services/api';
import Navbar from '../components/Navbar';

const AllClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await clubAPI.getAllClubs();
        setClubs(response.data.clubs || []);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError('Failed to load clubs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClubs();
  }, []);

  // Filter clubs based on search term
  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (club.description && club.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Student Clubs</h1>
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
        </div>
        
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        {filteredClubs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>No clubs found matching your search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredClubs.map(club => (
              <div 
                key={club.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  padding: '15px',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <h2 style={{ marginTop: 0 }}>{club.name}</h2>
                <p><strong>Leader:</strong> {club.leader_name}</p>
                
                <p style={{ 
                  flexGrow: 1, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical' 
                }}>
                  {club.description}
                </p>
                
                <div style={{ marginTop: 'auto' }}>
                  <Link 
                    to={`/clubs/${club.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      width: '100%',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    View Club
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClubsPage;