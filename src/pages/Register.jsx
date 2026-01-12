import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";
import Background from "../components/Background";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser({ name, email, password });

      // store JWT token
      localStorage.setItem("token", res.token);

      // redirect after registration
      navigate("/movies");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <Background />
      <div className="register-container">
        <div className="form-decoration"></div>

        <div className="form-header">
          <div className="form-icon"></div>
          <h2>Join Us Today</h2>
          <p className="form-subtitle">Create your OTT account</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
            <span className="input-icon">👤</span>
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
            <span className="input-icon">📧</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <span className="input-icon">🔒</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
            <span className="input-icon">🔐</span>
          </div>

          <button type="submit" className="btn-primary">Create Account</button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button className="social-btn google">
            <span className="social-icon">🌐</span>
            Google
          </button>
          <button className="social-btn facebook">
            <span className="social-icon">📘</span>
            Facebook
          </button>
          <button className="social-btn github">
            <span className="social-icon">💻</span>
            GitHub
          </button>
        </div>

        <div className="auth-links">
          <p>Already have an account? <a href="/login" className="auth-link">Sign in here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
