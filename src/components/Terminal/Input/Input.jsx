"use client";
import React, { useEffect, useState } from 'react';
import styles from './Input.module.css';
import { FaPlus } from 'react-icons/fa';

export default function Input({ onInputsChange }) {
    const [inputs, setInputs] = useState([]);

    useEffect(()=>{
        onInputsChange(inputs);
    }, [inputs]);
  return (
    <div className={styles.inputTerminal}>
        <div className={styles.labelDiv}>
            Inputs
            <button className={styles.addInput}><FaPlus /></button>
        </div>

    </div>
  )
}
