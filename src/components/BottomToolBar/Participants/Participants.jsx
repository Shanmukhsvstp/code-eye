"use client";
import React from 'react'
import styles from './Participants.module.css'
import { useRoomContext } from '@/context/RoomContext';

export default function Participants({ participants }) {
  const { showParticipantsWindow, setShowParticipantsWindow } = useRoomContext();
  const handleDismiss = () => {
    setShowParticipantsWindow(false);
  }
  if (!showParticipantsWindow) return null;
  return (
    <div className={styles.main}>

      <div className={styles.labelDiv}>
        <div className={styles.label}>
          <span>Participants</span>
          {/* <div className={styles.info}>
            <FaInfoCircle />
            <span className={styles.tooltip}>
              Each input is provided to your program as a separate test case.
            </span>
          </div> */}
        </div>

        <button onClick={handleDismiss} title='Dismiss' className={styles.dismiss}>
          <FaPlus />
        </button>
      </div>

    </div>
  )
}
