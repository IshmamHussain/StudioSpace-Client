"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-studio-200 dark:bg-studio-800 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 rounded-full border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 text-studio-700 dark:text-studio-200 hover:text-amber-spotlight dark:hover:text-amber-spotlight hover:border-amber-spotlight/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-spotlight/40"
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-studio-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

