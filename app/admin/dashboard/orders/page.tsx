"use client";

import { useEffect, useState } from "react";
import "./style.css";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  total: number;
  status: string;
  phone: string;
  createdAt: string;
  items: any[];
  address: string;
  shippingZone: string;
  notes: string;
}


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);


      async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    }

  // Fetch orders
  useEffect(() => {
    setMounted(true);
    loadOrders();
  }, []);

  // Change status
  const markDelivered = async (tran_id: string) => {
  try {
    const res = await fetch(`/api/admin/orders/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "delivered", tran_id: tran_id }),
    });

    const data = await res.json();

    if (data?.order) {
      setOrders((prev) =>
        prev.map((o) =>
          o.tran_id === data.order.tran_id ? { ...o, status: "delivered" } : o
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
};

if(!mounted) return null;
else
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
                      <p>Size: {item.size}</p>
                      <p>Qty: {item.qty}</p>
                      <p>৳{item.price}</p>
                    </div>
                  </div>
                ))}

                <h4>Shipping</h4>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Zone:</strong> {order.shippingZone}</p>
                <p><strong>Notes:</strong> {order.notes || "No notes"}</p>

                {(order.status === "pending" || order.status === "paid") &&  (
                  <button
                    className="deliver-btn"
                    onClick={() => markDelivered(order.tran_id)}
                  >
                    Mark as Delivered
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
