"use client";
import { addToCart, clearCart } from "./cartHelpers";
import { useState, useEffect } from "react";
import { ProductType } from "@/types/product";
import Image from "next/image";
import "./Products.css";
import { set } from "mongoose";
import { clear } from "console";

type Props = {
  products: ProductType[];
};
type Size  = {
    name: string;
    stock: number;
};
export default function ProductSlider({ products }: Props) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);

    // Handle selecting size
    const handleSizeSelect = (s: Size) => {
        setSelectedSize(s);
        setQty(1);
        setAlert("Size selected, now add to cart") // reset qty when selecting a new size
    };

const handleAddToCart = (id: string) => {
  const product = products.find(p => p._id === id);
  setSelectedProduct(product || null);
    if (!selectedSize) {
      setAlert("Please select a size");
      setShowAlert(true);
      return;
    } else {
      setAlert("Size Selected, add to cart");
    }

    if (!product) return;

    addToCart({
      productId: id,
      price: product.price,
      size: selectedSize,
      qty,
      title: product.title,
      images: product.images
    });

    setAlert("Added to cart!");
    setSelectedSize(null);
    setShowAlert(false);
    window.location.href="/cart";
  };

  // Detect mobile screen
  useEffect(() => {
    setMounted(true);
    const checkScreen = () => setIsMobile(window.innerWidth <= 640);
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

useEffect(() => {
  if(isMobile) return;
  const interval = setInterval(() => {
    setIndex((prev) => {
      // When only 4 items are left, reset to 0
      if (prev === products.length - 4) {
        return 0;
      }
      return prev + 1;
    });
  }, 4000);

  return () => clearInterval(interval);
}, [products.length]);
      
  if (!mounted) return null;
  if (isMobile) {
    return (
      <div className="mobile-grid grid">
        {products.map((item) => (
          <div className="mobile-product" key={item._id} >
              <a href={`/product/${item._id}`}>
              <img src={item.images[0]} alt={item.title} loading="lazy"/>
              <h3>{item.title}</h3>
              <div className="flex">
                <p>{item.price} টাকা</p>
                <p>View Details</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  } else 
if (products.length < 4) {
  return (
    <div className="flex">
      <section>        
        <div className="web-grid grid">
          {products.map((item) => (
            <div className="web-product" key={item._id} >
              <a href={`/product/${item._id}`}>
                <img src={item.images[0]} alt={item.title} loading="lazy"/>
                <h3>{item.title}</h3>
                <div className="flex">
                  <p>{item.price} টাকা</p>
                  <p>View details</p>
                </div>
              </a>
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
                        <div className="product-card">
                          <a href={`/product/${item._id}`} key={item._id}>
                            <img src={item.images[0]} alt={item.title} loading="lazy"/>
                            <h3>{item.title}</h3>
                            <div className="flex">
                              <p>{item.price} টাকা</p>
                              <p>View Details</p>
                            </div>
                          </a>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
        </div>
    </div>
  );
}
