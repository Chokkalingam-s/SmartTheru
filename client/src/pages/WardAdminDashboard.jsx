import React, { useContext } from "react";
import { SessionContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function WardAdminDashboard() {
  const totalAreaCovered = "5.2 km²";
  const gcLoggedIn = 8;
  const cleanlinessScore = "94%";
  const checkpoints = 16;
  const checkpointsCovered = 11;
  const activeGC = 7;
  const lastSync = "5 min ago";

  const { logout, session } = useContext(SessionContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={styles.bg}>
      <aside style={styles.sidenav}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>♻️</div>
          <span style={styles.logoText}>WardClean</span>
        </div>
        <nav>
          <div style={styles.navSection}>
            <a href="#" style={{ ...styles.navItem, ...styles.navItemActive }}>
              Dashboard
            </a>
            <a href="#" style={styles.navItem}>
              Map
            </a>
            <a href="#" style={styles.navItem}>
              Checkpoints
            </a>
            <a href="#" style={styles.navItem}>
              Collectors
            </a>
            <a href="#" style={styles.navItem}>
              Reports
            </a>
          </div>
        </nav>
      </aside>

      <main style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.titleBox}>
            <h1 style={styles.heading}>Ward Admin Dashboard</h1>
            <span style={styles.lastSync}>Last Sync: {lastSync}</span>
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

        {/* KPI Cards */}
        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Total Area Covered</div>
            <div style={styles.cardValuePrimary}>{totalAreaCovered}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardLabel}>GCs Logged In</div>
            <div style={styles.cardValueGreen}>{gcLoggedIn}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Cleanliness Score</div>
            <div style={styles.cardValuePrimary}>{cleanlinessScore}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Checkpoints Monitored</div>
            <div style={styles.cardValue}>{checkpoints}</div>
            <div style={styles.cardSub}>
              Covered: <span style={styles.subGreen}>{checkpointsCovered}</span>
            </div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Active Collectors</div>
            <div style={styles.cardValue}>{activeGC}</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Download Reports</div>
            <button style={styles.reportButton}>Performance Report</button>
          </div>
        </div>

        {/* Graph and Map row (static placeholder) */}
        <div style={styles.row}>
          <div style={styles.widget}>
            <div style={styles.widgetTitle}>Checkpoints Progress</div>
            <div style={styles.progressBarBox}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${(checkpointsCovered / checkpoints) * 100}%`,
                }}
              />
            </div>
            <div style={styles.progressLabel}>
              {checkpointsCovered} of {checkpoints} checkpoints covered
            </div>
          </div>
          <div style={styles.widget}>
            <div style={styles.widgetTitle}>
              Today's Collector Activity (Snapshot)
            </div>
            <div style={styles.avatarsGroup}>
              {[...Array(gcLoggedIn)].map((_, i) => (
                <div
                  key={i}
                  style={{ ...styles.avatar, background: "#a387da" }}
                >
                  {String.fromCharCode(66 + i)}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#7b7e91" }}>
              Active on Field Now
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  bg: {
    height: "100vh",
    minHeight: "100%",
    width: "100vw",
    background: "#f7f7fa",
    display: "flex",
    fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
  },
  sidenav: {
    minWidth: 220,
    width: 220,
    background: "#fff",
    borderRight: "1.5px solid #eee",
    padding: "26px 0 0 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    boxShadow: "2px 0 8px #ede7fa30",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    fontWeight: 800,
    padding: "0 32px 20px 32px",
    fontSize: 18,
    gap: 10,
  },
  logoIcon: {
    color: "#8d4ce0",
    fontSize: 26,
  },
  logoText: {
    color: "#6C2EBE",
    fontWeight: 800,
  },
  navSection: {
    display: "flex",
    flexDirection: "column",
    padding: "10px 8px",
    gap: 7,
    marginTop: 24,
  },
  navItem: {
    padding: "10px 16px",
    fontSize: 15,
    color: "#6b6d7b",
    borderRadius: 8,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all .13s",
  },
  navItemActive: {
    color: "#6C2EBE",
    background: "#efe7fc",
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
  heading: {
    fontWeight: 800,
    fontSize: 26,
    color: "#3b3270",
    marginBottom: 2,
  },
  lastSync: {
    color: "#a387da",
    fontSize: 13,
    fontWeight: 500,
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
  cardGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: "24px",
    marginBottom: 32,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "18px 20px",
    boxShadow: "0 4px 22px 2px #d0b2fa09",
    minHeight: 100,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative",
  },
  cardLabel: {
    color: "#726b95",
    fontWeight: 600,
    fontSize: 15,
    marginBottom: 2,
  },
  cardValuePrimary: {
    color: "#7B36DF",
    fontWeight: 800,
    fontSize: 26,
    marginTop: 3,
  },
  cardValue: {
    color: "#2d2146",
    fontWeight: 800,
    fontSize: 25,
    marginTop: 3,
  },
  cardValueGreen: {
    color: "#3dbc79",
    fontWeight: 800,
    fontSize: 25,
    marginTop: 3,
  },
  cardSub: {
    color: "#888db3",
    fontSize: 14,
    marginTop: 7,
    fontWeight: 500,
  },
  subGreen: {
    color: "#41c477",
    fontWeight: 700,
    marginLeft: 4,
  },
  reportButton: {
    width: "100%",
    padding: "9px 0",
    marginTop: 6,
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 15,
    border: "none",
    background: "linear-gradient(96deg,#a77fff 0%,#691ad2 95%)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 1.7px 8px #c9a9ff38",
  },
  row: {
    display: "flex",
    gap: "24px",
    marginTop: "0px",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "stretch",
  },
  widget: {
    flex: 1,
    minWidth: 320,
    background: "#fff",
    borderRadius: 16,
    padding: "22px 26px 18px 24px",
    display: "flex",
    flexDirection: "column",
    marginBottom: 18,
    boxShadow: "0 3px 18px #debff80a",
  },
  widgetTitle: {
    fontWeight: 700,
    color: "#5c429e",
    fontSize: 17,
    marginBottom: 25,
    letterSpacing: "-0.005em",
  },
  progressBarBox: {
    width: "100%",
    background: "#eee7fa",
    borderRadius: 7,
    height: "12px",
    overflow: "hidden",
    marginBottom: 6,
    marginTop: 6,
    boxShadow: "0 1px 8px #cdb9f748",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg,#34e2ad,#772ee6 75%)",
    borderRadius: 7,
    transition: "width 0.35s",
  },
  progressLabel: {
    marginTop: 7,
    color: "#7445b2",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: "0.01em",
  },
  avatarsGroup: {
    display: "flex",
    gap: 12,
    margin: "22px 0 10px 3px",
    flexWrap: "wrap",
  },
  avatar: {
    width: 38,
    height: 38,
    background: "#7B36DF",
    borderRadius: "50%",
    color: "#fff",
    fontWeight: 700,
    fontSize: 17,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1.5px 8px #c5b1fe40",
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
