"use client";
import React, { useEffect } from 'react'
import styles from './Terminal.module.css'
import { WrapText } from 'lucide-react';
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

                            <pre style={{
                                whiteSpace: "pre-wrap",
                                color: data.stderr ? "red" : "inherit"
                            }}>
                                <hr />
                                <br />
                                {(data.stderr || data.stdout || "").replace(/\\n/g, "\n")}
                                <br />
                                <hr />
                                <br />
                                {data.message || `exited with code ${data?.exit_code ? data.exit_code : 0}`} in {data?.time}s and used {data.memory} bytes
                                <br />
                                <br />
                                <hr />
                            </pre>


                        </div>
                        <br />
                        <br />
                        <br />
                    </div>
                )
                    :
                    (
                        <div>
                            {/* {data} */} An error occured. Please check the code.
                        </div>
                    )
            }
        </div>
    )
}
