"use client";
import React, { useEffect } from 'react'
import styles from './Terminal.module.css'
// (found: object with keys {type, error, stdout, stderr, compile_output, message, status, time, memory, exit_code})
export default function Terminal({ data }) {
    useEffect(() => {
        // data.stdout = data.stdout.replace(/\n/g, "<br/>");
    }, [data]);
    return (
        <div className={styles.terminal}>
            {
                data?.status ? (
                    <div>
                        {/* <pre>{data?.stdout}</pre> */}
                        <div>
                            {data.stdout.split("\n").map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                        <br />
                        <br />
                        exited with code {data?.exit_code ? data.exit_code : 0} in {data?.time}s and used {data.memory} bytes
                        <br />
                    </div>
                )
                    :
                    (
                        <div>
                            {data}
                        </div>
                    )
            }
        </div>
    )
}
