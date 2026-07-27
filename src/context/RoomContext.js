"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const RoomContext = createContext({
  isAdmin: false,
  setIsAdmin: () => {}
});
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const user_profile_endpoint = "/api/user/profile/"

export const RoomProvider = ({ children }) => {

  const [isAdmin, setIsAdmin] = useState(false);
  const [clients, setClientsGlobally] = useState([]);

//   useEffect(() => {
//     window.startLoader?.();
//     const loadUser = async (authToken) => {
//       try {
//         const user_profile = await axios.get(
//           `${BACKEND_URL}${user_profile_endpoint}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${authToken}`,
//             }
//           }
//         );
//         setUser(user_profile?.data);
//       }
//       catch (error) {
//         console.log(error);
//       }
//     };

//     getUser().then((data) => {
//       console.log(`DATA: ${data}`);
//       const authToken = data?.token;
//       localStorage.setItem("token", authToken);
//       setToken(authToken);
//       setLoading(false);

//       if (authToken) {
//         loadUser(authToken);
//         window.stopLoader?.();
//       }
//     });
//   }, []);

  return (
    <RoomContext.Provider value={{ isAdmin, setIsAdmin, setClientsGlobally }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);