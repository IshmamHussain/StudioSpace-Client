"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { IUser } from "../types";
import { api } from "../lib/api";
import { authClient } from "../lib/auth-client";
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
      // 1. Check Better Auth active session
      const betterSession = await authClient.getSession().catch(() => null);
      if (betterSession?.data?.user) {
        const bUser = betterSession.data.user;
        const mappedUser: IUser = {
          id: bUser.id,
          name: bUser.name,
          email: bUser.email,
          photoURL:
            bUser.image ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(bUser.name)}`,
          role: (bUser as any).role || "creator",
        };
        setUser(mappedUser);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mappedUser));
        setLoading(false);
        return;
      }

      // 2. Fallback to API getMe check
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.user));
      } else {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch {
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

      // If explicit user details were provided:
      if (googleUser && googleUser.email) {
        const res = await api.auth.googleAuth({
          name: googleUser.name || googleUser.email.split("@")[0],
          email: googleUser.email,
          photoURL: googleUser.photoURL,
        });
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.user));
          toast.success("Signed in with Google!");
          return true;
        }
      }

      // Initiate official BetterAuth Google OAuth 2.0 flow
      const targetOrigin = typeof window !== "undefined" ? window.location.origin : "https://studio-space-rho.vercel.app";
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${targetOrigin}/`,
        errorCallbackURL: `${targetOrigin}/login?error=google_failed`,
      });

      if (res?.error) {
        const msg = res.error.message || "";
        if (msg.includes("CLIENT_ID_AND_SECRET_REQUIRED") || res.error.status === 400 || res.error.status === 500) {
          toast.error(
            "Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env to redirect to Google accounts."
          );
        } else {
          toast.error(msg || "Google authentication failed.");
        }
        return false;
      }

      if (res?.data?.url) {
        window.location.href = res.data.url;
        return true;
      }

      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate Google sign-in.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut().catch(() => {});
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
