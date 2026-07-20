import React from 'react'
import styles from './Terminal.module.css'

export default function Terminal({ data }) {
    return (
        <div className={styles.terminal}>
            {data}
        </div>
    )
}
