import { useState } from "react";
import api from "../config/axios";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Ward Admin",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "/api/auth/login" : "/api/auth/signup";
    try {
      const res = await api.post(url, form);
      alert(`${isLogin ? "Login" : "Signup"} successful`);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Error occurred");
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(isLogin ? styles.tabActive : {}),
            }}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button
            style={{
              ...styles.tab,
              ...(!isLogin ? styles.tabActive : {}),
            }}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              autoComplete="name"
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <select
            name="role"
            onChange={handleChange}
            style={styles.input}
            defaultValue="Ward Admin"
          >
            <option>Ward Admin</option>
            <option>District Admin</option>
            <option>Collector</option>
          </select>
          <button type="submit" style={styles.submit}>
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f6f2ff 0%, #e6e0fa 100%)",
    padding: "0 18px",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: 400,
    borderRadius: 18,
    boxShadow: "0 6px 28px rgba(100, 42, 181, 0.09)",
    padding: "36px 28px 28px 28px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 18,
    borderBottom: "1.5px solid #ebe3fa",
  },
  tab: {
    flex: 1,
    paddingBottom: 10,
    fontWeight: 600,
    fontSize: 16,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#6e56cf",
    borderBottom: "2.5px solid transparent",
    transition: "border 0.2s, color 0.2s",
    outline: "none",
  },
  tabActive: {
    color: "#6C2EBE",
    borderBottom: "2.5px solid #6C2EBE",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 5,
  },
  input: {
    border: "1.3px solid #ded0ef",
    borderRadius: 7,
    padding: "11px 15px",
    fontSize: 16,
    outline: "none",
    transition: "box-shadow 0.16s",
    marginBottom: 3,
  },
  submit: {
    width: "100%",
    padding: "12px 0",
    background:
      "linear-gradient(90deg,#6c2ebe,#9648e5 95%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    letterSpacing: 0.5,
    marginTop: 7,
    cursor: "pointer",
    transition: "background 0.16s, box-shadow 0.14s",
    boxShadow: "0 2px 8px rgba(108,46,190,0.09)",
  },
};