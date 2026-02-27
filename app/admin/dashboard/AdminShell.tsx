"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import "./dashboard.css";
import { Suspense } from "react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex admin-container">
      <Suspense fallback={<div>Loading...</div>}>

      <div className="admin">
      <Sidebar onToggle={() => setSidebarOpen(p => !p)} />

      <main className={`content ${sidebarOpen ? "active" : ""}`}>
        {children}
      </main>
      </div>
      
      </Suspense>
    </div>
  );
}
