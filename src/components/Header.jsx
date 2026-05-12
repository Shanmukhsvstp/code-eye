"use client";
import axios from 'axios';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Header() {
    const [token, setToken] = useState(null);
    const router = useRouter();
    const path = usePathname();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const validation_url = BACKEND_URL + "/api/auth/validate";

    // Check if auth is valid
    useEffect(()=>{
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        if (!storedToken) return;
        axios.get(validation_url, {
            headers: {
                'Authorization': `Bearer ${storedToken}`
            }
        }).then(response => {
            if (response.data?.token) {
                localStorage.setItem("token", response.data?.token);
            }
        }).catch(error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            router.push("/");
        } else {
            console.log("ERR:", error.response?.data?.error);
        }
        });
    },[]);

    // useEffect(() => {
    //     if (token === null && (!path.includes("auth") && path !== "/")) {
    //         router.push("/");
    //     }
    //     else if (token !== null && path.includes("auth")) {
    //         router.push("/dashboard")
    //     }
    // }, [token, path]);
    return (
        <header className="body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link href={'/'} className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <p className="ml-3 text-xl">CodeEye</p>
                </Link>
                <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700 flex flex-wrap items-center text-base justify-center">
                    <Link href={"/"} className="mr-5 hover:text-white">Home</Link>
                    <a className="mr-5 hover:text-white">Second Link</a>
                    <a className="mr-5 hover:text-white">Third Link</a>
                    <a className="mr-5 hover:text-white">Fourth Link</a>
                </nav>
                <Link href={'/auth/signup'} className="custom-btn inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">Get Started
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </Link>
            </div>
        </header>
    )
}
