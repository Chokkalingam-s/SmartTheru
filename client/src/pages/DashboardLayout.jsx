// DashboardLayout.jsx
import React, { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import { SessionContext } from "../App";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, session } = useContext(SessionContext);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div style={styles.bg}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main style={styles.main}>
          {/* Topbar */}
          <div style={styles.topbar}>
            <button
              className="hamburger-btn"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke="#6c2ebe"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke="#6c2ebe"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
            <div style={styles.titleBox}>
              {/* Optional: Dynamic page title, else omit */}
              {/* Intended to be filled by child component */}
            </div>
            <div style={styles.profile}>
              <span style={styles.profileName}>
                {session && session.name ? session.name[0] : "A"}
              </span>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {children}
        </main>
      </div>

      <style>{`
        .hamburger-btn {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px 0 0;
          margin-right: 12px;
          align-self: center;
        }
        @media (max-width: 600px) {
          .hamburger-btn {
            display: block;
          }
          main {
            padding: 14px 12px 20px 12px !important;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    width: "100vw",
    background: "#f7f7fa",
    display: "flex",
    fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
  },
  main: {
    flex: 1,
    padding: "35px 36px 20px 44px",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleBox: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  profileName: {
    width: 42,
    height: 42,
    background: "linear-gradient(133deg, #c7aaff 0%, #8e53e6 90%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 12px #c7aaff55",
    letterSpacing: 1,
  },
  logoutBtn: {
    marginLeft: 16,
    padding: "6px 18px",
    background: "#efebfa",
    color: "#6926a5",
    fontWeight: 600,
    fontSize: "14px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.12s",
  },
};