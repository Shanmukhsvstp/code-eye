"use client";
import { useParams } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import "@material/web/textfield/filled-text-field";
import { Editor } from "@monaco-editor/react";
import { useAuth } from "@/context/AuthContext";

export default function RoomPage() {
    const { code } = useParams();
    const { user } = useAuth();
    const [link, setLink] = useState(`https://localhost:3000/rooms/${code}`);

    const ws_url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/rooms/${code}`;
    const [role, setRole] = useState(null);
    const [clients, setClients] = useState([
        { id: "1", code: "console.log('hi')", name: "Alice", stress_score: 0.9 }
    ]);
    const [users, setUsers] = useState({})

    const socketRef = useRef(null);
    const timeoutRef = useRef(null);

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

    useEffect(() => {
        if (!code) return;

        const token = localStorage.getItem("token");
        // const token = localStorage.getItem("token");
        const final_ws_url = ws_url + `?token=${token}`;
        const ws = new WebSocket(final_ws_url);

        socketRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            if (data.type === "user_joined") {
                console.log(data?.user_id);
                console.log(user?.id);
                if (data?.user_id == user?.id) {
                    setRole(data.role);
                }
                if (data?.role == "client") {
                    addClient({
                        id: data?.user_id,
                        code: [],
                        name: data?.display_name,
                        stress_score: 0
                    });
                }
            }
            if (data.type === "code_update") {
                // setClients((prev) => ({
                //     ...prev,
                //     [data.userId]: data.code
                // }))
                updateClient(data.user_id, (client) => {
                    const new_code = [...client.code];
                    while (new_code.length <= data.line) {
                        new_code.push("");
                    }
                    new_code[data.line] = data.content;
                    return {
                        code: new_code,
                        stress_score: data.stress_score ?? client.stress_score
                    }
                });
            }

        };

        return () => ws.close();

    }, [code, user]);

    const handleChange = (value) => {
        if (!socketRef.current || socketRef.current.readyState !== 1) return;

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            socketRef.current.send(
                JSON.stringify({
                    type: "code_change",
                    code: value || "",
                })
            );
        }, 300);
    }

    if (!role) return <div>..</div>

    return (
        <div style={{ height: "100vh" }}>
            <md-filled-text-field value={link} readOnly={true} type="text" inputmode="" autocomplete=""></md-filled-text-field>

            {role === "client" && (
                <Editor
                    height="100%"
                    defaultLanguage="java"
                    defaultValue="// Start Typing here"
                    onChange={handleChange}
                />
            )}

            {role === "admin" && (
                <div style={{ padding: 20 }}>
                    <h2>Dashboard</h2>
                    {/* {Object.entries(clients).map(([id, code]) => (
                        <div key={id} style={{ border: "1px solid #ccc", margin: 10 }}>
                            <h4>Student {id}</h4>
                            <pre>{code}</pre>
                        </div>
                    ))}
 */}

                        {
                            [...clients].sort((a, b) => b.stress_score - a.stress_score).map((client) => (
                                <div key={client.id} style={{border: "1px solid #000", margin: 10}}>
                                    <p>{client.name} (ID: {client.id})</p>
                                    <pre>{client.code.join("\n")}</pre>
                                </div>
                            ))
                        }

                    {/* {[...clients]  // clone to avoid mutating state
                        .sort((a, b) => b.stress_score - a.stress_score)
                        .map((client) => (
                            <div key={client.id} style={{ border: "1px solid #ccc", margin: 10 }}>
                                <h4>{client.name} (ID: {client.id})</h4>
                                <p>Stress Score: {client.stress_score}</p>
                                <pre>{client.code}</pre>
                            </div>
                        ))} */}
                </div>
            )}
        </div>
    );
}