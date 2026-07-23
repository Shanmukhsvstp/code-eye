"use client";
import React, { useEffect } from 'react'
import styles from './Terminal.module.css'
import { WrapText } from 'lucide-react';
import Output from './Output/Output';
import Input from './Input/Input';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
// (found: object with keys {type, error, stdout, stderr, compile_output, message, status, time, memory, exit_code})
export default function Terminal({ OutputData, onInputsChange }) {

    return (
        <div className={styles.terminal}>
            <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel>
                    <Output data={OutputData} />
                </ResizablePanel>
                <ResizableHandle withHandle className={styles.divider} />
                <ResizablePanel>
                    <Input onInputsChange={onInputsChange} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
