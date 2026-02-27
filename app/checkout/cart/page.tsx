"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import CheckoutCartPage from "@/components/Checkout";
import "../style.css";
import { SessionProvider } from "next-auth/react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
      <CheckoutCartPage/>
      </SessionProvider>
    </Suspense>
  );

}


