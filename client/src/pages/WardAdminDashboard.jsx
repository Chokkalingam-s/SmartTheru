// WardAdminDashboard.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { SessionContext } from "../App";
import DashboardLayout from "./DashBoardLayout";

// Images for collector carousel
const garbageCollectorImages = [
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&w=400&q=80",
];

// Collector image carousel
function CollectorCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(timer.current);
  }, [images.length]);

  const pause = () => clearInterval(timer.current);
  const play = () => {
    timer.current = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
  };

  return (
    <div style={styles.carouselBox} onMouseEnter={pause} onMouseLeave={play}>
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt="Collector activity"
          style={{
            ...styles.carouselImage,
            opacity: i === index ? 1 : 0,
            zIndex: i === index ? 2 : 1,
            pointerEvents: "none",
            transition: "opacity 0.6s cubic-bezier(0.77,0,0.175,1)",
          }}
        />
      ))}
    </div>
  );
}

export default function WardAdminDashboard() {
  // Dashboard data placeholders
  const totalAreaCovered = "5.2 km²";
  const gcLoggedIn = garbageCollectorImages.length;
  const cleanlinessScore = "94%";
  const checkpoints = 16;
  const checkpointsCovered = 11;
  const lastSync = "5 min ago";
  const activeGC = 7;

  return (
    <DashboardLayout>
      <div style={styles.titleBox}>
        <h1 style={styles.heading}>Ward Admin Dashboard</h1>
        <span style={styles.lastSync}>Last Sync: {lastSync}</span>
      </div>

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
          <div style={styles.widgetTitle}>Today's Collector Activity</div>
          <div style={styles.gcCarousel}>
            <CollectorCarousel images={garbageCollectorImages} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  titleBox: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBottom: 20,
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
  gcCarousel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 132,
    margin: "18px 0 10px 1px",
  },
  carouselBox: {
    position: "relative",
    width: 110,
    height: 110,
    minWidth: 80,
    minHeight: 80,
    maxWidth: 160,
    maxHeight: 160,
    borderRadius: 14,
    overflow: "hidden",
    background: "#eaddff",
    boxShadow: "0 2.5px 20px #c5b1fea8",
    margin: "0 auto",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 14,
    position: "absolute",
    left: 0,
    top: 0,
  }
};