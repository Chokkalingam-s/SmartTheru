import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

import { AuthProvider, AuthContext } from './contexts/AuthContext';

function App() {
  const [loading, setLoading] = useState(true);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ user }) =>
          <Router>
            {loading ? (
              <SplashScreen onFinish={() => setLoading(false)} />
            ) : (
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
                <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
              </Routes>
            )}
          </Router>
        }
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;
