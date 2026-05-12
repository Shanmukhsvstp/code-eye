"use client";
import React, { useEffect, useState } from 'react'
import styles from "./CreateRoom.module.css";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateRoom() {

  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const room_creation_endpoint = BACKEND_URL + "/api/rooms";

  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  const createRoom = async () => {
    // Gen. code
    axios.post(room_creation_endpoint,{},{
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
    ).then(response => {
      if (response.status == 200) {
        console.log(response);
        const code = response.data?.code;
        console.log(code);
        router.push(`/rooms/${code}`);
      }
    }).catch(error => {
        console.log(error.response?.data)
    });
  }


  return (
    <div className={styles.main}>
      Create New Room
      <button onClick={createRoom}>Create</button>
    </div>
  )
}
