import React from 'react';

const SearchResults = ({ query, results }) => {
  return (
    <div style={styles.body}>
      <h1 style={styles.heading}>Search Results for "{query}"</h1>

      {results && results.length > 0 ? (
        <div style={styles.resultsContainer}>
          {results.map((result, index) => (
            <div key={index} style={styles.resultCard}>
              <div style={styles.resultTitle}>{result.Event_name}</div>
              <div style={styles.resultDetails}>
                <strong>Details:</strong> {result.details}<br />
                <strong>Date:</strong> {result.Event_date}<br />
                <strong>Time:</strong> {result.Event_time || 'N/A'}<br />
                <strong>Location:</strong> {result.Event_location || 'N/A'}<br />
                <strong>Link:</strong>{' '}
                <a href={result.Event_link || '#'} target="_blank" rel="noopener noreferrer" style={styles.resultLink}>
                  {result.Event_link || 'N/A'}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found for "{query}". Please try again.</p>
      )}
    </div>
  );
};

// Styles as JS object
const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(99, 127, 195)',
    color: 'white',
    textAlign: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  heading: {
    marginTop: '20px',
  },
  resultsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '20px',
    padding: '10px',
  },
  resultCard: {
    background: 'linear-gradient(to bottom, #ffffff, #f3f3f3)',
    color: 'black',
    width: '300px',
    margin: '10px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  resultTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2e60b1',
  },
  resultDetails: {
    fontSize: '14px',
    margin: '10px 0',
  },
  resultLink: {
    color: '#1d4d8f',
    textDecoration: 'none',
  },
};

export default SearchResults;
