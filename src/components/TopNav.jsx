"use client";
import React, { useEffect, useState } from 'react'
import '@material/web/all.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './TopNav.module.css'
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { LuLogOut } from 'react-icons/lu';


export default function TopNav() {

    const router = useRouter();
    const [logoutHovered, setLogoutHovered] = useState(false);

    const gotoHome = () => {
        router.push("/");
    }

    useEffect(() => {
        document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
    }, []);

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
            <Link
                href="/auth/logout"
                onMouseEnter={() => setLogoutHovered(true)}
                onMouseLeave={() => setLogoutHovered(false)}
                onClick={() => window.startLoader?.()}
            >
                {logoutHovered ? <FiLogOut style={{ color: 'var(--foreground)' }} /> : <LuLogOut />}
            </Link>
        </div>
    )
}