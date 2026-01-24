'use client';

import MainPage from "./main.tsx/page";
import "./style.css";
import { useEffect, useState } from "react";


export default function AdminDashboardPage() {

    const [mounted, setMounted] = useState(false);
    const [showContent, setShowContent] = useState('overview');


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="flex layout-container">
                <section className="grid">
                    <div className="sidebar">
                        <ul>
                            <li onClick={() => {setShowContent("overview")}} className={showContent === "overview" ? "active" : ''}><i className="fa fa-home" aria-hidden="true"></i>Overview</li>
                            <li onClick={() => {setShowContent("create")}} className={showContent === "create" ? "active" : ''}><i className="fa fa-plus-square" aria-hidden="true"></i>Create</li>
                            <li onClick={() => {setShowContent("products")}} className={showContent === "products" ? "active" : ''}><i className="fa fa-sitemap" aria-hidden="true"></i>Products</li>
                            <li onClick={() => {setShowContent("orders")}} className={showContent === "orders" ? "active" : ''}><i className="fa fa-cart-arrow-down" aria-hidden="true"></i>Orders</li>
                            <li onClick={() => {setShowContent("customers")}} className={showContent === "customers" ? "active" : ''}><i className="fa fa-user" aria-hidden="true"></i>Customers</li>
                            <li onClick={() => {setShowContent("settings")}} className={showContent === "settings" ? "active" : ''}><i className="fa fa-cog" aria-hidden="true"></i>Settings</li>
                        </ul>
                    </div>
                    <div className="main-content">
                        <h2>Welcome to the Admin Dashboard</h2>
                        <MainPage activeSidebar={showContent}/>
                    </div>
                </section>
            </div>
        </div>
    );
}