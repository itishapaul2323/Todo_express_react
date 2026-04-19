import { useState } from "react";
import axios from "axios";
import UsernameForm from "./UsernameForm";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function signin() {
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/signin`, {
        username,
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      navigate("/todos");
    } catch (e) {
      const msg =
        e.response?.data?.message || "Sign in failed. Check your credentials.";
      setError(msg);
    }
  }

  return (
    <>
      <div className="signup-box">
        <div className="Heading">
          <h1>Sign in</h1>
          <span>Welcome back</span>
        </div>
        <div className="input-container">
          <UsernameForm
            username={username}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
          />
        </div>
        <button type="button" onClick={() => signin()}>
          Sign in
        </button>
      </div>
      <div className="error">
        <span>{error}</span>
      </div>
      <div className="signin-msg">
        <span>
          Need an account? <Link to="/">Sign up</Link>
        </span>
      </div>
    </>
  );
}

export default Signin;
