import { createContext, useContext, useEffect, useState } from "react";
import { me, logout as apiLogout } from "../services/authService";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await me();
        setUser(data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, logout, booting }}>
      {children}
    </AuthCtx.Provider>
  );
}
