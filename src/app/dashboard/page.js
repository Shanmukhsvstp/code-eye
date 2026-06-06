"use client";
import { useAuth } from '@/context/AuthContext';
import styles from './dashboard.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import languages from '@/context/languages.json';

export default function Home() {

    const { token, user, loading, setLoading } = useAuth();
    // const roomCode = useRef("");
    const [roomCode, setRoomCode] = useState("");
    const [selectedLang,setSelectedLang] = useState("python");
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const creation_endpoint = `${BACKEND_URL}/api/rooms/create`;
    const router = useRouter();
    const supportedLang = languages.lang;
    const createRoom = async () => {
        if (roomCode !== "") {
            router.push(`/rooms/${roomCode}`)
        }
        window.startLoader?.();
        try {
            const response = await axios.get(
                creation_endpoint,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            router.push(`/rooms/${response.data?.code}`)
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user === null) router.push("/");
    }, [user]);

    return (
        <div>
            <center>
                <div style={{ padding: "40px" }}>
                    <div>
                        <p className={styles.showcaseText}>
                            A unified platform to understand and explain programming in a better way for universities.
                        </p>
                    </div>
                    <div style={{
                        marginTop: '20px'
                    }}>
                        <h1 style={{
                            fontSize: '120%',
                        }}>Choose a language</h1>
                        <select 
                            defaultValue={selectedLang} 
                            onChange={(e) => setSelectedLang(e.target.value)}
                            style={{ 
                                background: '#191F2B',
                                fontSize: '110%',
                            }}
                        >
                            {supportedLang.map((e, i) => (
                                <option key={i} value={e}>{e}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ margin: 30 }}>
                        <md-outlined-text-field
                            placeholder="Enter a code to join"
                            inputmode="" type="text" autocomplete=""
                            style={{ color: 'white' }}
                            value={roomCode}
                            onInput={(e) => setRoomCode(e.target.value)}>
                            <svg slot="leading-icon" viewBox="0 0 24 24" fill="none">
                                <rect
                                    x="3"
                                    y="6"
                                    width="18"
                                    height="12"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <circle cx="7" cy="10" r="1" fill="currentColor" />
                                <circle cx="11" cy="10" r="1" fill="currentColor" />
                                <circle cx="15" cy="10" r="1" fill="currentColor" />
                                <rect x="7" y="13" width="10" height="2" rx="1" fill="currentColor" />
                            </svg>
                        </md-outlined-text-field>
                        <br />

                        <md-filled-button style={{ padding: 15, marginTop: 30 }} onClick={createRoom} has-icon="">
                            {roomCode == "" ? (<>New Room</>) : (<>Join Room</>)}
                            <svg slot="icon" viewBox="0 0 24 24">
                                <path
                                    d="M12 5v14M5 12h14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </md-filled-button>
                    </div>
                </div>
            </center >
        </div >
    );
}