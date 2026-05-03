"use client";
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function page() {
    const searchParams = useSearchParams();
    const msg = searchParams.get("msg");
    const router = useRouter();
    useEffect(() => {
        window.startLoader?.();

        const timer = setTimeout(() => {
            router.push("/dashboard"); // redirect
        }, 3000);
        return () => clearTimeout(timer);
    });

    return (
        <div>{msg} <br /> Redirecting...</div>
    )
}
