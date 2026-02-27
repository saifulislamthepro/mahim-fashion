'use client'

import { useRouter } from 'next/navigation';
import './style.css';
import { useEffect, useState } from "react";

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
  thumbnail: string;
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

    const confirmAction = confirm("Are You Sure want to delete this product?")

    if(!confirmAction) return ;

    const res = await fetch(`/api/products/${_id}`,{
        method: "DELETE"
    })

    const data = await res.json();
    fetchProducts();
  }


  const handleEditClick = (id: string) => {
  router.push(`/dashboard/products/edit/${id}?menu=products`);
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

      <div className="product-list">
        {products.map((p) => (
            <div key={p._id} className="product-card">

            {/* Image */}
            <div className="image-wrap">
                <img src={p.thumbnail} alt={p.title} />
                <div className="card-actions">
                <button className="edit" onClick={() => handleEditClick(p._id)}>
                    Edit
                </button>
                <button className="delete" onClick={() => handleDelete(p._id)}>
                    Delete
                </button>
                </div>
            </div>

            {/* Info */}
            <div className="card-body">
                <h4 className="title">{p.title}</h4>
                <p className="price">Price: {p.price}৳</p>
                <p className="category">Category: {p.category}</p>

                <div className="stock">
                {p.stock.map((s, i) => (
                    <span key={i}>
                        <strong>Stock--</strong>
                    {s.name}: {s.stock}
                    </span>
                ))}
                </div>
            </div>

            </div>
        ))}
        </div>

    </div>
  );
}
