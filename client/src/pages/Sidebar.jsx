// Sidebar.jsx
import React from "react";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className={`sidenav ${isOpen ? "open" : ""}`}>
        <div className="logoBox">
          <div style={styles.logoIcon}>♻️</div>
          <span className="logoText">Smart Theru</span>
        </div>
        <nav>
          <div style={styles.navSection}>
            <a href="#" className="navItem active">
              Dashboard
            </a>
            <a href="#" className="navItem">
              Map
            </a>
            <a href="#" className="navItem">
              Checkpoints
            </a>
            <a href="#" className="navItem">
              Collectors
            </a>
            <a href="#" className="navItem">
              Reports
            </a>
          </div>
        </nav>
      </aside>
      {/* Overlay to close sidebar on mobile */}
      {isOpen && <div className="overlay" onClick={onClose} />}
      <style>{`
        .sidenav {
          min-width: 220px;
          width: 220px;
          background: #fff;
          border-right: 1.5px solid #eee;
          padding: 26px 0 0 0;
          box-shadow: 2px 0 8px #ede7fa30;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          transition: transform 0.3s ease;
        }
        .logoBox {
          display: flex;
          align-items: center;
          font-weight: 800;
          padding: 0 32px 20px 32px;
          font-size: 18px;
          gap: 10px;
        }
        .logoText {
          color: #6c2ebe;
          font-weight: 800;
          transition: opacity 0.3s ease;
        }
        .navSection {
          display: flex;
          flex-direction: column;
          padding: 10px 8px;
          gap: 7px;
          margin-top: 24px;
        }
        .navItem {
          padding: 10px 16px;
          font-size: 15px;
          color: #6b6d7b;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.13s;
        }
        .navItem.active {
          color: #6c2ebe;
          background: #efe7fc;
        }

        /* Media Query for Mobile */
        @media (max-width: 600px) {
          .sidenav {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 999;
            box-shadow: 2px 0 8px #3339;
            padding-top: 60px;
            transform: translateX(-100%);
            width: 220px;
            background: white;
          }
          .sidenav.open {
            transform: translateX(0);
          }
          .logoBox {
            display: none;
          }
          .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 998;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  logoIcon: {
    color: "#8d4ce0",
    fontSize: 26,
  },
  navSection: {
    display: "flex",
    flexDirection: "column",
    padding: "10px 8px",
    gap: 7,
    marginTop: 24,
  },
};