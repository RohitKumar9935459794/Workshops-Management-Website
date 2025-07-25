import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/forgot-password", { email });
      if (res.data.Status === "Success") {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Forgot Password</h4>
      <input
        type="email"
        placeholder="Enter Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}

export default ForgotPassword;
