import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand} onClick={() => navigate('/dashboard')} tabIndex={0} role="button" aria-label="Go to dashboard">
        SmartTheru
      </div>
      <div style={styles.menu}>
        {/* Future menu links */}
        <button style={styles.menuItem} onClick={() => alert('Feature coming soon!')}>Reports</button>
        <button style={styles.menuItem} onClick={() => alert('Feature coming soon!')}>Settings</button>
      </div>
      <button style={styles.logoutButton} onClick={handleLogout} aria-label="Logout">
        Logout
      </button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#845bbdff', // primary
    color: '#ede2f9ff',           // textWhite
    padding: '0.75rem 1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    flexWrap: 'wrap',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  menu: {
    display: 'flex',
    gap: '1rem',
    flexGrow: 1,
    justifyContent: 'center',
  },
  menuItem: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ede2f9ff',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: 6,
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    backgroundColor: '#FF3B30', // error/red
    border: 'none',
    color: 'white',
    padding: '0.5rem 1.25rem',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Navbar;
