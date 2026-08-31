"use client";

import Link from "next/link";
import styles from "./../../Auth.module.css";
import { useState } from "react";

export default function Signup() {
    const [loading, setLoading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const formData = new FormData(e.currentTarget);

        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const password = formData.get("password")?.toString();
        const confirmPassword = formData.get("confirmPassword")?.toString();

        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters.");
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
                `${BACKEND_URL}/api/auth/signup/email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name,
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
                    "Failed to create account.";

                alert(message);
                return;
            }

            console.log("Signup successful:", data);

            // The backend creates the session here.
            // Send the user to your dashboard.
            window.location.href = "/dashboard";

        } catch (error) {
            console.error("Signup error:", error);
            alert("Unable to connect to the server. Please try again.");
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
                    Create account
                </h1>

                <p className={styles.subtitle}>
                    Create your CodeEye account and start collaborating.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>

                    <div className={styles.field}>
                        <label
                            className={styles.label}
                            htmlFor="name"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            required
                            className={styles.input}
                        />
                    </div>

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
                        />
                    </div>

                    <div className={styles.field}>
                        <label
                            className={styles.label}
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label
                            className={styles.label}
                            htmlFor="confirmPassword"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            className={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submit}
                    >
                        Create account
                    </button>

                </form>

                <div className={styles.divider}>
                    or
                </div>

                <div className={styles.footer}>
                    Already have an account?
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
