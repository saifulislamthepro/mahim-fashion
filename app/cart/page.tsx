"use client";

import { useEffect, useState } from "react";
import { getCart, CartItem, saveCart, removeFromCart } from "@/components/cartHelpers";
import "./style.css";
type Size  = {
    name: string;
    stock: number;
};
type ProductInfo = {
  productId: string;
  title: string;
  images: string[];
  size: Size[];
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);



const clearCart = () => {
  localStorage.removeItem("cart");
    const items = getCart();
    setCart(items);
};

const handleDelete = (id: string) => {
  removeFromCart(id);
    const items = getCart();
    setCart(items);
}
  useEffect(() => {
    const items = getCart();
    setCart(items);
  }, []);


  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  console.log(cart);
  return (
    <div className="cart page">
      <h2>🛒 Your Cart</h2>

      <div className="flex">
        <section>

            <div className="flex card-container column">
            {cart.length === 0 && <p className="no-item">No items in cart.</p>}

            { cart.map((item, i) => (
                <div key={i} className="cart-card"> 
                  <div className="img">
                    <img src={item.images[0]} alt="Product" />
                  </div>
                  <div className="details">
                    <i className="fa-solid fa-circle-xmark" onClick={() => handleDelete(item.productId)}></i>
                          <div className="title">
                            <strong>{item.title} </strong> 
                            <div className="flex sizes">
                              Size: {item.size.map((s, i) => 
                              <p className="flex" key={i}>{s.name}={s.stock}</p>
                              )}
                            </div>
                          </div>
                      {/* Quantity Control */}
                      <div className="functions flex">          
                        <div className="qty-control">
                          <strong>Product Quantity: {item.qty}</strong>
                        </div>
                      </div>
                      <p>Price: {item.price} × {item.qty} = {item.price * item.qty} tk</p>
                    </div>
                </div>
            ))}
            </div>    
            <div className="total flex"> 
              <div className="">
                <h3>Total: {total} tk</h3> 
                <a href="/checkout/cart">
                    <button>Proceed to Checkout</button>
                </a>  
              </div>             
            </div> 
            <a className="flex">
              <button onClick={clearCart}><i className="fa-solid fa-circle-xmark"></i>Clear cart</button>
            </a>    
        </section>
      </div>
    </div>
  );
}
