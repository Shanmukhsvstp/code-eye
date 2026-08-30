"use client";

import Link from "next/link";
import styles from "./../../Auth.module.css";

export default function Signup() {
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        console.log({
            name,
            email,
            password,
        });

        // TODO: call your backend here
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
