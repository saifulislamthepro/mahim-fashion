"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import "@/components/auth/styles.css";

import VerifyOtpComp from "@/components/auth/ConfirmOTP";


export default function Page() {

  
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpComp/>
      </Suspense>
    );
}