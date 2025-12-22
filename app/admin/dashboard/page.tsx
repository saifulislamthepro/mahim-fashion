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
            <div className="heading flex">
                <h1>Admin Dashboard</h1>
                <div ><a href="/dashboard"><i className="fa-solid fa-circle-user"></i></a><i className="fa-solid fa-right-from-bracket logout"></i></div>
            </div>
            <div className="flex">
                <section className="grid">
                    <div className="sidebar">
                        <h2>Sidebar</h2>
                        <ul>
                            <li onClick={() => {setShowContent("overview")}} className={showContent === "overview" ? "active" : ''}><i className="fa fa-home" aria-hidden="true"></i>Overview</li>
                            <li onClick={() => {setShowContent("create")}} className={showContent === "create" ? "active" : ''}><i className="fa fa-plus-square" aria-hidden="true"></i>Create</li>
                            <li onClick={() => {setShowContent("products")}} className={showContent === "products" ? "active" : ''}><i className="fa fa-sitemap" aria-hidden="true"></i>Products</li>
                            <li onClick={() => {setShowContent("orders")}} className={showContent === "orders" ? "active" : ''}><i className="fa fa-cart-arrow-down" aria-hidden="true"></i>Orders</li>
                            <li onClick={() => {setShowContent("customers")}} className={showContent === "customers" ? "active" : ''}><i className="fa fa-user" aria-hidden="true"></i>Customers</li>
                            <li onClick={() => {setShowContent("reports")}} className={showContent === "reports" ? "active" : ''}><i className="fa fa-bar-chart" aria-hidden="true"></i>Reports</li>
                            <li onClick={() => {setShowContent("settings")}} className={showContent === "settings" ? "active" : ''}><i className="fa fa-cog" aria-hidden="true"></i>Settings</li>
                        </ul>
                    </div>
                    <div className="main-content">
                        <h2>Welcome to the Admin Dashboard</h2>
                        <MainPage activeSidebar={showContent}/>
                    </div>
                    <div className="notifications">
                        <h2><i className="fa fa-bell" aria-hidden="true"></i>Notifications</h2>
                    </div>
                </section>
            </div>
        </div>
    );
}