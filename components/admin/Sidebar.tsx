"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";




export default function Sidebar({onToggle}: {onToggle: () => void}) {
    const [mounted, setMounted] = useState(false);
    const [showNav, setShowNav] = useState("overview");
    const params = useSearchParams();

    const menu = params.get("menu");

  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);


  const handleLogout = () => {
    const confirmAction = confirm("Sure want to logout?")
    if(!confirmAction) return;
    signOut();
  }

 
    const handlemenu = () => {
      setShowNav(`${menu}`);
    setShowMenu(!showMenu);
    onToggle();
    }
    
    useEffect(() => {
        setMounted(true);
        handlemenu();
    }, []);


    if (!mounted) return null;


    console.log(showNav);
    return (
      <div>
      <aside className={`sidebar ${showMenu ? 'menu-active' : ''}`}>
          <h2>Menu</h2>
          <nav className="flex">
            <a href="/admin/dashboard?menu=overview" className={showNav === "overview" ? " active" : "overview"}><i className="fa fa-home" aria-hidden="true"></i>Overview</a>
            <a href="/admin/dashboard/create?menu=create" className={showNav === "create" ? "active" : 'create'}><i className="fa fa-plus-square" aria-hidden="true"></i>Create</a>
            <a href="/admin/dashboard/products?menu=products" className={showNav === "products" ? "active" : "products"}><i className="fa fa-sitemap" aria-hidden="true"></i>Products</a>
            <a href="/admin/dashboard/categories?menu=categories" className={showNav === "categories" ? "active" : "categories"}><i className='fa fa-cog' aria-hidden='true'></i>Categories</a>
            <a href="/admin/dashboard/orders?menu=orders" className={showNav === "orders" ? "active" : "orders"}><i className="fa fa-cart-arrow-down" aria-hidden="true"></i>Orders</a>
            <a href="/admin/dashboard/customers?menu=customers" className={showNav === "customers" ? "active" : "customers"}><i className="fa fa-user" aria-hidden="true"></i>Customers</a>
            <a href="/admin/dashboard/settings?menu=settings" className={showNav === "settings" ? "active" : "settings"}><i className="fa fa-cog" aria-hidden="true"></i>Settings</a>
            <a href="#" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>logout</a>
          </nav>
        </aside> 
      <div className="topbar-container">
          <header className="topbar">
              <div className="topbar-left">
                  <button onClick={() => router.back()} className="nav-btn">←</button>
                  <button onClick={() => router.forward()} className="nav-btn">→</button>
              </div>

              <div className="topbar-right">
                  <a href="/admin/dashboard" className="logo-link">
                      <img src="/logo/Logo.png" alt="Logo" className="logo" width={80}/>
                  </a>
              </div>
                  
              <div className="topbar-right">
              <div  onClick={handlemenu}>
                <div className={`bars ${showMenu ? '' : 'active'}`}><i className="fa-solid fa-bars-staggered"></i></div>
                <div className={`cross ${showMenu ? 'active' : ''}`}><i className="fa-regular fa-circle-xmark"></i></div>
              </div>
              </div>
          </header>
      </div> 
    </div>      
    )
}