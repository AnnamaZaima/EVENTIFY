import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">Eventifyy</div>
          <nav className="landing-nav">
            <Link to="/login" className="nav-btn login">Login</Link>
            <Link to="/register" className="nav-btn register">Register</Link>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <div className="hero-section">
          <div className="container">
            <div className="hero-content">
              <h1>Connect Your Campus Community</h1>
              <p className="hero-subtitle">
                Create, manage, and discover campus events all in one place.
                The perfect platform for clubs and students.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary">Get Started</Link>
           
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <div className="container">
            <h2 className="section-title">What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h3>Event Management</h3>
                <p>Create and manage events for your club with ease. Share details, links, and track attendance.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Club Profiles</h3>
                <p>Showcase your club with a dedicated profile page. Share your mission and upcoming events.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Eventifyy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;