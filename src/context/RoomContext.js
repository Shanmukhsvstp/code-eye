"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const RoomContext = createContext({
  isAdmin: false,
  setIsAdmin: () => {},
  showParticipantsWindow: false,
  setShowParticipantsWindow: {},
  participantsData: []
});

export const RoomProvider = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState(false);
  const [participantsData, setClientsGlobally] = useState([]);
  const [showParticipantsWindow, setShowParticipantsWindow] = useState(false);

  return (
    <RoomContext.Provider value={{ isAdmin, setIsAdmin, setClientsGlobally, showParticipantsWindow, setShowParticipantsWindow, participantsData }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);