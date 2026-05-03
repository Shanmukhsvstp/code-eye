import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getUser = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/api/user/current`,
      { withCredentials: true }
    );
    return res.data;
  } catch {
    return null;
  }
};