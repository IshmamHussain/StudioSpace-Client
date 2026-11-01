"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IStudio } from "../../types";
import { api } from "../../lib/api";
import { StudioCard } from "../studios/StudioCard";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturedStudios() {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        // Fetch top 6 newest/highest-rated studios via .limit(6)
        const res = await api.studios.getAll({ limit: 6, sort: "rating" });
        if (res.success && res.studios) {
          setStudios(res.studios);
        }
      } catch (err: any) {
        console.warn("Could not fetch remote featured studios, using preview fallback:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Creator Spaces</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
              Featured Studios
            </h2>
            <p className="mt-2 text-sm sm:text-base text-studio-600 dark:text-studio-400 max-w-xl">
              Discover top-rated soundstages, daylight cycloramas, podcast suites, and recording studios equipped with production-ready gear.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 group transition-colors flex-shrink-0"
          >
            <span>Explore All Workspaces</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/60 overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-studio-200 dark:bg-studio-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-studio-200 dark:bg-studio-800 rounded-md w-3/4" />
                  <div className="h-4 bg-studio-200 dark:bg-studio-800 rounded-md w-1/2" />
                  <div className="h-12 bg-studio-100 dark:bg-studio-800/40 rounded-md" />
                  <div className="h-8 bg-studio-200 dark:bg-studio-800 rounded-xl w-full pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : studios.length > 0 ? (
          /* Studio Grid with Exactly Equal Card Sizes */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-studio-300 dark:border-studio-800 rounded-2xl p-8">
            <p className="text-sm text-studio-500">No studios available right now.</p>
            <Link
              href="/add-studio"
              className="mt-4 inline-block px-4 py-2 bg-amber-400 text-studio-950 font-bold text-sm rounded-xl"
            >
              Be the first to list a space
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

