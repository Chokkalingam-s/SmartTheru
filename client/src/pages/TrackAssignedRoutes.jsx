import React, { useEffect, useState, useCallback, useRef } from "react";
import DashboardLayout from "./DashboardLayout";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

export default function TrackAssignedRoutes() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 });
  const [bounds, setBounds] = useState(null);
  const mapInstanceRef = useRef(null);
  const intervalRef = useRef(null);

  // Load assignments
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      console.log("🔄 Loading assignments...");
      const res = await fetch("http://localhost:5000/api/assignments");
      const data = await res.json();
      console.log("📋 Assignments loaded:", data);
      
      const validAssignments = Array.isArray(data) ? data.filter(a => a && a.id) : [];
      setAssignments(validAssignments);
      
      // Auto-select first assignment if none selected
      if (validAssignments.length > 0 && !selectedAssignment) {
        setSelectedAssignment(validAssignments[0]);
      }
    } catch (error) {
      console.error("❌ Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Calculate bounds with validation
  const calculateBounds = useCallback((points) => {
    if (!points || points.length === 0) return null;
    
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    let validPoints = 0;
    
    points.forEach(point => {
      const lat = parseFloat(point.lat);
      const lng = parseFloat(point.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        validPoints++;
      }
    });
    
    if (validPoints === 0 || minLat === Infinity) return null;
    
    console.log("📐 Bounds calculated:", { minLat, maxLat, minLng, maxLng });
    return [
      { lat: minLat - 0.001, lng: minLng - 0.001 }, // Padding
      { lat: maxLat + 0.001, lng: maxLng + 0.001 }
    ];
  }, []);

  const getProgress = (assignment) => {
    const total = parseInt(assignment?.totalPoints) || 0;
    const covered = parseInt(assignment?.pointsCovered) || 0;
    return total > 0 ? Math.round((covered / total) * 100) : 0;
  };

  const startTracking = (assignment) => {
    console.log("🚀 Starting tracking:", assignment.id);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setSelectedAssignment(assignment);
    
    // Calculate and set bounds
    if (assignment.route?.points && assignment.route.points.length > 0) {
      const routeBounds = calculateBounds(assignment.route.points);
      if (routeBounds) {
        setBounds(routeBounds);
        const centerLat = (routeBounds[0].lat + routeBounds[1].lat) / 2;
        const centerLng = (routeBounds[0].lng + routeBounds[1].lng) / 2;
        setMapCenter({ lat: centerLat, lng: centerLng });
        console.log("🎯 Center set:", centerLat, centerLng);
      }
    }

    // Start live updates
    intervalRef.current = setInterval(loadAssignments, 3000);
  };

  // ✅ FIXED: Map load with proper bounds fitting
const onMapLoad = useCallback((map) => {
  console.log("🗺️ Map loaded successfully!");
  mapInstanceRef.current = map;
  setMapReady(true);
  
  if (bounds && bounds.north) {
    setTimeout(() => {
      try {
        map.fitBounds(bounds);
        // ✅ MORE ZOOMED IN
        let zoom = map.getZoom();
        if (zoom < 16) map.setZoom(16); // Minimum zoom 16
        if (zoom > 19) map.setZoom(19); // Max zoom 19
        console.log("✅ Bounds fitted, zoom:", map.getZoom());
      } catch (error) {
        console.log("❌ Bounds error:", error);
      }
    }, 500);
  }
}, [bounds]);


  // ✅ FIXED: Recenter when assignment or bounds change
  useEffect(() => {
    if (mapInstanceRef.current && mapReady && bounds && selectedAssignment) {
      setTimeout(() => {
        try {
          mapInstanceRef.current.fitBounds(bounds);
        } catch (error) {
          console.log("Recenter error:", error);
        }
      }, 300);
    }
  }, [selectedAssignment, bounds, mapReady]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={styles.center}>
          <div style={styles.loadingSpinner}></div>
          Loading assignments...
        </div>
      </DashboardLayout>
    );
  }

return (
  <DashboardLayout>
    <div style={styles.header}>
      <h2 style={styles.heading}>Live Route Tracking</h2>
      <button style={styles.refreshBtn} onClick={loadAssignments}>
        🔄 Refresh
      </button>
    </div>

    {loading ? (
      <div style={styles.center}>
        <div style={styles.loadingSpinner}></div>
        Loading assignments...
      </div>
    ) : assignments.length === 0 ? (
      <div style={styles.emptyState}>
        <h3>No Active Assignments</h3>
        <p>Assign routes to collectors first</p>
        <button style={styles.assignBtn} onClick={() => window.location.href = '/assign-routes'}>
          Go to Assign Routes
        </button>
      </div>
    ) : (
      <div style={styles.mainContainer}>
        {/* ✅ LEFT: Active Routes */}
        <div style={styles.routesPanel}>
          <h3 style={styles.selectorTitle}>Active Routes ({assignments.length})</h3>
          <div style={styles.assignmentTabs}>
            {assignments.map((assignment) => {
              const progress = getProgress(assignment);
              return (
                <div
                  key={assignment.id}
                  className="assignment-tab"
                  style={{
                    ...styles.tab,
                    ...(selectedAssignment?.id === assignment.id ? styles.tabActive : {})
                  }}
                  onClick={() => startTracking(assignment)}
                >
                  <div style={styles.tabContent}>
                    <div style={styles.collectorName}>
                      {assignment.collector?.name || 'Collector'}
                    </div>
                    <div style={styles.routeName}>
                      {assignment.route?.name || 'Unnamed Route'}
                    </div>
                    <div style={styles.progressChip}>
                      {assignment.pointsCovered}/{assignment.totalPoints}
                      <span style={styles.progressPercent}> ({progress}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ RIGHT: Map */}
        <div style={styles.mapContainerWrapper}>
          {selectedAssignment && (
            <LoadScript 
              googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
              libraries={LIBRARIES}
              loadingElement={<div style={styles.mapLoading}>🗺️ Loading Map...</div>}
            >
              <div style={styles.mapSection}>
                <div style={styles.mapHeader}>
                  <h3 style={styles.mapTitle}>
                    {selectedAssignment.collector?.name} 
                    <span style={styles.routeLabel}>→</span> 
                    {selectedAssignment.route?.name}
                  </h3>
                  <div style={styles.statusRow}>
                    <span style={styles.liveIndicator}>● LIVE</span>
                    <span style={styles.progressSummary}>
                      {selectedAssignment.pointsCovered}/{selectedAssignment.totalPoints} 
                      ({getProgress(selectedAssignment)}%)
                    </span>
                  </div>
                </div>

                <GoogleMap
                  mapContainerStyle={styles.fullMapContainer}
                  center={mapCenter}
                  zoom={18} // ✅ FULL ZOOM START
                  onLoad={onMapLoad}
                  options={{
                    zoomControl: true,
                    fullscreenControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    gestureHandling: "greedy",
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                      }
                    ]
                  }}
                >
                  {mapReady && selectedAssignment.route?.points && selectedAssignment.route.points.length > 0 && (
                    <>
                      {/* 🔵 Live Vehicle */}
                      {selectedAssignment.currentLat && selectedAssignment.currentLng && (
                        <Marker
                          position={{ 
                            lat: parseFloat(selectedAssignment.currentLat),
                            lng: parseFloat(selectedAssignment.currentLng)
                          }}
                          title="🔵 Live Vehicle Location"
                          icon={{
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                              <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="25" cy="25" r="22" fill="#2196F3" stroke="white" stroke-width="4"/>
                                <text x="25" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="white">🚛</text>
                                <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
                              </svg>
                            `)}`,
                            scaledSize: new window.google.maps.Size(50, 50),
                            anchor: new window.google.maps.Point(25, 25)
                          }}
                        />
                      )}

                      {/* Route Line */}
                      {selectedAssignment.route.points.length > 1 && (
                        <Polyline
                          path={selectedAssignment.route.points.map(p => ({
                            lat: parseFloat(p.lat),
                            lng: parseFloat(p.lng)
                          }))}
                          options={{
                            strokeColor: getProgress(selectedAssignment) > 70 ? "#4CAF50" : "#FF9800",
                            strokeOpacity: 0.8,
                            strokeWeight: 6
                          }}
                        />
                      )}

                      {/* Route Points */}
                      {selectedAssignment.route.points.map((point, index) => {
                        const coveredPointIndices = selectedAssignment.coveredPoints || [];
                        const isCovered = Array.isArray(coveredPointIndices) && coveredPointIndices.includes(index);
                        
                        const getPointIcon = (color, number) => {
                          return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="4"/>
                              <text x="20" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="white">${number}</text>
                              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
                            </svg>
                          `)}`;
                        };
                        
                        const iconUrl = getPointIcon(isCovered ? '#4CAF50' : '#F44336', index + 1);
                        
                        return (
                          <Marker
                            key={`point-${index}`}
                            position={{
                              lat: parseFloat(point.lat),
                              lng: parseFloat(point.lng)
                            }}
                            title={`Point ${index + 1}${isCovered ? ' ✅ Covered' : ' ⏳ Pending'}`}
                            icon={{
                              url: iconUrl,
                              scaledSize: new window.google.maps.Size(40, 40),
                              anchor: new window.google.maps.Point(20, 20)
                            }}
                          />
                        );
                      })}
                    </>
                  )}
                </GoogleMap>
              </div>
            </LoadScript>
          )}
        </div>
      </div>
    )}

    {/* Legend */}
    {selectedAssignment && mapReady && (
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.greenDot} />
          <span>Covered (within 50m)</span>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.redDot} />
          <span>Pending Points</span>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.blueDot} />
          <span>Live Vehicle</span>
        </div>
      </div>
    )}
  </DashboardLayout>
);
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid #eee'
  },
  heading: { 
    fontSize: '1.4rem', 
    fontWeight: 800, 
    color: '#3b3270', 
    margin: 0 
  },
  refreshBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13
  },
  
  // ✅ NEW: SIDE-BY-SIDE LAYOUT
  mainContainer: {
    display: 'flex',
    gap: 20,
    height: 'calc(100vh - 140px)', // Full viewport minus header/legend
    alignItems: 'stretch'
  },
  routesPanel: {
    flex: '0 0 320px', // Fixed width sidebar
    background: 'white',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 32px rgba(107,46,190,0.1)',
    border: '1px solid #e8e0fc',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 140px)'
  },
  mapContainerWrapper: {
    flex: 1, // Takes remaining space
    position: 'relative'
  },
  
  selectorTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#6c2ebe',
    marginBottom: 16
  },
  assignmentTabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    height: 'calc(100% - 50px)'
  },
  tab: {
    padding: 16,
    background: '#f8f9ff',
    border: '2px solid transparent',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: 90
  },
  tabActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderColor: '#667eea',
    transform: 'translateX(4px)',
    boxShadow: '4px 0 20px rgba(102,126,234,0.3)'
  },
  tabContent: {
    textAlign: 'left'
  },
  collectorName: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 4
  },
  routeName: {
    color: '#6c2ebe',
    fontSize: 13,
    marginBottom: 12
  },
  progressChip: {
    background: 'rgba(255,255,255,0.8)',
    color: '#3b3270',
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    display: 'inline-block'
  },
  progressPercent: {
    color: '#667eea',
    fontWeight: 700
  },
  
  mapSection: {
    background: 'white',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 12px 48px rgba(107,46,190,0.15)',
    border: '1px solid #e8e0fc',
    height: '100%'
  },
  mapHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #f0f0f0'
  },
  mapTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#6c2ebe',
    margin: '0 0 8px 0'
  },
  statusRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  },
  liveIndicator: {
    background: 'linear-gradient(90deg, #4CAF50, #45a049)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700
  },
  progressSummary: {
    color: '#6c2ebe',
    fontSize: 14,
    fontWeight: 600
  },
  fullMapContainer: { // ✅ FULL HEIGHT MAP
    width: '100%',
    height: 'calc(100% - 80px)',
    borderRadius: 12,
    border: '2px solid #d4c5f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  
  legend: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    background: 'white',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    border: '1px solid #e8e0fc',
    marginTop: 12
  },
  // ... rest of styles (center, loadingSpinner, etc. remain same)
  center: { textAlign: 'center', padding: 100, color: '#6c2ebe', fontSize: 18, fontWeight: 500 },
  loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #667eea', borderRadius: '50%', width: 40, height: 40, animation: 'spin 1s linear infinite', margin: '0 auto 20px' },
  emptyState: { textAlign: 'center', padding: 80, background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)', borderRadius: 20, border: '2px dashed #d4c5f9', margin: '40px 0' },
  assignBtn: { marginTop: 20, padding: '14px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(102,126,234,0.3)' },
  mapLoading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 18, color: '#6c2ebe' },
  routeLabel: { color: '#a77fff', fontSize: 18, margin: '0 12px' },
  greenDot: { width: 16, height: 16, background: '#4CAF50', borderRadius: '50%', boxShadow: '0 0 0 2px white, 0 4px 12px rgba(76,175,80,0.4)' },
  redDot: { width: 16, height: 16, background: '#F44336', borderRadius: '50%', boxShadow: '0 0 0 2px white, 0 4px 12px rgba(244,67,54,0.4)' },
  blueDot: { width: 16, height: 16, background: '#2196F3', borderRadius: '50%', boxShadow: '0 0 0 2px white, 0 4px 12px rgba(33,150,243,0.4)' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: '#6c2ebe' }
};

