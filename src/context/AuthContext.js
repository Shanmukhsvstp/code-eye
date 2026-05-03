"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import axios from "axios";

const AuthContext = createContext();
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const user_profile_endpoint = "/api/user/profile/"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {

    const loadUser = async (authToken) => {
      try {
        const user_profile = await axios.get(
          `${BACKEND_URL}${user_profile_endpoint}`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            }
          }
        );
        setUser(user_profile?.data);
      }
      catch (error) {
        console.log(error);
      }
    };

    getUser().then((data) => {
      console.log(`DATA: ${data}`);
      const authToken = data?.token;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setLoading(false);

      if (authToken) {
        loadUser(authToken);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, token, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);