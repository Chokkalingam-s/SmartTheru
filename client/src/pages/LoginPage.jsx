import React, { useContext, useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (data) => {
    setUser(data);
    navigate('/dashboard');
  };

  const handleSignup = (data) => {
    setUser(data);
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#dfdbdbff', padding: '1rem' }}>
      {isLogin ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <p style={{marginTop:'1rem', cursor:'pointer', color:'#845bbdff'}} onClick={() => setIsLogin(false)}>Don't have an account? Sign Up</p>
        </>
      ) : (
        <>
          <SignupForm onSignup={handleSignup} />
          <p style={{marginTop:'1rem', cursor:'pointer', color:'#845bbdff'}} onClick={() => setIsLogin(true)}>Already have an account? Login</p>
        </>
      )}
    </div>
  );
};

export default LoginPage;
