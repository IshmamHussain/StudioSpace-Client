"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IStudio } from "../../types";
import { Star, MapPin, Users, Heart, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { toast } from "sonner";

interface StudioCardProps {
  studio: IStudio;
  initialSaved?: boolean;
  onWishlistChange?: (studioId: string, isSaved: boolean) => void;
}

export function StudioCard({ studio, initialSaved = false, onWishlistChange }: StudioCardProps) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isToggling, setIsToggling] = useState(false);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please log in to save studios to your wishlist.");
      return;
    }

    try {
      setIsToggling(true);
      // Optimistic update
      const nextSavedState = !isSaved;
      setIsSaved(nextSavedState);

      const res = await api.wishlist.toggle(studio._id);
      if (res.success) {
        toast.success(res.message);
        onWishlistChange?.(studio._id, nextSavedState);
      }
    } catch (err: any) {
      // Revert optimistic state
      setIsSaved(!isSaved);
      toast.error(err.message || "Failed to update wishlist.");
    } finally {
      setIsToggling(false);
    }
  };

  const categoryColors: Record<string, string> = {
    "Photo Studio": "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    "Film Stage": "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    "Podcast Lounge": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "Music Suite": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "Art Workshop": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  const badgeClass =
    categoryColors[studio.category] ||
    "bg-amber-500/10 text-amber-500 border-amber-500/20";

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-studio-200 dark:border-studio-800/80 bg-white dark:bg-studio-900/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300">
      {/* Studio Image with Aspect Ratio & Hover Zoom */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-studio-100 dark:bg-studio-800">
        <img
          src={studio.image}
          alt={studio.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md shadow-sm ${badgeClass}`}
          >
            {studio.category}
          </span>

          {/* Heart Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isToggling}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              isSaved
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105"
                : "bg-black/40 text-white/90 hover:bg-black/60 hover:text-white"
            }`}
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            aria-label="Save studio"
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Bottom Bar: Location & Capacity */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center gap-1 max-w-[70%] truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{studio.location.split(",")[0]}</span>
          </div>

          <div className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Users className="w-3 h-3 text-studio-300" />
            <span>Up to {studio.maxCapacity}</span>
          </div>
        </div>
      </div>

      {/* Card Content (Flex-1 for equal grid heights) */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-studio-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
            {studio.title}
          </h3>
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{studio.rating ? studio.rating.toFixed(2) : "5.00"}</span>
          </div>
        </div>

        {/* Short Overview snippet */}
        <p className="text-xs text-studio-500 dark:text-studio-400 line-clamp-2 mb-4 flex-1">
          {studio.overview}
        </p>

        {/* Card Footer: Hourly Rate & CTA Button */}
        <div className="mt-auto pt-3 border-t border-studio-100 dark:border-studio-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-studio-950 dark:text-white">
                ${studio.hourlyRate}
              </span>
              <span className="text-xs text-studio-500">/ hr</span>
            </div>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-studio-100 hover:bg-amber-400 dark:bg-studio-800 dark:hover:bg-amber-400 text-studio-900 hover:text-studio-950 dark:text-studio-200 dark:hover:text-studio-950 transition-all duration-200"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

