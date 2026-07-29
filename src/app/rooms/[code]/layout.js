"use client";

import Participants from "@/components/BottomToolBar/Participants/Participants";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import styles from './idk.module.css'
import { useRoomContext } from "@/context/RoomContext";


export default function RootLayout({ children }) {
    const { isAdmin } = useRoomContext();
    return (
        <div style={{ flex: "1 1 auto", minHeight: 0, width: "100%", display: "flex", flexDirection: "column" }}>
            <ResizablePanelGroup orientation="horizontal" style={{ flex: "1 1 auto", minHeight: 0 }}>
                <ResizablePanel defaultSize="70%">
                    {children}
                </ResizablePanel>
                {
                    isAdmin && (
                        <>
                            <ResizableHandle withHandle className={styles.divider} />
                            <ResizablePanel>
                                <div className={styles.windows}>
                                    <Participants />
                                </div>
                            </ResizablePanel>
                        </>
                    )
                }
            </ResizablePanelGroup>
        </div>
    );
}