import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function AssignRoutes() {
  const [collectors, setCollectors] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data ONCE on mount only
  useEffect(() => {
    loadData();
  }, []); // No interval!

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [collectorsRes, routesRes, assignmentsRes] = await Promise.all([
        fetch("http://localhost:5000/api/assignments/collectors"),
        fetch("http://localhost:5000/api/assignments/available-routes"),
        fetch("http://localhost:5000/api/assignments")
      ]);

      const collectorsData = await collectorsRes.json();
      const routesData = await routesRes.json();
      const assignmentsData = await assignmentsRes.json();

      setCollectors(Array.isArray(collectorsData) ? collectorsData : []);
      setAvailableRoutes(Array.isArray(routesData) ? routesData : []);
      setActiveAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load data. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  const assignRoute = async (route) => {
    try {
      const res = await fetch("http://localhost:5000/api/assignments/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectorId: selectedCollector.id,
          routeId: route.id,
          totalPoints: route.totalPoints || 0
        })
      });

      if (res.ok) {
        // Refresh data only after successful assignment (no blinking)
        loadData();
        setSelectedCollector(null);
      } else {
        alert("Failed to assign route");
      }
    } catch (error) {
      alert("Assignment failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={styles.center}>Loading collectors and routes...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.header}>
        <h2 style={styles.heading}>Assign Routes</h2>
        <button style={styles.refreshBtn} onClick={loadData}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
          <br />
          <small>Check if backend is running on port 5000</small>
        </div>
      )}

      <div style={styles.grid}>
        {/* Collectors */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Collectors ({collectors.length})</h3>
          {collectors.length === 0 ? (
            <div style={styles.empty}>No collectors found</div>
          ) : (
            collectors.map((collector) => (
              <div key={collector.id} style={styles.collectorCard}>
                <div>
                  <h4>{collector.name}</h4>
                  <p>📱 {collector.mobile}</p>
                  {collector.address && <p style={styles.address}>{collector.address}</p>}
                </div>
                <button
                  style={styles.assignBtn}
                  onClick={() => setSelectedCollector(collector)}
                >
                  Assign Route
                </button>
              </div>
            ))
          )}
        </div>

        {/* Routes Modal */}
        {selectedCollector && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3>Assign to {selectedCollector.name}</h3>
                <button onClick={() => setSelectedCollector(null)} style={styles.close}>×</button>
              </div>
              <div style={styles.routesList}>
                {availableRoutes.length === 0 ? (
                  <div>No routes available</div>
                ) : (
                  availableRoutes.map((route) => (
                    <div
                      key={route.id}
                      style={styles.routeItem}
                      onClick={() => assignRoute(route)}
                    >
                      <div>
                        <strong>{route.name}</strong>
                        <p>{route.totalPoints || 0} points</p>
                      </div>
                      <span>Assign ➤</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assignments */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Active Assignments ({activeAssignments.length})</h3>
          {activeAssignments.length === 0 ? (
            <div style={styles.empty}>No active assignments</div>
          ) : (
            activeAssignments.map((assignment) => {
              const progress = assignment.totalPoints > 0 
                ? ((assignment.pointsCovered / assignment.totalPoints) * 100).toFixed(0)
                : 0;
              return (
                <div key={assignment.id} style={styles.assignmentCard}>
                  <div>
                    <strong>{assignment.collector?.name || 'Collector'} - {assignment.route?.name}</strong>
                    <div style={styles.progressContainer}>
                      <div style={{...styles.progressBar, width: `${progress}%`}} />
                    </div>
                    <small>
                      {assignment.pointsCovered}/{assignment.totalPoints} ({progress}%)
                      {assignment.currentLat && (
                        <span style={styles.status}> • Live</span>
                      )}
                    </small>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Styles remain exactly the same
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  heading: { fontSize: 26, fontWeight: 800, color: '#3b3270', margin: 0 },
  refreshBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(96deg,#a77fff 0%,#691ad2 95%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer'
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    textAlign: 'center'
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  panel: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 3px 18px #debff80a',
    height: 500,
    overflowY: 'auto'
  },
  panelTitle: { fontSize: 18, fontWeight: 700, color: '#6c2ebe', marginBottom: 15 },
  collectorCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    border: '1px solid #eee',
    borderRadius: 12,
    marginBottom: 12
  },
  assignBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(96deg,#a77fff 0%,#691ad2 95%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: 16,
    padding: 24,
    width: 400,
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  close: {
    background: 'none',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    color: '#666'
  },
  routesList: { maxHeight: 300, overflowY: 'auto' },
  routeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 12,
    border: '1px solid #eee',
    borderRadius: 8,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  assignmentCard: {
    padding: 16,
    border: '1px solid #eee',
    borderRadius: 12,
    marginBottom: 12,
    background: '#faf9ff'
  },
  progressContainer: {
    background: '#e0e0e0',
    height: 6,
    borderRadius: 3,
    margin: '8px 0',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
    transition: 'width 0.3s'
  },
  status: { color: '#4CAF50', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', padding: 40 },
  center: { textAlign: 'center', padding: 40, color: '#6c2ebe' }
};
