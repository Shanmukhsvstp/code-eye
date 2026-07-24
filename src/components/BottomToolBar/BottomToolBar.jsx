"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/rooms//rooms_layout.module.css'; // or your toolbar CSS module

export default function BottomToolBar({ className }) {
    const [isVisible, setIsVisible] = useState(true);
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

    return (
        <>
            {/* Invisible 20px zone at bottom of screen to trigger hover when hidden */}
            <div 
                className={styles.hoverZone} 
                onMouseEnter={handleMouseEnter} 
            />

            <div 
                className={`${className} ${!isVisible ? styles.hidden : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseEnter} /* Keeps toolbar alive while moving mouse inside */
            >
                {/* Toolbar content (Mic, Camera, Share buttons, etc.) */}
                <div>Toolbar Content</div>
            </div>
        </>
    );
}