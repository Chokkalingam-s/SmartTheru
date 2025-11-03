import React, { useEffect, useState } from "react";

export default function CollectorsPage() {
  const [collectors, setCollectors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobile: "", address: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/collectors")
      .then((res) => res.json())
      .then((data) => {
        setCollectors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
    if (!formData.name || !formData.mobile || !formData.address) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/collectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newCollector = await response.json();
      setCollectors((prev) => [...prev, newCollector]);
      closeModal();
    } catch {
      alert("Failed to add collector");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Collectors</h2>
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Mobile Number</th>
                <th style={styles.th}>Address</th>
              </tr>
            </thead>
            <tbody>
              {collectors.map((collector) => (
                <tr key={collector.id} style={styles.tr}>
                  <td style={styles.td}>{collector.id}</td>
                  <td style={styles.td}>{collector.name}</td>
                  <td style={styles.td}>{collector.mobile}</td>
                  <td style={styles.td}>{collector.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button style={styles.addButton} onClick={openModal}>
        + Add
      </button>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeading}>Add New Collector</h3>
            <form onSubmit={handleAddCollector} style={styles.form}>
              <label style={styles.label}>
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </label>
              <label style={styles.label}>
                Mobile Number
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
                  style={{ ...styles.input, height: 60, resize: "vertical" }}
                  required
                />
              </label>
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitButton}>
                  Add
                </button>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          table {
            font-size: 14px;
          }
          th, td {
            padding: 8px 6px;
          }
          .addButton {
            padding: 8px 14px;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    padding: 24,
    fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
    color: "#3b3270",
    background: "#f7f7fa",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  heading: {
    fontWeight: 800,
    fontSize: 26,
    marginBottom: 20,
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
  addButton: {
    position: "fixed",
    bottom: 24,
    left: 24,
    padding: "12px 24px",
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(96deg,#a77fff 0%,#691ad2 95%)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 1.7px 8px #c9a9ff38",
    transition: "background 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 18,
    padding: 30,
    width: 360,
    maxWidth: "90vw",
    boxShadow: "0 5px 20px #b18aff66",
    display: "flex",
    flexDirection: "column",
  },
  modalHeading: {
    fontWeight: 800,
    fontSize: 20,
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
    padding: "8px 12px",
    fontSize: 15,
    borderRadius: 10,
    border: "1.5px solid #a387da",
    outline: "none",
    fontWeight: 500,
    color: "#3b3270",
    fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
    boxSizing: "border-box",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 12,
  },
  submitButton: {
    padding: "8px 24px",
    background: "linear-gradient(96deg,#a77fff 0%,#691ad2 95%)",
    borderRadius: 16,
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 24px",
    background: "#efebfa",
    borderRadius: 16,
    border: "none",
    color: "#6926a5",
    fontWeight: 700,
    cursor: "pointer",
  },
};
