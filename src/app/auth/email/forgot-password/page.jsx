"use client";

import Link from "next/link";
import styles from "./../../Auth.module.css";
import { useState } from "react";

export default function ForgotPassword() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString().trim();

        if (!email) {
            alert("Please enter your email.");
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
                `${BACKEND_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const message =
                    data?.detail ||
                    data?.message ||
                    "Unable to process your request.";

                alert(message);
                return;
            }

            setSubmitted(true);

        } catch (error) {
            console.error("Forgot password error:", error);
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

                <Link
                    href="/auth/email/login"
                    className={styles.back}
                >
                    ← Back
                </Link>

                <h1 className={styles.title}>
                    Reset password
                </h1>

                <p className={styles.subtitle}>
                    {submitted
                        ? "Check your inbox for a reset link."
                        : "Enter your email and we'll send you a link to reset your password."}
                </p>

                {!submitted && (
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

                        <button
                            type="submit"
                            className={styles.submit}
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send reset link"}
                        </button>

                    </form>
                )}

                <div className={styles.divider}>
                    or
                </div>

                <div className={styles.footer}>
                    Remembered your password?
                    <Link
                        href="/auth/email/login"
                        className={styles.link}
                    >
                        Login
                    </Link>
                </div>

            </div>
        </main>
    );
}
