"use client";
import { useEffect, useState } from "react";
import "./Footer.css";

export default function Footer() {

const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;


    return(
        <footer className="footer">
            <div className="footer-container">
                { /* <!-- Brand --> */}
                <div className="footer-section">
                <h2>Ravaa</h2>
                <p>Ravaa — A Bangladeshi fashion brand bringing premium quality and everyday style together.</p>
                </div>

                { /* <!-- Navigation --> */}
                <div className="footer-section">
                <h3>Explore</h3>
                <ul>
                    <li><a href="/shop">Shop</a></li>
                    <li><a href="/new-arrival">New-arrival</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
                </div>

            { /* <!-- Contact --> */}
                <div className="footer-section">
                <h3>Contact</h3>
                <ul className="contact">
                    <li><i className="fas fa-envelope"></i> info@ravaabd.com</li>
                    <li><i className="fas fa-map-marker-alt"></i> flat: 9A, House: 137/10, SR Plaza (9th floor),  <br />Mazar Road, Mirpur-01, Dhaka-1216, Bangladesh </li>
                </ul>
                </div>

            { /* <!-- Social --> */}
                <div className="footer-section">
                <h3>Follow Us</h3>
                <div className="social-icons">
                    <a href="https://www.facebook.com/ravaafashion"><i className="fab fa-facebook-f"></i></a>
                    <a href="https://www.youtube.com/ravaafashion"><i className="fab fa-youtube"></i></a>
                </div>
                </div>
            </div>

            <div className="payment">
                <img src="/images/payment.jpg" alt="payment" />
            </div>

            <div className="footer-bottom">
                © 2025 SmartGen Digital. All rights reserved.
            </div>
        </footer>
    )
}