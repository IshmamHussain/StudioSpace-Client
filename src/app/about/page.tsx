import React from "react";
import Link from "next/link";
import { Film, ShieldCheck, Heart, Award, Users, Compass } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            About StudioSpace
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground">
            Democratizing Access to World-Class Creative Infrastructure
          </h1>
          <p className="text-sm sm:text-base text-studio-600 dark:text-studio-400 leading-relaxed">
            Founded by independent filmmakers and sound designers, StudioSpace removes the gatekeepers and friction between visionary creators and the rare physical spaces required to bring ambitious projects to life.
          </p>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Creator-Centric Precision</h3>
            <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 leading-relaxed">
              We list genuine equipment specs—camlock power distribution, acoustic NC ratings, cyc dimensions, and vintage outboard consoles—so you know your shoot will go flawlessly.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Host & Gear Safety</h3>
            <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 leading-relaxed">
              Backed by $1,000,000 in commercial liability coverage, verified identity credentials, and automated schedule collision guards to protect both spaces and crews.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Community & Independence</h3>
            <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 leading-relaxed">
              Empowering local studio owners, recording studios, and indie creators with peer-to-peer monetization that funds independent art, music, and film.
            </p>
          </div>
        </div>

        {/* Global Creative Network Stats */}
        <div className="p-8 sm:p-12 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
            Trusted by Creators Across the Globe
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-500">180+</p>
              <p className="text-xs text-studio-500 mt-1">Verified Studios</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-500">12,400+</p>
              <p className="text-xs text-studio-500 mt-1">Shoot Hours Booked</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-500">99.8%</p>
              <p className="text-xs text-studio-500 mt-1">On-Time Check-In</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-500">$1M</p>
              <p className="text-xs text-studio-500 mt-1">Host Protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

