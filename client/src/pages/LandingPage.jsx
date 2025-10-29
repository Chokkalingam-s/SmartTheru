import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#dfdbdbff', color: '#000' }}>
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#845bbdff', fontSize: '3rem' }}>Welcome to SmartTheru</h1>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0', maxWidth: '600px', marginInline: 'auto' }}>
          Smart Route Tracking and Accountability System for Ward-Level Waste Collection.
        </p>
        <button
          style={{
            backgroundColor: '#FFD700',
            color: '#000',
            borderRadius: '8px',
            padding: '0.75rem 2rem',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </header>
    </div>
  );
};

export default LandingPage;
