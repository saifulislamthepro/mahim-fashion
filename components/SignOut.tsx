"use client"

import { signOut } from "next-auth/react"


const handleClick = () => {

    confirm("Are you sure you want to log out?") &&
    signOut({ callbackUrl: "/" });
}

export default function LogOutComp() {


    return(
    <button onClick={()=> handleClick()}><i className="fa-solid fa-right-from-bracket"></i> LogOut</button>
    )
}