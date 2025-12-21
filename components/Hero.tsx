"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";
import "./Hero.css";

type Product = ProductType;

export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Simulate fetching products (replace with real API call)
    const fetchProducts = async () => {
      // Example: replace with fetch("/api/products") in real app
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // Auto-slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) =>
        prev + 2 >= products.length ? 0 : prev + 2
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [products]);

  if (!mounted) return null;

  // Slice 2 products at a time
  const visibleProducts = products.slice(index, index + 2);

  const handleNext = () => {
    setIndex((prev) =>
      prev + 2 >= products.length ? 0 : prev + 2
    );
  };

  const handlePrev = () => {
    setIndex((prev) =>
      prev - 2 < 0 ? Math.max(products.length - 2, 0) : prev - 2
    );
  };

  return (
    <div className="hero">
      <div className="flex">
        <section className="grid">
          <div className="hero-texts flex column">
            <h1>NEW COLLECTION</h1>
          </div>

          <div className="hero-products flex">
            {visibleProducts.map((p) => (
              <a href={`/product/${p._id}`} key={p._id}>
                <img src={p.thumbnail} alt="product" />
              </a>
            ))}
          </div>

          <div className="btn-div flex">
            <div className="btn-container flex">
              <button><a href="/shop">Go To Shop</a></button>
              <div className="arrow-container flex">
                <button onClick={handlePrev}>Prev</button>
                <button onClick={handleNext}>Next</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}