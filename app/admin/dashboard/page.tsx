"use client";
import "./style.css";
import { useEffect, useState } from "react";
import MonthlySales from "@/components/admin/analytics/MonthlySales"


interface Stats {
  orders: number;
  revenue: number;
  users: number;
  products: number;
}

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  total: number;
  status: string;
}



export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);


    useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

    const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders/latest-orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);



  return (
    <div className="dashboard-container">

    <section className="kpi-section flex">
      <div className="kpi-card">
        <h3>Orders</h3>
        <p>{stats?.orders ?? "-"}</p>
      </div>
      <div className="kpi-card">
        <h3>Revenue</h3>
        <p>${stats?.revenue.toLocaleString() ?? "-"}</p>
      </div>
      <div className="kpi-card">
        <h3>Users</h3>
        <p>{stats?.users ?? "-"}</p>
      </div>
      <div className="kpi-card">
        <h3>Products</h3>
        <p>{stats?.products ?? "-"}</p>
      </div>
    </section>


      {/* Charts & Analytics */}
      <section className="analytics-section">
        <div className="chart-placeholder"><MonthlySales/></div>
      </section>

      {/* Tables */}
    <section className="tables-section">
      <div className="table-card">
        <h3>Latest Orders</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>{order.firstName} {order.lastName}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>


      {/* Quick Actions */}
      <section className="quick-actions">
        <a href="/dashboard/orders?menu=orders">
        <button>Orders</button>
        </a>
        <a href="/dashboard/create?menu=create">
        <button>Add Product</button>
        </a>
        <a href="/dashboard/customers?menu-customers">
        <button>Add User</button>
        </a>
        <a href="/dashboard/settings?menu=categories">
        <button>Categories</button>
        </a>
        <a href="/dashboard/settings?menu=settings">
        <button>Settings</button>
        </a>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2026 Admin Dashboard v1.0</p>
      </footer>
    </div>
  );
}