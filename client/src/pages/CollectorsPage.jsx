import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function CollectorsPage() {
  const [collectors, setCollectors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobile: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollectors();
  }, []);

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5000/api/collectors");
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Ensure array
      if (Array.isArray(data)) {
        setCollectors(data);
      } else {
        console.error("Collectors data is not an array:", data);
        setCollectors([]);
      }
    } catch (err) {
      console.error("Collectors fetch error:", err);
      setError("Failed to load collectors. Check backend.");
      setCollectors([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", mobile: "", address: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleAddCollector = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      alert("Name and mobile are required");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/collectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const newCollector = await response.json();
      setCollectors((prev) => [newCollector, ...prev]);
      closeModal();
    } catch (error) {
      console.error("Add collector error:", error);
      alert("Failed to add collector");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={styles.center}>Loading collectors...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.header}>
        <h2 style={styles.heading}>Collectors ({collectors.length})</h2>
        <button style={styles.refreshBtn} onClick={fetchCollectors}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
          <br />
          <small>Backend collectors endpoint failed</small>
        </div>
      )}

      <div style={styles.tableWrapper}>
        {collectors.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No collectors found</p>
            <button style={styles.addButtonEmpty} onClick={openModal}>
              + Add First Collector
            </button>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Mobile</th>
                <th style={styles.th}>Address</th>
              </tr>
            </thead>
            <tbody>
              {collectors.map((collector) => (
                <tr key={collector.id} style={styles.tr}>
                  <td style={styles.td}>{collector.id}</td>
                  <td style={styles.td}>{collector.name}</td>
                  <td style={styles.td}>{collector.mobile}</td>
                  <td style={styles.td}>{collector.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button style={styles.addButton} onClick={openModal}>
        + Add Collector
      </button>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeading}>Add New Collector</h3>
            <form onSubmit={handleAddCollector} style={styles.form}>
              <label style={styles.label}>
                Name *
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  placeholder="Enter full name"
                />
              </label>
              <label style={styles.label}>
                Mobile Number *
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  style={styles.input}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10 digit number"
                  required
                />
              </label>
              <label style={styles.label}>
                Address
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ ...styles.input, height: 80 }}
                  placeholder="Enter address (optional)"
                  rows={3}
                />
              </label>
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitButton} disabled={loading}>
                  {loading ? "Adding..." : "Add Collector"}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  heading: {
    fontWeight: 800,
    fontSize: 26,
    color: "#3b3270",
    margin: 0
  },
  refreshBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(96deg,#a77fff 0%,#691ad2 95%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    textAlign: 'center'
  },
  tableWrapper: {
    overflowX: "auto",
    marginBottom: 80,
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
  emptyState: {
    textAlign: 'center',
    padding: 60,
    color: '#8e7bb8',
    background: '#faf8ff',
    borderRadius: 16,
    border: '2px dashed #d4c5f9'
  },
  addButtonEmpty: {
    marginTop: 16,
    padding: '12px 24px',
    background: 'linear-gradient(96deg,#a77fff 0%,#691ad2 95%)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    cursor: 'pointer'
  },
  addButton: {
    position: "fixed",
    bottom: 24,
    right: 24,
    padding: "16px 24px",
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(96deg,#a77fff 0%,#691ad2 95%)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 16px #a77fff40",
  },
  // ... rest of modal styles remain same
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modal: {
    background: "#fff",
    borderRadius: 20,
    padding: 32,
    width: 420,
    maxWidth: "95vw",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 40px rgba(107,46,190,0.3)",
  },
  modalHeading: {
    fontWeight: 800,
    fontSize: 22,
    color: "#6C2EBE",
    marginBottom: 24,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: 600,
    fontSize: 14,
    color: "#5c429e",
  },
  input: {
    marginTop: 8,
    padding: "12px 16px",
    fontSize: 15,
    borderRadius: 12,
    border: "2px solid #e0d7f5",
    outline: "none",
    fontWeight: 500,
    color: "#3b3270",
    transition: "border-color 0.2s",
    background: "#faf9ff"
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 20,
  },
  submitButton: {
    padding: "12px 28px",
    background: "linear-gradient(96deg,#a77fff 0%,#691ad2 95%)",
    borderRadius: 12,
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "12px 28px",
    background: "#f8f7ff",
    borderRadius: 12,
    border: "2px solid #e0d7f5",
    color: "#6926a5",
    fontWeight: 600,
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    padding: 60,
    color: "#6c2ebe",
    fontSize: 18
  }
};
