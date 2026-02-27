"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import "./styles.css";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  // Handle OAuth errors (Google login fail)
  useEffect(() => {
    if (urlError === "OAuthAccountNotLinked") {
      setErrorMsg("This email is already registered. Please use password login.");
    }
    if (urlError === "AccessDenied") {
      setErrorMsg("Google login was denied.");
    }
  }, [urlError]);

  const login = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl // IMPORTANT
    });

    if (res?.error) {
      setErrorMsg("Invalid email or password");
      return;
    }

    window.location.href = callbackUrl;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="login page">
      <div className="flex">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Login to continue</p>

          {/* ERROR MESSAGE */}
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <form onSubmit={login} className="login-form">
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
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn" type="submit">
              Login
            </button>

            <div>
              <p>Forgot password? <a href="/forgot-password">Reset Password</a></p>
            </div>

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
              Don't have an account? <a href={`/signup?callbackUrl=${callbackUrl}`}>Create account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
