import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import WardAdminDashboard from "./pages/WardAdminDashboard";
import CollectorsPage from "./pages/CollectorsPage";
import SplashScreen from "./components/SplashScreen";

// Context: only interacts with localStorage
export const SessionContext = React.createContext();

function getSession() {
  const saved = localStorage.getItem("session");
  return saved
    ? JSON.parse(saved)
    : { isAuthenticated: false, role: null, name: null, token: null };
}

function setSessionData(session) {
  localStorage.setItem("session", JSON.stringify(session));
}
function clearSessionData() {
  localStorage.removeItem("session");
}

function App() {
  const [loading, setLoading] = React.useState(true);

  // Move useState up here to keep hooks order consistent
  const [localSession, setLocalSession] = React.useState(getSession());

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Listen for localStorage changes (for multi-tab login/logout sync)
  React.useEffect(() => {
    const handler = () => setLocalSession(getSession());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (loading) return <SplashScreen />;

  // Provider gives only methods that interact with localStorage
  const contextValue = {
    session: localSession,
    login: ({ token, role, name }) => {
      const session = { isAuthenticated: true, token, role, name };
      setSessionData(session);
      setLocalSession(session);
    },
    logout: () => {
      clearSessionData();
      setLocalSession({ isAuthenticated: false, token: null, role: null, name: null });
    },
  };

  return (
    <SessionContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/wardadmin"
            element={
              <PrivateRoute role="Ward Admin">
                <WardAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/collectors"
            element={
              <PrivateRoute role="Ward Admin">
                <CollectorsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

// PrivateRoute: checks authentication/role in localStorage
function PrivateRoute({ children, role }) {
  const { session } = React.useContext(SessionContext);
  if (!session.isAuthenticated) return <Navigate to="/" />;
  if (role && session.role !== role) return <Navigate to="/" />;
  return children;
}

export default App;