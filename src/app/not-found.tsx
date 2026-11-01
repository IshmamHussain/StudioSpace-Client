import React from "react";
import Link from "next/link";
import { Film, ArrowLeft, Camera, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Creative Studio 404 Illustration */}
        <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 to-cinema-red/20 blur-2xl animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white/70 dark:bg-studio-900/80 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl">
            <Film className="w-12 h-12 text-amber-500 animate-bounce" />
            <div className="flex items-center gap-1 mt-1 text-xs font-mono font-bold text-cinema-red">
              <span className="w-2 h-2 rounded-full bg-cinema-red animate-ping" />
              <span>CUT • 404</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-foreground">
            Stage Not Found
          </h1>
          <p className="text-sm text-studio-600 dark:text-studio-400 max-w-sm mx-auto leading-relaxed">
            The studio space, take, or production reel you are looking for has wrapped or been relocated to another soundstage.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

