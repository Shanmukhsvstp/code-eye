"use client";

import Link from "next/link";
import styles from "./../../Auth.module.css";

export default function Login() {
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const email = formData.get("email");
        const password = formData.get("password");

        console.log({ email, password });

        // TODO: call your backend here
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
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submit}
                    >
                        Login
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

