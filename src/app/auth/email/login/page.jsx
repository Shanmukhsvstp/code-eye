"use client";

import Link from "next/link";
import styles from "./../../Auth.module.css";
import { useState } from "react";

export default function Login() {
    const [loading, setLoading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const formData = new FormData(e.currentTarget);

        const email = formData.get("email")?.toString().trim();
        const password = formData.get("password")?.toString();

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        if (!BACKEND_URL) {
            console.error("NEXT_PUBLIC_BACKEND_URL is not configured.");
            alert("Backend URL is not configured.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/auth/login/email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const message =
                    data?.detail ||
                    data?.message ||
                    "Login failed.";

                alert(message);
                return;
            }

            console.log("Login successful:", data);

            // Session cookie has been created by the backend.
            // Reload/navigate so AuthContext can detect the session.
            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Login error:", error);
            alert(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.card}>

                <Link href="/auth" className={styles.back}>
                    ← Back
                </Link>

                <h1 className={styles.title}>
                    Welcome back
                </h1>

                <p className={styles.subtitle}>
                    Login to continue collaborating on CodeEye.
                </p>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >

                    <div className={styles.field}>
                        <label
                            className={styles.label}
                            htmlFor="email"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <div className={styles.passwordRow}>
                            <label
                                className={styles.label}
                                htmlFor="password"
                            >
                                Password
                            </label>

                            <Link
                                href="/auth/email/forgot-password"
                                className={styles.forgot}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submit}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <div className={styles.divider}>
                    or
                </div>

                <div className={styles.footer}>
                    Don't have an account?
                    <Link
                        href="/auth/email/signup"
                        className={styles.link}
                    >
                        Sign up
                    </Link>
                </div>

            </div>
        </main>
    );
}

