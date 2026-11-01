"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { IUser } from "../types";
import { api } from "../lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; photoURL?: string }) => Promise<boolean>;
  loginWithGoogle: (googleUser?: { name?: string; email?: string; photoURL?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "studiospace_cached_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore cached user immediately to prevent flashing/redirect on route reloads
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.user));
      } else {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch {
      // If getMe fails (e.g. 401 or network), clear user
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.auth.login(credentials);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.user));
        toast.success(res.message || "Welcome back to StudioSpace!");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "Failed to log in. Please check your credentials.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    photoURL?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.auth.register(data);
      if (res.success) {
        toast.success(res.message || "Account registered successfully! Please log in.");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "Registration failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleUser?: {
    name?: string;
    email?: string;
    photoURL?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      // Creator quick-auth simulation for staging/demo
      const defaultUser = {
        name: googleUser?.name || "Marcus Sterling (Google Creator)",
        email: googleUser?.email || "creator.google@studiospace.io",
        photoURL:
          googleUser?.photoURL ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      };

      const res = await api.auth.googleAuth(defaultUser);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.user));
        toast.success("Successfully authenticated with Google!");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "Google authentication failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      toast.success("Logged out successfully.");
    } catch {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      toast.success("Logged out.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

