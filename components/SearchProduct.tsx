"use client";

import { useEffect, useState } from "react";

export default function SearchButton() {
    const [products, setProducts] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load ALL products once
    useEffect(() => {
        const loadProducts = async () => {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        };
        loadProducts();
        setMounted(true);
    }, []);

    // Filter in real-time
    const handleChange = (value: string) => {
        setQuery(value);

        if (!value.trim()) {
            setFiltered([]);
            setShowDropdown(false);
            return;
        }

        const search = value.toLowerCase();

        const results = products.filter((p) =>
            p.title.toLowerCase().includes(search)
        );

        setFiltered(results);
        setShowDropdown(true);
    };

    if (!mounted) return null;
    return (
        <div className="search-bar" style={{ position: "relative" }}>

            <input
                type="text"
                placeholder="...Search products"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => filtered.length > 0 && setShowDropdown(true)}
            />



            {/* ------ DROPDOWN RESULTS ------ */}
            {showDropdown && filtered.length > 0 && (
                <div
                    className="search-dropdown"
                    style={{
                        position: "absolute",
                        top: "45px",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ddd",
                        zIndex: 50,
                        maxHeight: "300px",
                        overflowY: "auto",
                        padding: "10px",
                    }}
                >
                    {filtered.map((item) => (
                        <a
                            href={`/product/${item._id}`}
                            key={item._id}
                            className="search-item"
                            style={{
                                display: "block",
                                padding: "8px 10px",
                                borderBottom: "1px solid #eee",
                            }}
                            onClick={() => {
                                setShowDropdown(false);
                                setQuery("");
                            }}
                        >
                            {item.title}
                        </a>
                    ))}
                </div>
            )}

            {/* If no result */}
            {showDropdown && query && filtered.length === 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "45px",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ddd",
                        padding: "10px",
                        zIndex: 50,
                    }}
                >
                    No products found.
                </div>
            )}
        </div>
    );
}
