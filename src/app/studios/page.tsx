"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IStudio } from "../../types";
import { api } from "../../lib/api";
import { StudioCard } from "../../components/studios/StudioCard";
import { Search, SlidersHorizontal, Sparkles, Filter, X } from "lucide-react";
import Loading from "../loading";

const CATEGORIES = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

const CATEGORY_ALIAS_MAP: Record<string, string> = {
  "photo studio": "Photo Studio",
  "photo studios": "Photo Studio",
  "film stage": "Film Stage",
  "sound stage": "Film Stage",
  "sound stages": "Film Stage",
  "soundstages": "Film Stage",
  "podcast lounge": "Podcast Lounge",
  "podcast room": "Podcast Lounge",
  "podcast rooms": "Podcast Lounge",
  "music suite": "Music Suite",
  "music suites": "Music Suite",
  "art workshop": "Art Workshop",
  "art workshops": "Art Workshop",
};

function resolveCategory(cat: string | null): string {
  if (!cat) return "All";
  const normalized = cat.trim().toLowerCase();
  if (CATEGORY_ALIAS_MAP[normalized]) return CATEGORY_ALIAS_MAP[normalized];
  if (CATEGORIES.includes(cat)) return cat;
  return "All";
}

function ExploreStudiosContent() {
  const searchParams = useSearchParams();
  const initialCategory = resolveCategory(searchParams.get("category"));

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const cat = resolveCategory(searchParams.get("category"));
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadStudios() {
      try {
        setLoading(true);
        const res = await api.studios.getAll({
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchTerm || undefined,
          sort: sortBy,
        });
        if (res.success && res.studios) {
          setStudios(res.studios);
        }
      } catch (err: any) {
        console.warn("Could not load studios:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStudios();
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Intro */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Marketplace Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground">
            Explore Creative Studios
          </h1>
          <p className="text-sm sm:text-base text-studio-600 dark:text-studio-400 max-w-2xl">
            Find and book photography cyc walls, broadcast podcast lounges, cinema soundstages, and analog music suites with transparent hourly pricing.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/90 shadow-sm backdrop-blur-md space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-400" />
              <input
                type="text"
                placeholder="Search by title, location (e.g. Brooklyn, Burbank), or hardware..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-studio-400 hover:text-studio-600 dark:hover:text-studio-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 sm:self-auto">
              <span className="text-xs font-semibold text-studio-500 flex-shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort By:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Recently Listed</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-studio-100 dark:border-studio-800/80">
            <span className="text-xs font-semibold text-studio-400 flex items-center gap-1 pl-1 flex-shrink-0 mr-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                    active
                      ? "bg-amber-400 text-studio-950 shadow-sm"
                      : "bg-studio-100 dark:bg-studio-800/70 text-studio-600 dark:text-studio-300 hover:bg-studio-200 dark:hover:bg-studio-700 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Quick Summary */}
        <div className="flex items-center justify-between text-xs text-studio-500 px-1">
          <span>
            Showing <strong className="text-foreground">{studios.length}</strong> creative {studios.length === 1 ? "space" : "spaces"}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </span>
          {searchTerm && (
            <span>
              Matching &ldquo;{searchTerm}&rdquo;
            </span>
          )}
        </div>

        {/* Studio Grid / Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/60 overflow-hidden shadow-sm animate-pulse flex flex-col h-[380px]"
              >
                <div className="aspect-[16/10] bg-studio-200 dark:bg-studio-800" />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div className="h-5 bg-studio-200 dark:bg-studio-800 rounded w-3/4" />
                  <div className="h-4 bg-studio-200 dark:bg-studio-800 rounded w-full" />
                  <div className="h-4 bg-studio-200 dark:bg-studio-800 rounded w-1/2" />
                  <div className="mt-auto pt-3 border-t border-studio-100 dark:border-studio-800 flex justify-between items-center">
                    <div className="h-6 bg-studio-200 dark:bg-studio-800 rounded w-16" />
                    <div className="h-8 bg-studio-200 dark:bg-studio-800 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : studios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl border border-dashed border-studio-200 dark:border-studio-800 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              No Studio Spaces Match Your Criteria
            </h3>
            <p className="text-xs sm:text-sm text-studio-500 max-w-sm mx-auto">
              We couldn't find any creative spaces matching your search. Try resetting your category filter or broadening your search keywords.
            </p>
            <div>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-studio-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExploreStudiosPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreStudiosContent />
    </Suspense>
  );
}
