import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginData from '../data/login.json';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user with matching credentials
    const user = loginData.users.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Store user info in localStorage (you might want to use a token in real app)
      localStorage.setItem('user', JSON.stringify({ email: user.email }));
      // Redirect to home page
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        {/* <img src="/logo.png" alt="PosLik Logo" className="logo" /> */}
        {/* <p className="tagline">Your point of sale system</p> */}
      </div>
      
      <div className="login-right">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome</h1>
          <p className="sign-in-text">Sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email here"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password here"
              required
            />
          </div>

          <button type="submit" className="sign-in-btn">
            Sign in
          </button>
        </form>

        <div className="divider">Or</div>

        <button className="google-btn">
          <img src="/gmail_icon.png" alt="Gmail" className="google-icon" />
          Sign in with Gmail
        </button>

        <div className="login-footer">
          I already have an account!
          <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
