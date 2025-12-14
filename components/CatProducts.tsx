"use client";

import { useState, useEffect, useRef } from "react";
import { ProductType } from "@/types/product";
import Image from "next/image";
import "./Products.css";
import { addToCart } from "./cartHelpers";

type Props = {
  products: ProductType[];
};

export default function CatProductSlider({ products }: Props) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    
    
    

  // Detect mobile screen
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 640);
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

useEffect(() => {
  setMounted(true);
  if(isMobile) return;
  const interval = setInterval(() => {
    setIndex((prev) => {
      // When only 4 items are left, reset to 0
      if (prev === products.length - 3) {
        return 0;
      }
      return prev + 1;
    });
  }, 5000);

  return () => clearInterval(interval);
}, [products.length]);


  if (!mounted) return null;

  if (isMobile) {
    return (
      <div className="mobile-grid grid">
        {products.map((item) => (
          <div className="mobile-product" key={item._id}>
            <a href={`/product/${item._id}`}>
            <div className="img">
            <img src={item.images[0]} alt={item.title} loading="lazy"/>
            </div>
            <h3>{item.title}</h3>
            </a>
            <div className="flex">
              <p>{item.price} টাকা</p>
              <p>View Details</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  else 
  if (products.length < 4) {
  return (
    <div className="flex">
      <section>        
        <div className="web-grid grid">
          {products.map((item) => (
            <div className="web-product" key={item._id}>
              <a href={`/product/${item._id}`}>
              <div className="img">
              <img src={item.images[0]} alt={item.title} loading="lazy" />
              </div>
              <h3>{item.title}</h3>
              </a>
              <div className="flex">
                <p>{item.price} টাকা</p>
              <p>View Details</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
  return (
    <div className="products-slider-container">
        <div className="flex">
            <section>
                <div className="slider-wrapper">
                    <div
                    className="slider-track"
                    style={{ transform: `translateX(-${index * 260}px)` }} // card width + gap
                    >
                    {products.map((item) => (
                        <div className="product-card" key={item._id}>
                        <a href={`/product/${item._id}`}>
                          <div className="img-box">
                              <div className="img">
                                  <img src={item.images[0]} alt={item.title} loading="lazy"/>
                              </div>
                          </div>
                          <h3>{item.title}</h3>
                        </a>
                        <div className="flex">
                          <p>{item.price} টাকা</p>
                          <p>View Details</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
}
