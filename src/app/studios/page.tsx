"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IStudio } from "../../types";
import { api } from "../../lib/api";
import { StudioCard } from "../../components/studios/StudioCard";
import { Search, SlidersHorizontal, Sparkles, Filter, X } from "lucide-react";

const CATEGORIES = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

export default function ExploreStudiosPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.includes(cat)) {
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
        <div className="p-4 sm:p-5 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/70 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-studio-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by studio name, location (e.g. Brooklyn, Nashville), or gear..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-studio-400 hover:text-studio-600 dark:hover:text-studio-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-studio-500 whitespace-nowrap">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
              >
                <option value="rating">Top Rated (★)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="featured">Newest Spaces</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? "bg-amber-400 text-studio-950 shadow-sm font-bold scale-[1.02]"
                      : "bg-studio-100 dark:bg-studio-800/60 text-studio-700 dark:text-studio-300 hover:bg-studio-200 dark:hover:bg-studio-800"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-studio-500 px-1">
          <span>
            Showing <strong className="text-foreground">{studios.length}</strong> studio spaces
            {selectedCategory !== "All" && ` in "${selectedCategory}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </span>

          {(selectedCategory !== "All" || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
              }}
              className="text-amber-500 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[430px] rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/60 overflow-hidden animate-pulse"
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
          /* Studio Grid with Uniform Card Dimensions */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          /* Friendly Empty State with CTA */
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-studio-300 dark:border-studio-800 bg-white/40 dark:bg-studio-900/20 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
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

