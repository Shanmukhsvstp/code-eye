"use client";
import React, { useEffect, useState } from 'react';
import styles from './Input.module.css';
import { FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';

export default function Input({ onInputsChange }) {
    const [inputs, setInputs] = useState([]);

    const handleAddInput = () => {
        setInputs(prev => [...prev, ""]);
    };

    const handleInputChange = (index, value) => {
        const updated = [...inputs];
        updated[index] = value;
        setInputs(updated);
    };

    const handleRemoveInput = (index) => {
        const updated = inputs.filter((_, i) => i !== index);
        setInputs(updated);
    };

    useEffect(() => {
        onInputsChange(inputs);
    }, [inputs, onInputsChange]);
    return (
        <div className={styles.inputTerminal}>

            <div className={styles.labelDiv}>
                <div className={styles.label}>
                    <span>Inputs</span>
                    <div className={styles.info}>
                        <FaInfoCircle />
                        <span className={styles.tooltip}>
                            Each input is provided to your program as a separate test case.
                        </span>
                    </div>
                </div>

                <button onClick={handleAddInput} title='Add an input' className={styles.addInput}>
                    <FaPlus />
                </button>
            </div>

            <div className={styles.content}>
                {inputs.map((inputVal, index) => (
                    <div key={index} className={styles.inputRow}>
                        <span className={styles.inputIndex}>
                            {index + 1}.
                        </span>
                        <input
                            type='text'
                            value={inputVal}
                            onChange={(e)=>handleInputChange(index, e.target.value)}
                            placeholder={`Input #${index+1}`}
                            className={styles.inputField}
                            />
                        <button
                            type='button'
                            onClick={()=>handleRemoveInput(index)}
                            className={styles.deleteBtn}>
                                <FaTrash />
                        </button>
                    </div>
                ))}
                {inputs.length === 0 && (
                    <div className={styles.emptyState}>
                        No inputs added yet. Click "+ Add Input" to create a test case.
                    </div>
                )}
            </div>

        </div>
    )
}
