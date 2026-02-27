

"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyOtpComp() {
  const [mounted, setMounted] = useState(false);
  const params = useSearchParams();
  const email = params ? params.get("email") || "" : "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verify = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (data.error) return setError(data.error);

    window.location.href = `/reset-password?email=${email}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="page verify-otp flex">
      <section>
      <div className="login-card">
        <h1>Verify OTP</h1>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={verify} className="login-form">
          <div className="input-group">
            <i className="fa-solid fa-key"></i>
            <input
              type="number"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button className="login-btn">Verify OTP</button>
        </form>
      </div>
      </section>
    </div>
  );
}
