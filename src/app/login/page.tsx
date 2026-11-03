"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight, Sparkles, KeyRound, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Automatically reset all loading flags when returning to this page (e.g., via browser Back button / bfcache or window focus)
  useEffect(() => {
    const resetLoadingStates = () => {
      setSubmitting(false);
      setGoogleLoading(false);
    };

    window.addEventListener("pageshow", resetLoadingStates);
    window.addEventListener("focus", resetLoadingStates);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        resetLoadingStates();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pageshow", resetLoadingStates);
      window.removeEventListener("focus", resetLoadingStates);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Both email and password are required.");
      toast.error("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);
    const success = await login({ email, password });
    setSubmitting(false);

    if (success) {
      router.push(redirectUrl);
    } else {
      setFormError("Invalid email or password. Please verify your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    // Safety fallback: if user returns or navigation is aborted, restore button after 5 seconds
    const fallbackTimer = setTimeout(() => {
      setGoogleLoading(false);
    }, 5000);

    try {
      const success = await loginWithGoogle(undefined, redirectUrl);
      if (!success) {
        clearTimeout(fallbackTimer);
        setGoogleLoading(false);
      }
    } catch {
      clearTimeout(fallbackTimer);
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info(
      "Demo Mode: Password reset is managed by administrative support for security in this staging environment."
    );
  };

  const fillDemoCreds = (type: "host" | "creator") => {
    if (type === "host") {
      setEmail("host.examiner@studiospace.io");
      setPassword("StudioSpace2026!");
    } else {
      setEmail("creator.examiner@studiospace.io");
      setPassword("StudioSpace2026!");
    }
    toast.success(`Loaded ${type === "host" ? "Host" : "Creator"} demo account credentials!`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="p-8 sm:p-10 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/70 backdrop-blur-xl shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground">
              Sign In to StudioSpace
            </h1>
            <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400">
              Access your studio listings, reserved soundstages, and creator dashboard.
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Demo Accounts</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoCreds("host")}
                className="py-1.5 px-2.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-studio-900 dark:text-amber-300 font-semibold transition-colors text-center"
              >
                Studio Host
              </button>
              <button
                type="button"
                onClick={() => fillDemoCreds("creator")}
                className="py-1.5 px-2.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-studio-900 dark:text-amber-300 font-semibold transition-colors text-center"
              >
                Creator & Renter
              </button>
            </div>
          </div>

          {/* Form Error Alert */}
          {formError && (
            <div className="p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
              {formError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-studio-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@studiospace.io"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-amber-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-studio-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || googleLoading}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span>{submitting ? "Authenticating..." : "Sign In to StudioSpace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-4 flex items-center">
            <div className="flex-1 border-t border-studio-200 dark:border-studio-800" />
            <span className="px-3 text-xs uppercase tracking-wider text-studio-500 font-medium whitespace-nowrap">
              Or continue with
            </span>
            <div className="flex-1 border-t border-studio-200 dark:border-studio-800" />
          </div>

          {/* Google Social Login Button (Google only per prompt rule) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting || googleLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-studio-200 dark:border-studio-800 hover:border-amber-500/40 bg-studio-50 dark:bg-studio-950 text-studio-800 dark:text-studio-200 text-sm font-semibold flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.18 3.64-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.25 21.4 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.09 0 9.98 0 12s.44 3.91 1.21 5.44l4.11-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.6 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer Link to Register */}
          <div className="text-center pt-2 text-xs text-studio-600 dark:text-studio-400">
            <span>Don't have an account yet? </span>
            <Link
              href={redirectUrl !== "/" ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
              className="font-bold text-amber-500 hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

