"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IStudio } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { StudioCard } from "../../components/studios/StudioCard";
import { toast } from "sonner";
import { Heart, Compass, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.info("Please sign in to view your saved studio wishlist.");
      router.push("/login?redirect=/wishlist");
    }
  }, [authLoading, isAuthenticated, router]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.wishlist.get();
      if (res.success && res.studios) {
        setStudios(res.studios);
      }
    } catch (err: any) {
      console.warn("Could not load wishlist:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  const handleWishlistChange = (studioId: string, isSaved: boolean) => {
    if (!isSaved) {
      setStudios((prev) => prev.filter((s) => s._id !== studioId));
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs font-mono text-studio-500 animate-pulse">
          Loading your saved wishlist spaces...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs font-bold tracking-wider uppercase mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Saved Workspaces</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
              My Saved Studios
            </h1>
            <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 mt-1">
              Curate your favorite film soundstages, daylight lofts, and recording suites for upcoming productions.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Spaces</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 animate-pulse"
              />
            ))}
          </div>
        ) : studios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
                initialSaved={true}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-studio-300 dark:border-studio-800 bg-white/40 dark:bg-studio-900/20 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs sm:text-sm text-studio-500 max-w-sm mx-auto">
              Click the heart icon on any studio card while exploring to bookmark spaces for your upcoming creative projects.
            </p>
            <div>
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-studio-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                <span>Explore Studios Catalog</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

