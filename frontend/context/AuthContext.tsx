'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';

export interface UserProfile {
  id: string;
  profileType: 'USER' | 'VENDOR' | 'ADMIN';
  isVerified: boolean;
  businessName?: string;
  phone?: string;
  address?: string;
  profilePic?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'VENDOR';
  profile?: UserProfile | null;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Declare logout first
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    Cookies.remove('token');
    localStorage.removeItem('user');
  }, []);

  // Declare login
  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    Cookies.set('token', newToken, { expires: 7, path: '/' });
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  // Declare updateUser
  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  // Use effect safely references logout
  useEffect(() => {
    const savedToken = Cookies.get('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
          } else {
            logout();
          }
        })
        .catch(() => {
          // Keep cached state on network connectivity failure
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook
 * @returns {Object} with user, token, isLoading, login, logout, and updateUser
 * @throws {Error} if useAuth is called outside of an AuthProvider
 * @example
 * const { user, token, isLoading, login, logout, updateUser } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};