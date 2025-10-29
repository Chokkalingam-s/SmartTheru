import React from 'react';
import Navbar from '../Navbar';

const DistrictAdminDashboard = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.mainContent}>
        <h2 style={{ color: '#845bbdff' }}>District Admin Dashboard</h2>
        <p>This is your control panel with real-time stats and management tools.</p>

        {/* Placeholder for dashboard cards or charts */}
        <section style={styles.cardsContainer}>
          <DashboardCard title="Wards Covered" value="12" />
          <DashboardCard title="Routes Completed Today" value="85%" />
          <DashboardCard title="Missed Checkpoints" value="3" />
          <DashboardCard title="Average Collection Time" value="4h 32m" />
        </section>
      </main>
    </div>
  );
};

// Simple dashboard card component
const DashboardCard = ({ title, value }) => (
  <div style={cardStyles.card}>
    <h3 style={cardStyles.title}>{title}</h3>
    <p style={cardStyles.value}>{value}</p>
  </div>
);

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#dfdbdbff', // background
    color: '#000000',
  },
  mainContent: {
    padding: '2rem',
    flexGrow: 1,
  },
};

const cardStyles = {
  card: {
    backgroundColor: '#845bbdff', // primary
    color: '#ede2f9ff',           // textWhite
    borderRadius: 12,
    padding: '1.5rem 2rem',
    minWidth: 180,
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 'bold',
    lineHeight: 1,
  },
};

// Container for cards with wrapping for responsiveness
styles.cardsContainer = {
  display: 'flex',
  gap: '1.5rem',
  flexWrap: 'wrap',
  marginTop: '2rem',
};

export default DistrictAdminDashboard;
