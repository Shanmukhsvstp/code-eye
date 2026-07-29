"use client";
import React from 'react'
import styles from './Participants.module.css'
import { useRoomContext } from '@/context/RoomContext';
import { FaXmark, FaUserXmark } from 'react-icons/fa6';

export default function Participants({ participants, onKick }) {
  const { showParticipantsWindow, setShowParticipantsWindow } = useRoomContext();

  const handleDismiss = () => {
    setShowParticipantsWindow(false);
  }

  const handleKick = (e, clientId) => {
    e.preventDefault();
    e.stopPropagation();
    onKick?.(clientId);
  }

  if (!showParticipantsWindow) return null;

  return (
    <div className={styles.main}>
      <div className={styles.labelDiv}>
        <div className={styles.label}>
          <span>Participants</span>
        </div>
        <button onClick={handleDismiss} title='Dismiss' className={styles.dismiss}>
          <FaXmark />
        </button>
      </div>

      <div className={styles.content}>
        {[...participants]
          .sort((a, b) => b.stress_score - a.stress_score)
          .map((client) => (
            <div key={client.id} className={styles.participantDiv}>
              <a className={styles.participantInfo} href={`#${client.id}`}>
                <span className={styles.name}>{client.name}</span>
                <span className={styles.id}>ID: {client.id}</span>
              </a>
              <button
                onClick={(e) => handleKick(e, client.id)}
                title={`Kick ${client.name}`}
                className={styles.kickBtn}
              >
                <FaUserXmark />
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}