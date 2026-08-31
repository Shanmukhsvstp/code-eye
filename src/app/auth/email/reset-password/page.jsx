"use client";

import Link from "next/link";
import styles from "./../../Auth.module.css";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!token) {
            alert("Missing or invalid reset token.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data?.detail || "Unable to reset password.");
                setLoading(false);
                return;
            }

            alert("Password reset successfully.");
            window.location.href = "/auth/email/login";
        } catch (err) {
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.card}>

                <Link href="/auth/email/login" className={styles.back}>
                    ← Back
                </Link>

                <h1 className={styles.title}>
                    Set new password
                </h1>

                <p className={styles.subtitle}>
                    {token
                        ? "Enter a new password for your account."
                        : "This reset link is invalid or missing a token."}
                </p>

                {token && (
                    <form className={styles.form} onSubmit={handleSubmit}>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="password">
                                New password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="confirmPassword">
                                Confirm password
                            </label>

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Repeat your new password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submit}
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset password"}
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

export default function ResetPassword() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}