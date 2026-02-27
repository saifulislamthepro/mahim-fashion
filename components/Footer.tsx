"use client";
import { useEffect, useState } from "react";
import "./Footer.css";
type Categories = {
  name: string,
  slug: string,
  image: string
}
export default function Footer() {

const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Categories []>([{
    name: "",
    slug: "",
    image: ""
  }]);

useEffect(() => {
  setMounted(true);
    const fetchCategories = async() => {
      const res = await fetch('/api/categories')
      const data = await res.json();
      setCategories(data);
    }

    fetchCategories();
}, []);

if (!mounted) return null;


    return(
        <footer className="footer">
            <div className="">
            <div className="footer-container grid">
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
                
                <section className=" footer-section cat-container">
                    <h2>Categories</h2>
                    <div className="flex column">
                    {categories.map((cat, i) => (
                    <a href={`category/${cat.slug}`} className="footer-cat-card" key={i}>
                    {cat.name}
                    </a>
                    ))}
                    </div>

                </section>

            { /* <!-- Contact --> */}
                <div className="footer-section">
                <h3>Contact</h3>
                <ul className="contact">
                    <li><i className="fas fa-envelope"></i> monirqcm@gmail.com</li>
                    <li><i className="fas fa-map-marker-alt"></i> MAHIM FASHION HOUSE, <br />SHOP NO-42 <br /> National Federation Of the Visual Impaired (NFVI), <br /> SAVAR, DHAKA-1340 </li>
                </ul>
                </div>

            </div>

            
            </div>

            <div className="bottom flex">

                <div className="bottom-container flex">
            
                    <div className="links flex column bottom-section ">
                        <h2>  Quick links</h2>
                        <a href="/terms-and-conditions">Terms & Condition</a>
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/return-and-refund-policy">Return & Refund Policy</a>
                    </div>

                    <div className="payment bottom-section">
                        <img src="/images/payment.jpg" alt="payment" />
                    </div>
                        { /* <!-- Social --> */}
                    <div className="bottom-section">
                        <h3>Follow Us</h3>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/mahimfashionhouse.bd" 
                                target="_blank"
                                rel="noopener noreferrer"
                                ><i className="fab fa-facebook-f"></i></a>

                            <a href=""target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                        </div>            
                    </div>
                </div>
            </div>
            <div className="bottom-bottom flex">
                © 2026 Mahim Fashion House. All rights reserved.
            </div>
        </footer>
    )
}