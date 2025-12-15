"use client";

import { useEffect, useRef, useState } from "react";
import "./Header.css";
import SearchButton from "./SearchProduct";

type Category = {
  name: string;
  slug: string;
  image: string;
};

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [Categories, setCategories] = useState<Category[]>([]);
  const [openMenu, setOpenMenu] = useState(false)

  // Fetch categories
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
  }
  // Effects
  useEffect(() => {
    fetchCategories();
    setMounted(true);

    // Close dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
        setDropdownOpen(false);
      }
    }

    // Scroll Listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) return null;
  return (
    <header className="navbar">
      <div className="top-bar flex">
        <section className="flex">
          <div className="phone"><i className="fa-solid fa-phone"></i>+8801901929592, +8801901929593</div>
          <div className="login"><a href="/login"><p>Login</p></a></div>
        </section>
      </div>
      <div className="flex logo-nav">
        <section className="logo-container grid">
          <a className="logo" href="/">
            <div> <img src="/logo/Logo.png" alt="logo" /></div>
          </a>
          <div className="search">
            <SearchButton/>
          </div>
          <div className="icons-container flex">
            {/* Cart */}
            <a href="/cart" className="icon-a">
              <i className="fa fa-shopping-cart"></i>
            </a>

            {/* User */}
            <a href="/dashboard" className="icon-a">
              <i className="fa fa-user"></i>
            </a></div>

        </section>
        </div>

      <div className="flex nav-header">
      <nav className={scrolled ? "navbar-container scrolled" : "navbar-container"} ref={menuRef}>

        <section className={`grid ${mobileOpen ? "open" : ""}`}>

          {/* Dropdown */}
          <div className="dropdown">
            <div
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <h3>Categories <i className="fa-solid fa-bars"></i> </h3>
              <div className={`dropdown-menu flex column ${dropdownOpen? "dropdown-open": ""}`}>
                {Categories.map((cat) => (
                  <a
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="dropdown-item flex"
                  >
                    <img src={cat.image} alt={cat.slug} width={30}/>
                    <h3>{cat.name}</h3>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="menu-container flex">
            <div className={openMenu? "links flex active" : "links flex"}>
              <a href="/"><h3>Home</h3></a>
              <a href="/new-arrival"><h3>New arrival</h3></a>
              <a href="/featured"><h3>Featured</h3></a>
              <a href="/shop"><h3>Shop</h3></a>
              <a href="/about"><h3>About Us</h3></a>
            </div>
            <div onClick={handleMenuClick} className="menu-bar flex">
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
        </section>

      </nav>
      </div>
    </header>
  );
}
