import React, { useEffect } from 'react';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      backgroundColor: '#845bbdff', // primary
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ede2f9ff', // textWhite
      fontSize: '3rem',
      fontWeight: 'bold',
      letterSpacing: '0.1em',
      fontFamily: "'Poppins', sans-serif",
      userSelect: 'none',
      flexDirection: 'column'
    }}>
      <div>SmartTheru</div>
      <div style={{ marginTop: '1rem', fontSize: '1.3rem', color: '#F4C430' }}>Smart Route Tracking</div>
    </div>
  );
};

export default SplashScreen;
