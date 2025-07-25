import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3001/reset-password/${id}/${token}`,
        { password }
      );
      if (res.data.Status === "Success") {
        navigate("/login");
      } else {
        alert("Token error...");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Reset Password</h4>
      <input
        type="password"
        placeholder="New Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Update Password</button>
    </form>
  );
}

export default ResetPassword;
