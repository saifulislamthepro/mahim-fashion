'use client'

import "./style.css";
import { useEffect, useState } from "react";

export default function ContactPage() {
    const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      setMsg("Your message has been sent successfully!");
      e.target.reset();
    } else {
      setMsg("Failed to send message. Try again!");
    }
  };
useEffect(()=> {
    setMounted(true);
},[]);
if(!mounted) return null;
return (
    <div className="contact-page">
        <div className="flex">
            <section>
                {/* ---------- HERO ------------ */}
                <div className="contact-hero">
                    <h1>Contact Us</h1>
                    <p>We’re here to help you with orders, sizing, or any questions.</p>
                </div>

                <div className="contact-section">

                    {/* ---------- LEFT: DETAILS ------------ */}
                    <div className="flex">
                        <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Reach out to Ravaa Fashion for any support or queries.</p>

                        <div className="info-box">
                            <i className="fa-solid fa-phone"></i>
                            <div>
                            <h4>Phone</h4>
                            <p>01687-163735</p>
                            </div>
                        </div>

                        <div className="info-box">
                            <i className="fa-solid fa-envelope"></i>
                            <div>
                            <h4>Email</h4>
                            <p>monirqcm@gmail.com</p>
                            </div>
                        </div>

                        <div className="info-box">
                            <i className="fa-solid fa-location-dot"></i>
                            <div>
                            <h4>Location</h4>
                            <p>MAHIM FASHION HOUSE, <br />SHOP NO-42 <br /> National Federation Of the Visual Impaired (NFVI), <br /> SAVAR, DHAKA-1340</p>
                            </div>
                        </div>

                        <div className="social-links">
                            <a href="https://www.facebook.com/mahimfashionhouse.bd"><i className="fa-brands fa-facebook"></i></a>
                            <a href="https://www.youtube.com/@"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                    </div>

                    {/* ---------- RIGHT: FORM ------------ */}
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h2>Send Us a Message</h2>

                        <div className="grid-2">
                            <input name="firstName" type="text" placeholder="First Name" required />
                            <input name="lastName" type="text" placeholder="Last Name" required />
                        </div>

                        <input name="email" type="email" placeholder="Your Email" required />
                        <input name="subject" type="text" placeholder="Subject" required />

                        <textarea name="message" rows={6} placeholder="Write your message..." required></textarea>

                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>

                        {msg && <p className="form-msg">{msg}</p>}
                        </form>

                </div>
            </section>
        </div>
    </div>
  );
}
