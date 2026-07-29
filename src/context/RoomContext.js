"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const RoomContext = createContext({
  isAdmin: false,
  setIsAdmin: () => {},
  showParticipantsWindow: false,
  setShowParticipantsWindow: {},
  participantsData: [],
  roomWebSocketRef: null
});

export const RoomProvider = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState(false);
  const [participantsData, setClientsGlobally] = useState([]);
  const [showParticipantsWindow, setShowParticipantsWindow] = useState(false);
  const roomWebSocketRef = useRef(null);

  return (
    <RoomContext.Provider value={{ isAdmin, setIsAdmin, setClientsGlobally, showParticipantsWindow, setShowParticipantsWindow, participantsData, roomWebSocketRef }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);