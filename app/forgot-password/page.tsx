"use client";

import "@/components/auth/styles.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

  const searchEmail = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`/api/auth/find-email/${email}`,);

    const data = await res.json()
    if (!data.account) {
      setErrorMsg("Invalid email");
      return;
    }

    router.push(`/confirm-otp/?email=${email}`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="login page">
      <div className="flex">
        <div className="login-card">
          <h1>Forgot Password?</h1>
          <p className="subtitle">Find Your Account</p>

          {/* ERROR MESSAGE */}
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <form className="login-form">
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

            <button onClick={searchEmail} className="login-btn" type="submit">
              Send Code
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
