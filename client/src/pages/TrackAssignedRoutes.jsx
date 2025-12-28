import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "./DashboardLayout";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

export default function TrackAssignedRoutes() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 });
  const [mapInstance, setMapInstance] = useState(null);
  let intervalRef = null;

  // Load assignments (manual only, no auto-interval)
  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/assignments");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
      
      // Auto-select first assignment if none selected
      if (data.length > 0 && !selectedAssignment) {
        setSelectedAssignment(data[0]);
      }
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load selected assignment details every 3s (only when map visible)
  const startTracking = useCallback((assignment) => {
    // Clear previous interval
    if (intervalRef) {
      clearInterval(intervalRef);
    }
    
    setSelectedAssignment(assignment);
    setMapCenter({ 
      lat: assignment.currentLat || assignment.route?.points?.[0]?.lat || 13.0827, 
      lng: assignment.currentLng || assignment.route?.points?.[0]?.lng || 80.2707 
    });

    // Start live tracking for THIS assignment only
    intervalRef = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/assignments");
        const data = await res.json();
        const updatedAssignment = data.find(a => a.id === assignment.id);
        if (updatedAssignment) {
          setSelectedAssignment(updatedAssignment);
          if (updatedAssignment.currentLat && updatedAssignment.currentLng) {
            setMapCenter({ lat: updatedAssignment.currentLat, lng: updatedAssignment.currentLng });
          }
        }
      } catch (error) {
        console.error("Tracking error:", error);
      }
    }, 3000);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    loadAssignments();
    return () => {
      if (intervalRef) clearInterval(intervalRef);
    };
  }, []);

  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  if (loading && assignments.length === 0) {
    return (
      <DashboardLayout>
        <div style={styles.center}>Loading assignments...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.header}>
        <h2 style={styles.heading}>Live Route Tracking</h2>
        <button style={styles.refreshBtn} onClick={loadAssignments}>
          🔄 Refresh Assignments
        </button>
      </div>

      {/* Assignment Selector */}
      <div style={styles.selector}>
        <h3 style={styles.selectorTitle}>Select Route to Track:</h3>
        <div style={styles.assignmentTabs}>
          {assignments.map((assignment) => {
            const progress = assignment.totalPoints > 0 
              ? ((assignment.pointsCovered / assignment.totalPoints) * 100).toFixed(0)
              : 0;
            return (
              <div
                key={assignment.id}
                style={{
                  ...styles.tab,
                  ...(selectedAssignment?.id === assignment.id ? styles.tabActive : {})
                }}
                onClick={() => startTracking(assignment)}
              >
                <div style={styles.tabContent}>
                  <strong>{assignment.collector?.name}</strong>
                  <div>{assignment.route?.name}</div>
                  <small style={styles.tabProgress}>
                    {assignment.pointsCovered}/{assignment.totalPoints} ({progress}%)
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Single Route Map */}
      {selectedAssignment && (
        <div style={styles.mapSection}>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
            <GoogleMap
              mapContainerStyle={styles.mapContainer}
              center={mapCenter}
              zoom={16}
              onLoad={onMapLoad}
              options={{
                streetViewControl: false,
                fullscreenControl: true,
                mapTypeControl: true,
                zoomControl: true
              }}
            >
              {typeof window !== 'undefined' && window.google?.maps && (
                <>
                  {/* Live Vehicle Location */}
                  {selectedAssignment.currentLat && selectedAssignment.currentLng && (
                    <Marker
                      position={{ lat: selectedAssignment.currentLat, lng: selectedAssignment.currentLng }}
                      label={selectedAssignment.collector?.name?.charAt(0) || 'V'}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${
                          encodeURIComponent(`
                            <svg width="45" height="45" viewBox="0 0 45 45">
                              <circle cx="22.5" cy="22.5" r="20" fill="#2196F3" stroke="white" stroke-width="3"/>
                              <circle cx="22.5" cy="18" r="5" fill="#FF5722"/>
                              <text x="22.5" y="30" text-anchor="middle" fill="white" font-size="14" font-weight="bold">
                                ${selectedAssignment.collector?.name?.charAt(0) || 'V'}
                              </text>
                            </svg>
                          `)
                        }`,
                        scaledSize: new window.google.maps.Size(45, 45),
                        anchor: new window.google.maps.Point(22.5, 22.5)
                      }}
                      title={`${selectedAssignment.collector?.name} - Live Location`}
                    />
                  )}

                  {/* Route Polyline */}
                  {selectedAssignment.route?.points?.length > 1 && (
                    <Polyline
                      path={selectedAssignment.route.points}
                      options={{
                        strokeColor: progress > 80 ? '#4CAF50' : '#FF9800',
                        strokeOpacity: 0.9,
                        strokeWeight: 6
                      }}
                    />
                  )}

                  {/* Route Checkpoints */}
                  {selectedAssignment.route?.points?.map((point, index) => (
                    <Marker
                      key={index}
                      position={point}
                      label={(index + 1).toString()}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${
                          encodeURIComponent(`
                            <svg width="35" height="35" viewBox="0 0 35 35">
                              <circle cx="17.5" cy="17.5" r="15" fill="${
                                index < selectedAssignment.pointsCovered ? '#4CAF50' : '#F44336'
                              }" stroke="white" stroke-width="3"/>
                              <text x="17.5" y="23" text-anchor="middle" fill="white" font-size="15" font-weight="bold">
                                ${index + 1}
                              </text>
                            </svg>
                          `)
                        }`,
                        scaledSize: new window.google.maps.Size(35, 35)
                      }}
                      title={`Point ${index + 1} - ${index < selectedAssignment.pointsCovered ? '✅ Covered' : '❌ Pending'}`}
                    />
                  ))}
                </>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      {/* Legend */}
      {selectedAssignment && (
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={styles.greenDot}></div>
            <span>Covered Points</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.redDot}></div>
            <span>Pending Points</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.blueDot}></div>
            <span>Live Vehicle</span>
          </div>
        </div>
      )}

      {!selectedAssignment && assignments.length > 0 && (
        <div style={styles.center}>Click any route above to start live tracking</div>
      )}
    </DashboardLayout>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  heading: { fontSize: 26, fontWeight: 800, color: '#3b3270', margin: 0 },
  refreshBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(96deg,#a77fff 0%,#691ad2 95%)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 600
  },
  selector: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 3px 18px #debff80a'
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#6c2ebe',
    marginBottom: 16
  },
  assignmentTabs: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    paddingBottom: 8
  },
  tab: {
    flex: '0 0 280px',
    background: '#f8f9ff',
    border: '2px solid transparent',
    borderRadius: 12,
    padding: 16,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'linear-gradient(96deg,#a77fff 0%,#691ad2 95%)',
    color: 'white',
    borderColor: '#a77fff',
    boxShadow: '0 4px 12px #a77fff40'
  },
  tabContent: { textAlign: 'center' },
  tabProgress: {
    color: '#fff',
    background: 'rgba(255,255,255,0.2)',
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: 12
  },
  mapSection: {
    background: '#fff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 3px 18px #debff80a',
    marginBottom: 20
  },
  mapContainer: {
    width: '100%',
    height: 650,
    borderRadius: 12,
    border: '2px solid #d4c5f9'
  },
  legend: {
    display: 'flex',
    gap: 24,
    justifyContent: 'center',
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
    fontWeight: 500
  },
  greenDot: { width: 16, height: 16, background: '#4CAF50', borderRadius: '50%', boxShadow: '0 2px 4px rgba(76,175,80,0.4)' },
  redDot: { width: 16, height: 16, background: '#F44336', borderRadius: '50%', boxShadow: '0 2px 4px rgba(244,67,54,0.4)' },
  blueDot: { width: 16, height: 16, background: '#2196F3', borderRadius: '50%', boxShadow: '0 2px 4px rgba(33,150,243,0.4)' },
  center: { textAlign: 'center', padding: 80, color: '#6c2ebe', fontSize: 18 }
};
