'use client'

import { useRouter } from 'next/navigation';
import './AdminProducts.css';
import { useEffect, useState } from "react";
import Image from 'next/image';
import { set } from 'mongoose';

type Size = {
  name: string;
  stock: number;
};

type Product = {
  _id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  stock: Size[];
  images: string[];
};

export default function AdminProducts() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setIndex] = useState(0);
  const [showMenu, setShowmenu] = useState(false);
  const fetchProducts = async()=>{
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Failed to load products:", err);
          setLoading(false);
        });
  }


  const handleDelete = async(_id: string) => {

    const res = await fetch(`/api/products/${_id}`,{
        method: "DELETE"
    })

    const data = await res.json();
    fetchProducts();
  }

  const handleMenuClick = (i: number) => {
    setIndex(i);
    setShowmenu(!showMenu);
  }


  const handleEditClick = (id: string) => {
  router.push(`/admin/dashboard/products/edit/${id}`);
};

  useEffect(() => {
    fetchProducts()      
    setMounted(true);      
  }, []);

if (!mounted) return null;
  return (
    <div className="main-page">

      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && <p>No products found.</p>}

      <div className="product-list flex">
        {products.map((p, i) => (
          <div key={i} className="product-card">
            <h4>{p.title}</h4>
            <i className="fa fa-ellipsis-v" aria-hidden="true" onClick={()=> handleMenuClick(i)}></i>
            <div className={showMenu && selectedIndex === i? "menu show-menu":"menu"}>
                <h4 onClick={()=>handleEditClick(p._id)}>Edit</h4>
                <h4 onClick={()=> handleDelete(p._id)}>Delete</h4>
            </div>
            <p>💰 {p.price} ৳</p>
            <p>Category: {p.category}</p>

            <div className="product-images">
                <img className="product-thumbnail" src={p.images[0]} alt={p.title}/>               
            </div>

            <div className="stock-info">
              {p.stock.map((s, idx) => (
                <p key={idx}>
                  Size: {s.name} Stock: {s.stock}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
