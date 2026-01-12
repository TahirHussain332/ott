import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import Background from "../components/Background";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      // store JWT token
      localStorage.setItem("token", res.token);

      // redirect after login
      navigate("/movies");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container">
      <Background />
      <div className="login-container">
        <div className="form-decoration"></div>

        <div className="form-header">
          <div className="form-icon"></div>
          <h2>Welcome Back</h2>
          <p className="form-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
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

          <div className="forgot-password">
            <a href="#" className="forgot-link">Forgot your password?</a>
          </div>

          <button type="submit" className="btn-primary">Sign In</button>
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
          <p>Don't have an account? <a href="/register" className="auth-link">Create one now</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
