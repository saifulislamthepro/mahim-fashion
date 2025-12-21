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
                <h2>Mahim fashion</h2>
                <p>Mahim Fashion — A Bangladeshi fashion brand bringing premium quality and everyday style together.</p>
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
                    <li><i className="fas fa-envelope"></i> info@mahimfashion.com</li>
                    <li><i className="fas fa-map-marker-alt"></i> flat: 7A, House: 237/10, Protibondi tower,  <br /> Dhaka-1216, Bangladesh </li>
                </ul>
                </div>

            { /* <!-- Social --> */}
                <div className="footer-section">
                <h3>Follow Us</h3>
                <div className="social-icons">
                    <a href="" 
                        target="_blank"
                        rel="noopener noreferrer"
                        ><i className="fab fa-facebook-f"></i></a>

                    <a href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        ><i className="fab fa-youtube"></i></a>
                </div>
                </div>
            </div>

            <div className="payment">
                <img src="/images/payment.jpg" alt="payment" />
            </div>

            <div className="footer-bottom">
                © 2025 SmartGenIT. All rights reserved.
            </div>
        </footer>
    )
}