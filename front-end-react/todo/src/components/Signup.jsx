import { useState } from "react";
import axios from "axios";
import UsernameForm from "./UsernameForm";
import { Link, useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function signup() {
    setError("");
    try {
      await axios.post(`${baseURL}/signup`, {
        username,
        password,
      });
      navigate("/signin");
    } catch (e) {
      const msg =
        e.response?.data?.message || "Error while signing up. Try again.";
      setError(msg);
    }
  }

  return (
    <>
      <div className="signup-box">
        <div className="Heading">
          <h1>Signup</h1>
          <span>Sign up to continue</span>
        </div>
        <div className="input-container">
          <UsernameForm
            username={username}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
          />
        </div>
        <button type="button" onClick={() => signup()}>
          Signup
        </button>
      </div>
      <div className="error">
        <span>{error}</span>
      </div>
      <div className="signin-msg">
        <span>
          Already have an account? <Link to="/signin">Sign in</Link>
        </span>
      </div>
    </>
  );
}

export default Signup;
