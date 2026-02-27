"use client"
import "./styles.css"
export const dynamic = "force-dynamic";


import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const params = useSearchParams();
  const email = params ? params.get("email") || "" : "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const reset = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.error) return setError(data.error);

    alert("Password updated! Please login.");
    window.location.href = "/login";
  };

  return (
    <div className="page login">
      <div className="flex">
        <div className="login-card">
          <h1>Reset Password</h1>

          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={reset} className="login-form">
            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-btn">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
