"use client";

import { useEffect, useState } from "react";
import "./Orders.css";
import { ProductType } from "@/types/product";

type size= {
  name: string;
  stock: number;
}
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    }

    loadOrders();
  }, []);

  // Change status
  const markDelivered = async (orderId: string) => {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "delivered" }),
    });

    const data = await res.json();

    if (res.ok && data?.order) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "delivered" } : o
        )
      );
      alert("Order marked as delivered!");
    } else {
      alert("Failed to update");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to update");
  }
};  // Change status
  const CancelOrder = async (orderId: string) => {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "canceled" }),
    });

    const data = await res.json();

    if (res.ok && data?.order) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "canceled" } : o
        )
      );
      alert("Order Canceled!");
    } else {
      alert("Failed to update");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to update");
  }
};


  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-page">
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order._id} className="order-card">

            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className={`status-badge ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-info">
              <p><strong>Name:</strong> {order.firstName} {order.lastName}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Total:</strong> ৳{order.total}</p>
              <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>

            {/* Expandable details */}
            <details className="details-box">
              <summary>View Details</summary>

              <div className="details-content">
                <h4>Items</h4>

                {order.items.map((item: any) => (
                  <div key={item.productId} className="item-row">
                    <img src={item.image} alt={item.title} />
                    <div>
                      <p><strong>{item.title}</strong></p>
                      <div>Size: {item.size.map((s: size, i: any) => <p key={i}>{s.name} = {s.stock}</p>)}</div>
                      <p>Qty: {item.qty}</p>
                      <p>৳{item.price}</p>
                    </div>
                  </div>
                ))}

                <h4>Shipping</h4>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Zone:</strong> {order.shippingZone}</p>
                <p><strong>Notes:</strong> {order.notes || "No notes"}</p>

                {(order.status === "pending" || order.status === "paid") && (
                  <button
                    className="deliver-btn"
                    onClick={() => markDelivered(order._id)}
                  >
                    Mark as Delivered
                  </button>
                )}

                {(order.status === "pending") && (
                  <button
                    className="deliver-btn"
                    onClick={() => CancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
