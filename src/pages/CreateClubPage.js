import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clubAPI } from '../services/api';
import Navbar from '../components/Navbar';

const CreateClubPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    navigate('/login');
    return null;
  }

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
      const clubData = {
        ...formData,
        leader_id: user.user_id
      };
      
      const response = await clubAPI.createClub(clubData);
      alert('Club created successfully!');
      navigate(`/clubs/${response.data.club_id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create club. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <h2>Create New Club</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Club Name</label>
            <input 
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter club name"
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your club"
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
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Creating...' : 'Create Club'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClubPage;