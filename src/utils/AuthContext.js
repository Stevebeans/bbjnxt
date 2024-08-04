// utils/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const AUTH_URL = process.env.NEXT_PUBLIC_API_AUTH;

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      axios
        .post("/api/validate-token", { token })
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          Cookies.remove("token");
        });
    }
  }, []);

  const login = async (username, password) => {
    try {
      console.log("Attempting to login with username:", username);
      const response = await axios.post(AUTH_URL, {
        username,
        password
      });
      const { token } = response.data;

      Cookies.set("token", token, { expires: 30 });

      const decoded = jwtDecode(token);

      setUser(decoded);

      // Redirect to referrer if it exists
      const referrer = router.query.referrer || "/";
      console.log("Redirecting to referrer:", referrer);
      router.push(referrer);

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const logout = async () => {
    Cookies.remove("token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
