import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import api from "./api";
import { User, AuthToken } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = Cookies.get("user");
    const token = Cookies.get("token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthToken>("/api/auth/login", { email, password });
    Cookies.set("token", data.access_token, { expires: 1 });
    Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
    setUser(data.user);
    router.push("/dashboard");
  };

  const signup = async (email: string, username: string, password: string) => {
    const { data } = await api.post<AuthToken>("/api/auth/signup", { email, username, password });
    Cookies.set("token", data.access_token, { expires: 1 });
    Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
    setUser(data.user);
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
