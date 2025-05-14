import React, { useState } from 'react';
import './FAQPage.css';

const faqs = [
  {
    question: 'How do I find events on Eventify?',
    answer: 'You can easily find events by browsing through our categories, such as seminars, festivals, and competitions...',
  },
  {
    question: 'How can I register for an event?',
    answer: 'To register for an event, simply visit the event page and click on the "Register" or "Tickets" button...',
  },
  {
    question: 'What types of events does the university host?',
    answer: 'The university hosts a variety of events, including academic seminars, cultural festivals, workshops...',
  },
  {
    question: 'Can I cancel or transfer my event registration?',
    answer: 'Cancellation and transfer policies vary by event. Please check the event details for specific instructions...',
  },
  {
    question: 'What happens if I miss an event I registered for?',
    answer: 'If you miss an event, please check with the event organizer for any possible rescheduling...',
  },
  {
    question: 'Will food and beverages be provided?',
    answer: 'Some events offer complimentary refreshments, while others may have food vendors on-site...',
  },
  {
    question: 'How do I contact event organizers?',
    answer: 'Event organizers’ contact information can be found on the event page...',
  },
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <h3>{question}</h3>
      {isOpen && <p>{answer}</p>}
    </div>
  );
};

const FaqPage = () => {
  return (
    <div className="faq-page">
      <header className="faq-header">
        <h1>Frequently Asked Questions (FAQ)</h1>
        <p>Everything you need to know about our events</p>
      </header>

      <div className="faq-content">
        <section>
          <h2 className="section-title">General Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        <a href="#" className="cta-button">
          Contact Us for More Questions
        </a>
      </div>

      <footer className="faq-footer">
        <p>&copy; 2025 Eventify. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default FaqPage;
