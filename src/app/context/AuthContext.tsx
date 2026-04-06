'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type Role = 'USER' | 'ADMIN';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  token: string; // JWT token from backend
};

type AuthContextType = {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    role?: Role
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Auto-login: load user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  // Login
  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('https://fictilecore.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data: User = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));

      // Redirect based on role
      if (data.role.toLowerCase() === 'admin') router.push('/admin');
      else router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  // Signup
  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    role: Role = 'USER'
  ) => {
    try {
      const res = await fetch('https://fictilecore.com/api/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phoneNumber, password, role }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Auto-login after signup
      await login(email, password);
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/'); // ✅ redirect to homepage
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

/**
 * authFetch helper: automatically includes JWT token
 * Example: const data = await authFetch('/profile');
 */
export const authFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  let token: string | undefined;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user");
    token = stored ? JSON.parse(stored).token : undefined;
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers, credentials: "include" });

  if (!res.ok) {
    const text = await res.text();
    console.error("authFetch error:", res.status, text);
    throw new Error(text);
  }

  return res.json();
};