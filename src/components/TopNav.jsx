"use client";
import React, { use, useEffect, useState } from 'react'
import '@material/web/all.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './TopNav.module.css'
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { LuLogOut } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';


export default function TopNav() {

    const router = useRouter();
    const [logoutHovered, setLogoutHovered] = useState(false);
    // const [user, setUser] = useState(null);

    const { user, loading, token } = useAuth();



    const gotoHome = () => {
        router.push("/");
    }

    useEffect(() => {
        document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
    }, []);

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <div className={styles.main}>
            <Link className={styles.branding} href={'/'}
                onClick={() => window.startLoader?.()}>
                <Image
                    id='logo'
                    width={30}
                    height={30}
                    src={'/favicon.ico'}
                    alt='CodeEye Logo' />
                <p style={{ fontWeight: 700 }}>Code<span style={{ color: 'var(--foreground)' }}>Eye</span></p>
            </Link>

            <img
                width={30}
                height={30}
                src={user ? user.profile_picture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt='Profile' />

            {user ? (
                <Link
                    href="/auth/logout"
                    onMouseEnter={() => setLogoutHovered(true)}
                    onMouseLeave={() => setLogoutHovered(false)}
                    onClick={() => window.startLoader?.()}
                >
                    {logoutHovered ? <FiLogOut style={{ color: 'var(--foreground)' }} /> : <LuLogOut />}
                </Link>
            )
                :
                (
                    <Link
                        href="/auth"
                        // onMouseEnter={() => setLogoutHovered(true)}
                        // onMouseLeave={() => setLogoutHovered(false)}
                        onClick={() => { window.startLoader?.(); }}
                    >
                        Login
                    </Link>
                )}

        </div>
    )
}