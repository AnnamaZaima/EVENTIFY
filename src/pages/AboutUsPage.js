import React from 'react';
import './AboutUs.css'; // We'll extract the styles into a separate CSS file

const AboutUs = () => {
  return (
    <div className="about-us">
      <header>
        <h1>Welcome to Eventify</h1>
        <p>Your one-stop destination for discovering exciting events</p>
      </header>

      <div className="content">
        <section>
          <h2 className="section-title">About Us</h2>
          <p className="section-content">
            Welcome to <strong>Eventify</strong> – your one-stop destination for discovering and experiencing the most exciting events around!  
            At Eventify, we believe every event tells a story, and we're here to bring those stories to life. From vibrant festivals and inspiring seminars to thrilling competitions and unforgettable gatherings, we are dedicated to connecting people through shared experiences.
          </p>
        </section>

        <section>
          <h2 className="section-title">Our Mission</h2>
          <p className="section-content">
            To simplify the way you find, explore, and participate in events that matter to you. Whether you're a student, a professional, or simply an enthusiast, we're here to make sure you never miss a moment of excitement.
          </p>
        </section>

        <section>
          <h2 className="section-title">What We Offer</h2>
          <ul className="section-content">
            <li><strong>Comprehensive Event Listings:</strong> Explore detailed information about upcoming events, including dates, venues, and descriptions.</li>
            <li><strong>Diverse Categories:</strong> From seminars and fests to competitions and more, there's something for everyone.</li>
            <li><strong>Easy Ticketing:</strong> Secure your spot at your favorite events with just a few clicks.</li>
            <li><strong>Highlights & Updates:</strong> Stay informed with event highlights, FAQs, and everything you need to know.</li>
          </ul>
        </section>

        <section>
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="section-content">
            We're passionate about creating connections and fostering a sense of community. Our platform is designed to make event discovery effortless, so you can focus on making memories that last a lifetime.
          </p>
        </section>

        <a href="#" className="cta-button">Join Us Today</a>
      </div>

      <footer>
        <p>&copy; 2025 Eventify. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;