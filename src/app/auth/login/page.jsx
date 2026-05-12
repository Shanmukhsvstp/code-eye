"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'

export default function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef();

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const login_endpoint = `${BACKEND_URL}/api/auth/login`;

    const login = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        if (password.length < 8) return;
        console.log(login_endpoint);
        try {
            const response = await axios.post(
                login_endpoint,
                {
                    username,
                    password
                },
            );
            console.log(response.request);
            if (response.status == 200) {
                const token = response.data?.token;
                console.log(token)
                localStorage.setItem("token", token);
                useRouter().push("/dashboard");
            }
        }
        catch (error) {
            if (error.response?.data?.error) {
                console.error(error.response?.data?.error);
            }
        }
    }


    return (
        <div>
            <div className="container">
                <div>
                    <h1>Login</h1>
                    <input ref={usernameRef} type="text" className="username-imp" placeholder="username or email" />
                    <input ref={passwordRef} type="password" className="password-imp" placeholder="*********" />
                    <button onClick={login}>Login</button>
                </div>
                <p>Already have an account? <Link href={'/auth/signup'}>Signup</Link> instead.</p>
            </div>
        </div>
    )
}
