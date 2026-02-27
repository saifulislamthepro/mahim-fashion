'use client';

import { useEffect, useState } from "react";
import "./monthlySales.css";

export default function MonthlySalesAnalytics() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetch("/api/admin/monthly-sales")
      .then(res => res.json())
      .then(data => setSalesData(data));
  }, []);

  const maxSale = Math.max(...salesData.map(s => s.amount), 1);



  return (
    <div className="sales-card">
      <h2 className="sales-title">Monthly Sales Analytics</h2>

      <div className="chart-container">

      
        { salesData.map((item, index) => {
          const height = (item.amount / maxSale) * 100;

          return (
            <div key={index} className="bar-wrapper">
              <div
                className="bar"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(
                    to top,
                    #22c55e,
                    rgba(34, 197, 94, ${height / 100 + 0.3})
                  )`
                }}
              >
                {item.amount > 0 && (
                  <span className="amount">৳{item.amount}</span>
                )}
              </div>
              <span className="month">{item.month.slice(0, 3)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
