import React,{useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import WardAdminDashboard from "./pages/WardAdminDashboard";
import SplashScreen from "./components/SplashScreen";

// Create a session context
export const SessionContext = React.createContext();

function App() {
  const [loading, setLoading] = useState(true);
  // In-memory session only
  const [session, setSession] = useState({
    isAuthenticated: false,
    role: null,
    name: null,
    token: null
  });

  // Show splash for 1.5 seconds on startup
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <SplashScreen />;

  // The provider supplies the session info and login/logout methods
  return (
    <SessionContext.Provider
      value={{
        session,
        login: ({ token, role, name }) =>
          setSession({ isAuthenticated: true, token, role, name }),
        logout: () =>
          setSession({ isAuthenticated: false, token: null, role: null, name: null }),
      }}
    >
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

// PrivateRoute: renders children only if logged in & role matches
function PrivateRoute({ children, role }) {
  const { session } = React.useContext(SessionContext);
  if (!session.isAuthenticated) return <Navigate to="/" />;
  if (role && session.role !== role) return <Navigate to="/" />;
  return children;
}

export default App;