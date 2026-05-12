"use client";
import { useAuth } from '@/context/AuthContext';
import styles from './home.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {

  const { token, user, loading, setLoading } = useAuth();
  // const roomCode = useRef("");
  const [roomCode, setRoomCode] = useState("");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const creation_endpoint = `${BACKEND_URL}/api/rooms/create`;
  const router = useRouter();

  useEffect(()=>{
    if (user !== null) router.push("/dashboard");
    else router.push("/auth")
  }, [user]);

  return (
    <div>
      <center>
        Loading...
     </center>
    </div>
  );
}
