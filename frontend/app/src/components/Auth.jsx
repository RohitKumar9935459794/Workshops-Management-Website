import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, createUser } from '../services/api';
import './Auth.css'; // Create this CSS file

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('admin'); // default usertype
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginUser(email, password);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      // Redirect on successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-image-container">
          <img 
            src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/NIELIT-Preview.png" 
            alt="NIELIT Logo" 
            className="auth-image"
          />
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2>Workshop Management Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>User Type:</label>
              <select value={usertype} onChange={(e) => setUsertype(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="subadmin">Subadmin</option>
                <option value="student">Student</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn">
              Login
            </button>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;