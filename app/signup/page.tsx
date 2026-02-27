"use client"
export const dynamic = "force-dynamic";
import "../login/style.css";
import { Suspense } from "react";
import SignupPage from "@/components/auth/Signup";

export default function Page () {

  
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SignupPage/>
      </Suspense>
    );
}