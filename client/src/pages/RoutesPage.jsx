import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "./DashboardLayout";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"]; // Static library array to prevent reload warnings

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Map and location states
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 }); // Default: Chennai
  const [searchQuery, setSearchQuery] = useState("");
  const [markers, setMarkers] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [mapInstance, setMapInstance] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [placesService, setPlacesService] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/routes");
      const data = await response.json();
      setRoutes(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setLoading(false);
    }
  };

  const openModal = (route = null) => {
    if (route) {
      setEditingRoute(route);
      setRouteName(route.name);
      setMarkers(route.points || []);
      if (route.points && route.points.length > 0) {
        setMapCenter(route.points[0]);
      }
    } else {
      setEditingRoute(null);
      setRouteName("");
      setMarkers([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoute(null);
    setRouteName("");
    setMarkers([]);
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const handleMapClick = useCallback((e) => {
    const newMarker = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarkers((prev) => [...prev, newMarker]);
  }, []);

  const handleRemoveMarker = (index) => {
    setMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2 && window.google?.maps?.places) {
      try {
        const { suggestions } = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value,
          includedRegionCodes: ["in"],
        });
        setSearchSuggestions(suggestions || []);
      } catch (error) {
        console.error("Autocomplete error:", error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSelectLocation = async (placePrediction) => {
    try {
      const place = await placePrediction.toPlace();
      await place.fetchFields({ fields: ["location", "displayName"] });
      
      const location = {
        lat: place.location.lat(),
        lng: place.location.lng(),
      };
      setMapCenter(location);
      setSearchQuery(place.displayName || "Selected location");
      setSearchSuggestions([]);
    } catch (error) {
      console.error("Place details error:", error);
      alert("Failed to get location details");
    }
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    
    if (!routeName.trim()) {
      alert("Please enter a route name");
      return;
    }
    
    if (markers.length === 0) {
      alert("Please mark at least one point on the map");
      return;
    }

    const routeData = {
      name: routeName,
      points: markers,
      totalPoints: markers.length,
    };

    try {
      const url = editingRoute
        ? `http://localhost:5000/api/routes/${editingRoute.id}`
        : "http://localhost:5000/api/routes";
      
      const method = editingRoute ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeData),
      });

      if (response.ok) {
        fetchRoutes();
        closeModal();
      } else {
        alert("Failed to save route");
      }
    } catch (error) {
      console.error("Error saving route:", error);
      alert("Failed to save route");
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm("Are you sure you want to delete this route?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/routes/${routeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRoutes();
      } else {
        alert("Failed to delete route");
      }
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("Failed to delete route");
    }
  };

  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
    if (window.google?.maps?.places) {
      const service = new window.google.maps.places.PlacesService(map);
      setPlacesService(service);
    }
  }, []);

  return (
    <DashboardLayout>
      <div style={styles.headerContainer}>
        <h2 style={styles.heading}>Routes Management</h2>
        <button style={styles.addButtonTop} onClick={() => openModal()}>
          + Add Route
        </button>
      </div>

      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : routes.length === 0 ? (
          <div style={styles.emptyState}>No routes found. Click "Add Route" to create one.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Route Name</th>
                <th style={styles.th}>Total Points</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id} style={styles.tr}>
                  <td style={styles.td}>{route.id}</td>
                  <td style={styles.td}>{route.name}</td>
                  <td style={styles.td}>{route.totalPoints || 0}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() => openModal(route)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteRoute(route.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalLarge}>
            <h3 style={styles.modalHeading}>
              {editingRoute ? "Edit Route" : "Add New Route"}
            </h3>
            
            <form onSubmit={handleSaveRoute} style={styles.form}>
              <label style={styles.label}>
                Route Name
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  style={styles.input}
                  placeholder="Enter route name"
                  required
                />
              </label>

              <div style={styles.searchContainer}>
                <label style={styles.label}>
                  Search Location
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={styles.input}
                    placeholder="Search for a location..."
                  />
                </label>
                {searchSuggestions.length > 0 && (
                  <div style={styles.suggestionsBox}>
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        style={styles.suggestionItem}
                        onClick={() => handleSelectLocation(suggestion)}
                      >
                        {suggestion.placePrediction?.text?.toString() || "Location"}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.mapInfoBox}>
                <p style={styles.infoText}>
                  📍 Click on the map to mark collection points ({markers.length} points marked)
                </p>
                <p style={styles.infoTextSmall}>
                  Mark points along streets where garbage collectors should pass
                </p>
              </div>

              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
                <GoogleMap
                  mapContainerStyle={styles.mapContainer}
                  center={mapCenter}
                  zoom={15}
                  onClick={handleMapClick}
                  onLoad={onMapLoad}
                  options={{
                    streetViewControl: true,
                    mapTypeControl: true,
                    fullscreenControl: true,
                  }}
                >
                  {markers.map((marker, index) => (
                    <Marker
                      key={index}
                      position={marker}
                      label={(index + 1).toString()}
                      onClick={() => handleRemoveMarker(index)}
                      title={`Point ${index + 1} - Click to remove`}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>

              {markers.length > 0 && (
                <div style={styles.markersList}>
                  <h4 style={styles.markersHeading}>Marked Points:</h4>
                  <div style={styles.markersGrid}>
                    {markers.map((marker, index) => (
                      <div key={index} style={styles.markerChip}>
                        <span>Point {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMarker(index)}
                          style={styles.removeChipButton}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitButton}>
                  {editingRoute ? "Update Route" : "Save Route"}
                </button>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const styles = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontWeight: 800,
    fontSize: 26,
    color: "#3b3270",
    margin: 0,
  },
  addButtonTop: {
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(96deg,#a77fff 0%,#691ad2 95%)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 1.7px 8px #c9a9ff38",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  tableWrapper: {
    overflowX: "auto",
    marginBottom: 40,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 3px 18px #debff80a",
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    fontWeight: 700,
    fontSize: 15,
    color: "#6c2ebe",
    padding: "14px 16px",
    borderBottom: "2px solid #efe7fc",
  },
  tr: {
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "14px 16px",
    fontWeight: 500,
    fontSize: 15,
    color: "#2d2146",
  },
  editButton: {
    padding: "6px 14px",
    marginRight: 8,
    background: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #81c784",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  deleteButton: {
    padding: "6px 14px",
    background: "#ffebee",
    color: "#c62828",
    border: "1px solid #ef9a9a",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  loading: {
    textAlign: "center",
    padding: 40,
    fontSize: 16,
    color: "#6c2ebe",
  },
  emptyState: {
    textAlign: "center",
    padding: 60,
    fontSize: 16,
    color: "#8e7bb8",
    background: "#faf8ff",
    borderRadius: 12,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    overflowY: "auto",
    padding: "20px 0",
  },
  modalLarge: {
    background: "#fff",
    borderRadius: 18,
    padding: 30,
    width: 800,
    maxWidth: "95vw",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 8px 32px #b18aff66",
    display: "flex",
    flexDirection: "column",
  },
  modalHeading: {
    fontWeight: 800,
    fontSize: 22,
    color: "#6C2EBE",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: 600,
    fontSize: 14,
    color: "#5c429e",
  },
  input: {
    marginTop: 6,
    padding: "10px 12px",
    fontSize: 15,
    borderRadius: 10,
    border: "1.5px solid #a387da",
    outline: "none",
    fontWeight: 500,
    color: "#3b3270",
    fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
    boxSizing: "border-box",
  },
  searchContainer: {
    position: "relative",
  },
  suggestionsBox: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1.5px solid #a387da",
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 200,
    overflowY: "auto",
    zIndex: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  suggestionItem: {
    padding: "10px 12px",
    cursor: "pointer",
    fontSize: 14,
    color: "#3b3270",
    borderBottom: "1px solid #f0f0f0",
    transition: "background 0.2s",
  },
  mapInfoBox: {
    background: "#f3f0ff",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d4c5f9",
  },
  infoText: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#5c429e",
  },
  infoTextSmall: {
    margin: "4px 0 0 0",
    fontSize: 12,
    color: "#8e7bb8",
  },
  mapContainer: {
    width: "100%",
    height: 450,
    borderRadius: 12,
    overflow: "hidden",
    border: "2px solid #d4c5f9",
  },
  markersList: {
    background: "#faf8ff",
    padding: 16,
    borderRadius: 10,
    border: "1px solid #e8e0fc",
  },
  markersHeading: {
    margin: "0 0 12px 0",
    fontSize: 15,
    fontWeight: 700,
    color: "#6c2ebe",
  },
  markersGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  markerChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    background: "#fff",
    border: "1px solid #c9b3f0",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    color: "#5c429e",
  },
  removeChipButton: {
    background: "none",
    border: "none",
    color: "#c62828",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 12,
  },
  submitButton: {
    padding: "10px 28px",
    background: "linear-gradient(96deg,#a77fff 0%,#691ad2 95%)",
    borderRadius: 12,
    color: "#fff",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  cancelButton: {
    padding: "10px 28px",
    background: "#efebfa",
    borderRadius: 12,
    border: "none",
    color: "#6926a5",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};