"use client";

import Link from "next/link";
import { useRef } from "react";
import "../../globals.css";
import axios from "axios";

export default function Home() {

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const signup_endpoint = `${BACKEND_URL}/api/auth/signup`;

  const signup = async () => {
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (password.length < 8) return;
    console.log(signup_endpoint);
    try {
      const response = await axios.post(
        signup_endpoint,
        {
          username,
          email,
          password
        },
      );
      console.log(response.request);
      if (response.status == 200) {
        const token = response.data?.token;
        localStorage.setItem("token", token);
      }
    }
    catch (error) {
      console.error(error.response?.data?.error);
    }
  }


  return (
    <div>
      <div className="container">
        <div>
          <h1>Get Started with CodeEye</h1>
          <input ref={usernameRef} type="text" className="username-imp" placeholder="username" />
          <input ref={emailRef} type="email" className="email-inp" placeholder="example@gmail.com" />
          <input ref={passwordRef} type="password" className="password-imp" placeholder="*********" />
          <button onClick={signup}>Get Started</button>
        </div>
        <p>Already have an account? <Link href={'/auth/login'}>Login</Link> instead.</p>
      </div>
    </div>
  );
}
