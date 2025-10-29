import React, { useState } from 'react';
import axios from 'axios';

const roles = ['District Admin', 'Ward Admin', 'Collector'];

const SignupForm = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        role,
      });
      onSignup(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400, margin:'auto', padding:'2rem', backgroundColor:'#fff', borderRadius: '8px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
      <h2 style={{ marginBottom: '1rem', color: '#845bbdff' }}>Sign Up</h2>

      <label>
        Name
        <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width:'100%', padding:'0.5rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #E0E0E0' }} />
      </label>

      <label>
        Email
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width:'100%', padding:'0.5rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #E0E0E0' }} />
      </label>

      <label>
        Password
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width:'100%', padding:'0.5rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #E0E0E0' }} />
      </label>

      <label>
        Role
        <select value={role} onChange={e => setRole(e.target.value)} style={{ width:'100%', padding:'0.5rem', marginBottom:'1rem', borderRadius:'4px', border:'1px solid #E0E0E0' }}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>

      {error && <div style={{ color: '#FF3B30', marginBottom: '1rem' }}>{error}</div>}

      <button type="submit" style={{
        backgroundColor: '#FFD700',
        color: '#000',
        padding: '0.75rem',
        width: '100%',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}>Sign Up</button>
    </form>
  );
};

export default SignupForm;
