"use client";

import Link from "next/link";
import styles from "./../../Auth.module.css";
import { useState } from "react";

export default function ForgotPassword() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");

        console.log({ email });

        // TODO: call your backend here

        setSubmitted(true);
    };

    return (
        <main className={styles.main}>
            <div className={styles.card}>

                <Link href="/auth/email/login" className={styles.back}>
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
                    <form className={styles.form} onSubmit={handleSubmit}>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="email">
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

                        <button
                            type="submit"
                            className={styles.submit}
                        >
                            Send reset link
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