"use client";
import axios from "axios";
import { useEffect } from "react"

export default function Logout() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    useEffect(() => {
        window.startLoader?.();
        try {
            axios.get(`${BACKEND_URL}/api/auth/logout`);
            window.stopLoader?.();
        }
        catch (e) {
            console.log(e);
            window.stopLoader?.();
        }
    }, []);
    return (
        <div>
            <center>
                <h1>
                    Logout successful!
                </h1>
            </center>
        </div>
    )
}