

"use client";
import "./styles.css";


import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 Get callback URL from dynamic path: /signup/[callbackUrl]
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const signup = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");

    // SEND DATA TO BACKEND API
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Something went wrong");
      return;
    }

    // AUTO LOGIN USER
    await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl,
    });
  };

  return (
    <div className="flex page">
      <div className="main">
        <div className="login-card">
          <h1>Create Account</h1>
          <p className="subtitle">Signup to get started</p>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <form onSubmit={signup} className="login-form">
            <div className="input-group">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <i className="fa-solid fa-phone"></i>
              <input
                type="phone"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn" type="submit">
              Create Account
            </button>

            <div className="or">
              <span></span> OR <span></span>
            </div>

            <button
              type="button"
              className="google-btn"
              onClick={() =>
                signIn("google", { callbackUrl: callbackUrl })
              }
            >
              <i className="fa-brands fa-google"></i>
              Sign in with Google
            </button>

            <p>
              Already have an account?{" "}
              <a href="/login">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
