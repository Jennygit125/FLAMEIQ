"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { setAuthToken, logoutUser } from "../app/utils/auth";


interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("flameiq_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Unable to restore user:", error);
          localStorage.removeItem("flameiq_user");
        }
      }
    }
  }, []);

  const login = (userData: User, token: string) => {
    if (typeof window !== "undefined") {
    
      setAuthToken(token);
      
      
      localStorage.setItem("flameiq_user", JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logout = () => {
    
    logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
