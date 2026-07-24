"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/rooms/rooms_layout.module.css'; // or your toolbar CSS module
import { FaUserGroup } from 'react-icons/fa6';

export default function BottomToolBar({ className, isCurrUserAdmin }) {

    const [isVisible, setIsVisible] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const timerRef = useRef(null);


    // Helper to start or restart the 5-second countdown
    const startTimer = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 5000); // 5 seconds
    };

    // Start 5s timer when component mounts
    useEffect(() => {
        startTimer();
        return () => clearTimeout(timerRef.current);
    }, []);

    // When mouse enters or moves in toolbar, keep it visible and reset timer
    const handleMouseEnter = () => {
        setIsVisible(true);
        clearTimeout(timerRef.current);
    };

    // When mouse leaves toolbar, start 5s countdown
    const handleMouseLeave = () => {
        startTimer();
    };

    useEffect(()=>{
        setIsAdmin(isCurrUserAdmin);
    },[isCurrUserAdmin]);

    if (isAdmin)
return (
        <>
            {/* Invisible hover zone at bottom of screen */}
            <div 
                className={styles.hoverZone} 
                onMouseEnter={handleMouseEnter} 
            />

            <div 
                className={`${className} ${!isVisible ? styles.hidden : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseEnter}
            >
                {/*LEFT*/}
                <div className={styles.toolbarSection}>
                </div>

                {/*CENTER*/}
                <div className={`${styles.toolbarSection} ${styles.center}`}>
                    <button className={styles.actionBtn}>
                        <FaUserGroup size={22} />
                        <span>Participants</span>
                    </button>
                </div>

                {/*RIGHT*/}
                <div className={styles.toolbarSection}>
                    <button className={styles.leaveBtn}>
                        End Session
                    </button>
                </div>
            </div>
        </>
    );
}