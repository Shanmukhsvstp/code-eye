import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const getUser = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/api/auth/me`,
      { withCredentials: true }
    );
    return res.data;
  } catch {
    return null;
  }
};