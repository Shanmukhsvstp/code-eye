"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import "@material/web/textfield/filled-text-field";
import { Editor } from "@monaco-editor/react";
import { useAuth } from "@/context/AuthContext";
import styles from "./rooms.module.css";
import { FaPlay } from "react-icons/fa";
import languages from "@/context/executable_languages.json"
import Terminal from "@/components/Terminal/Terminal";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


export default function RoomPage() {
    const { code } = useParams();
    const { user } = useAuth();

    const executable_languages = languages.executable_languages;

    const [codeExecutable, setCodeExecutable] = useState(false);
    const [executing, setExecuting] = useState(false);

    const [output, setOutput] = useState("Your output is showed here.")

    const [inputs, setInputs] = useState([]);

    // const [currUser, setCurrUser] = useState(user);
    const [choosenLang, setChoosenLang] = useState("python");
    const currUser = user;
    // const path = usePathname();
    const [currCode, setCurrCode] = useState("");
    const [link, setLink] = useState("");

    const ws_url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/rooms/${code}`;


    const [role, setRole] = useState(null);
    const [clients, setClients] = useState([]);
    // const router = useRouter();
    const socketRef = useRef(null);
    const timeoutRef = useRef(null);
    const executeTimeoutRef = useRef(null);

    useEffect(() => {
        if (!role) {
            window.startLoader?.();
        } else {
            window.stopLoader?.();
        }
        updateLink();
    }, [role]);


    const updateLink = () => {
        setLink(`${location.href}`)
    };
    const addClient = (newClient) => {
        setClients((prev) => [...prev, newClient]);
    };

    const updateClient = (id, updater) => {
        setClients((prev) =>
            prev.map((client) => {
                if (client.id !== id) return client;

                // allow function pr datatype
                const updates = typeof updater === "function" ? updater(client) : updater;

                return { ...client, ...updates };
            })
        );
    };

    const runCode = () => {
        window.startLoader?.();
        if (executing) return;
        setExecuting(true);

        if (currCode == "") return;
        if (!socketRef.current || socketRef.current.readyState !== 1) return;

        clearTimeout(executeTimeoutRef.current);
        console.log(currCode);
        timeoutRef.current = setTimeout(() => {
            socketRef.current.send(
                JSON.stringify({
                    type: "code_execution",
                    code: currCode || "",
                    default_lang: choosenLang
                })
            );
        }, 10000);
    }

    const removeClient = (user_id) => {
        setClients((prev) => prev.filter((client) => client.id !== user_id));
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(link);
            alert("Copied the link")
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (!code) return;

        const token = localStorage.getItem("token");
        const final_ws_url = ws_url + `?token=${token}`;
        const ws = new WebSocket(final_ws_url);

        socketRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            window.stopLoader?.();
            console.log(data)
            if (data.type === "room_state") {
                // console.log(data.default_lang);
                setChoosenLang(data.default_lang);
                if (executable_languages.includes(choosenLang)) {
                    setCodeExecutable(true);
                }
                const clientsData = data.users
                    .filter(user => Number(user.user_id) !== Number(currUser?.id))
                    .map(
                        user => ({
                            id: Number(user.user_id),
                            name: user.display_name,
                            code: "",
                            stress_score: 0
                        })
                    );
                setClients(clientsData);
            }
            if (data.type === "user_joined") {
                console.log(data?.user_id);
                console.log(user?.id);
                if (data?.user_id == user?.id) {
                    setRole(data.role);
                }
                if (data?.role == "client" && Number(data.user_id) !== Number(user?.id)) {
                    addClient({
                        id: Number(data?.user_id),
                        code: "",
                        name: data?.display_name,
                        stress_score: 0
                    });
                }
            }
            if (data.type === "code_update") {
                updateClient(Number(data.user_id), (client) => ({
                    code: data.code,
                    stress_score: data.stress_score ?? client.stress_score
                }));
            }
            if (data.type === "full_sync") {
                const clientsData = Object.entries(data.code)
                    .filter(([id]) => Number(id) !== Number(user?.id))
                    .map(([id, code]) => ({
                        id: Number(id),
                        name: data.profiles?.[id] || "User " + id,
                        code,
                        stress_score: 0
                    }));
                setClients(clientsData);
            }
            if (data.type === "user_left") {
                removeClient(data.user_id);
            }
            if (data.type === "restore_code") {
                setCurrCode(data.code);
            }
            if (data.type === "code_execution") {
                setExecuting(false);
                window.stopLoader?.();
                console.log(data);
                setOutput(data);
            }

        };

        return () => ws.close();

    }, [code, user]);

    const handleChange = (value) => {
        setCurrCode(value);
        if (!socketRef.current || socketRef.current.readyState !== 1) return;

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            socketRef.current.send(
                JSON.stringify({
                    type: "code_change",
                    code: value || "",
                })
            );
        }, 50);
    }

    if (!role) {

        // window.startLoader?.();
        return <div>Loading</div>

    }

    return (
        <div style={{ height: "100vh" }}>
            {role === "client" && (
                <ResizablePanelGroup orientation="vertical" className={styles.editorContainer}>

                    <ResizablePanel defaultSize={75} minSize={35}>
                        <div className={styles.editorWrapper}>

                            <div className={styles.toolbar}>
                                {codeExecutable && (
                                    <button
                                        className={styles.runBtn}
                                        disabled={executing}
                                        onClick={runCode}
                                    >
                                        <FaPlay />
                                        Run
                                    </button>
                                )}
                            </div>

                            <div className={styles.editor}>
                                <Editor
                                    height="100%"
                                    language={choosenLang}
                                    value={currCode}
                                    onChange={handleChange}
                                    theme="vs-dark"
                                    options={{
                                        automaticLayout: true,
                                        minimap: { enabled: true },
                                        fontSize: 14,
                                        scrollBeyondLastLine: false,
                                    }}
                                />
                            </div>

                        </div>
                    </ResizablePanel>
{/* 
                    {
                        codeExecutable && 
                    } */}
                            

                    {codeExecutable && (
                        <>
                            <ResizableHandle withHandle className={styles.divider}/>
                            <ResizablePanel defaultSize={100}>
                                <div className={styles.terminalContainer}>
                                    <Terminal OutputData={output} onInputsChange={(inps)=>{setInputs(inps)}}/>
                                </div>
                            </ResizablePanel>
                            
                        </>
                    )}
                </ResizablePanelGroup>
            )}

            {role === "admin" && (
                <div style={{ padding: 20 }}>
                    <center>
                        <md-filled-text-field value={link} readOnly={true} type="text" inputmode="" autocomplete=""></md-filled-text-field>
                        <md-filled-button style={{ padding: 15, marginLeft: 20 }} onClick={copyLink} has-icon="">
                            Share
                            <svg slot="icon" viewBox="0 0 24 24">
                                <path
                                    d="M12 5v14M5 12h14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </md-filled-button>
                    </center>
                    {
                        [...clients].sort((a, b) => b.stress_score - a.stress_score).map((client) => (
                            <div key={client.id} className={styles.previewDiv}>
                                <p>{client.name} (ID: {client.id})</p>
                                {/* <pre className={styles.codePreviewer}>
                                    {client.code.split("\n").map((line, index) => (
                                        <span key={index} className={styles.line}>
                                            {line}
                                            {"\n"}
                                        </span>
                                    ))}
                                </pre> */}
                                <Editor
                                    className={styles.codePreviewer}
                                    height="40vh"
                                    defaultLanguage={choosenLang ?? "java"}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        automaticLayout: true,
                                    }}
                                    value={client.code} />
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
}
