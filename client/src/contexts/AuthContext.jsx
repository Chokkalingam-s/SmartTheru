import React, { createContext, useState, useEffect } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Optional: Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('smarttheruUser');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Save user to localStorage on change
  useEffect(() => {
    if (user) localStorage.setItem('smarttheruUser', JSON.stringify(user));
    else localStorage.removeItem('smarttheruUser');
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
