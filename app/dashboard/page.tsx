
import "./style.css"
import LogOutComp from "@/components/SignOut";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { Key } from "react";


type Item = {
  _id: Key;
  productId: string;
  title: string;
  size: string;
  qty: number;
  price: number;
  image: string;
  total: number;
};

type Order = {
  _id: Key;
  items: Item[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingZone: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status: string;
  userId: string;
  createdAt: Date;
};

export default async function DashboardPage() {

  const session = await getServerSession(authOptions);
    await connectDB();

    const orders =JSON.parse(JSON.stringify( await Order.find({userId: session?.user.id}).lean().sort({createdAt: -1})))

  return (
    <div className="page dashboard">
        <div className="page-title flex">            
            <h1>Dashboard Page</h1>
        </div>
        <div className="flex">
          <section className="grid">
            <div className="profile">
              <div className="profile-component flex column">
                <h2><i className="fa fa-user" aria-hidden="true"></i> Profile</h2>
                  <div className="img flex">
                    {session?.user.image ? (
                      <img
                        src={session.user?.image.toString()}
                        alt="profile"
                        width={100}
                      />
                    ) : (
                      <h1><i className="fa-solid fa-circle-user"></i></h1>
                    )}
                  </div>
                  <ul>
                    <li><strong>Name: </strong>{session?.user.name}</li>
                    <li><strong>Email: </strong>{session?.user.email}</li>
                  </ul>
                </div>
                <h2>Account Settings</h2>
                <div className="settings flex column">
                  <button>
                    <i className="fa fa-cog" aria-hidden="true"></i>Account Settings
                  </button>
                  {(session?.user.role === "admin")?<a href="/admin/dashboard"> <button>Admin Dashboard</button></a> : ""}                  
                  <LogOutComp/>
                </div>
              </div>
                
              <div className="orders">{/* Right Column: Orders */}
              <section className="orders-section">
                  {orders.length === 0 ? (
                    <p>You have no recent orders.</p>
                  ) : (
                    orders.map((o: Order) => (
                      <div className="order-card flex column" key={o._id}>
                        <div className="order-items">
                          {o.items.map((p) => (
                            <div className="order-item flex" key={p._id}>
                              <img src={p.image.toString()} alt={p.title} width={80} height={80} />
                              <div className="item-details">
                                <h3>{p.title}</h3>
                                <p><strong>Size:</strong> {p.size}</p>
                                <p><strong>Qty:</strong> {p.qty}</p>
                                <p><strong>Price:</strong> {p.price} BDT</p>
                                <p><strong>Total:</strong> {p.total} BDT</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-meta flex space-between">
                          <p><strong>Ordered At:</strong> {new Date(o.createdAt).toLocaleString()}</p>
                          <p><strong>Status:</strong> <span className={`status ${o.status}`}>{o.status.toUpperCase()}</span></p>
                          <p><strong>Total:</strong> {o.total} BDT</p>
                        </div>
                        {o.notes && <p className="order-notes"><strong>Notes:</strong> {o.notes}</p>}
                      </div>
                    ))
                  )}
                </section>
            </div>
          </section>
        </div>
      {/* Add your dashboard components and logic here */}
    </div>
  );
}