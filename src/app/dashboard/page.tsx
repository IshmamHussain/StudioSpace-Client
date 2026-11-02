"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { IStudio, IBooking } from "@/types";
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  CalendarCheck,
  Heart,
  Compass,
  ArrowRight,
  Sparkles,
  DollarSign,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [listings, setListings] = useState<IStudio[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.info("Please log in to access your Creator Dashboard.");
      router.push("/login?redirect=/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const [listingsRes, bookingsRes, wishlistRes] = await Promise.all([
          api.studios.getMyListings().catch(() => ({ success: false, studios: [] })),
          api.bookings.getMyBookings().catch(() => ({ success: false, bookings: [] })),
          api.wishlist.get().catch(() => ({ success: false, studios: [] })),
        ]);

        if (listingsRes.success && listingsRes.studios) {
          setListings(listingsRes.studios);
        }
        if (bookingsRes.success && bookingsRes.bookings) {
          setBookings(bookingsRes.bookings);
        }
        if (wishlistRes.success && wishlistRes.studios) {
          setWishlistCount(wishlistRes.studios.length);
        }
      } catch (err: any) {
        console.warn("Could not load full dashboard metrics:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [isAuthenticated]);

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xs font-mono text-studio-500 animate-pulse">
          Loading Creator Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-amber-500/20 flex-shrink-0">
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user?.name || "Creator"
                  )}`
                }
                alt={user?.name || "Creator"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Creator & Host Control Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-studio-500">
                {user?.email} • Verified StudioSpace Producer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Studio</span>
            </Link>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-100 dark:bg-studio-800 text-studio-800 dark:text-studio-200 font-semibold text-sm hover:border-amber-500/40 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Studio Listings */}
          <Link
            href="/my-listings"
            className="group p-6 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/70 hover:border-amber-500/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                <FolderKanban className="w-5 h-5" />
              </div>
              <span className="text-xs text-studio-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all">
                Manage →
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-studio-500">
              My Studio Listings
            </p>
            <p className="text-3xl font-extrabold text-foreground mt-1">
              {loading ? "..." : listings.length}
            </p>
            <p className="text-xs text-studio-400 mt-2">
              Spaces owned & available for rent
            </p>
          </Link>

          {/* 2. Reservations */}
          <Link
            href="/my-bookings"
            className="group p-6 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/70 hover:border-amber-500/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-xs text-studio-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all">
                View →
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-studio-500">
              Reserved Bookings
            </p>
            <p className="text-3xl font-extrabold text-foreground mt-1">
              {loading ? "..." : bookings.length}
            </p>
            <p className="text-xs text-studio-400 mt-2">
              Shoot dates & soundstage sessions
            </p>
          </Link>

          {/* 3. Wishlist */}
          <Link
            href="/wishlist"
            className="group p-6 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/70 hover:border-amber-500/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs text-studio-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all">
                Curate →
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-studio-500">
              Saved Wishlist
            </p>
            <p className="text-3xl font-extrabold text-foreground mt-1">
              {loading ? "..." : wishlistCount}
            </p>
            <p className="text-xs text-studio-400 mt-2">
              Favorite creative spaces bookmarked
            </p>
          </Link>

          {/* 4. Protection & Insurance */}
          <div className="p-6 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/70">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-500">Active</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-studio-500">
              Host Protection
            </p>
            <p className="text-3xl font-extrabold text-foreground mt-1">$1.0M</p>
            <p className="text-xs text-studio-400 mt-2">
              Platform liability coverage on bookings
            </p>
          </div>
        </div>

        {/* Split Section: Recent Listings & Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Recent Studio Listings */}
          <div className="p-6 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Your Studio Listings
                </h2>
                <p className="text-xs text-studio-500">
                  Spaces you have listed on the marketplace
                </p>
              </div>
              <Link
                href="/my-listings"
                className="text-xs font-bold text-amber-500 hover:underline"
              >
                View all ({listings.length})
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-studio-100 dark:bg-studio-800/60 animate-pulse"
                  />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="space-y-3 pt-2">
                {listings.slice(0, 3).map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-studio-100 dark:border-studio-800 bg-studio-50 dark:bg-studio-950/40"
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {s.title}
                      </p>
                      <p className="text-xs text-studio-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span className="truncate">{s.location}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-extrabold text-foreground">
                        ${s.hourlyRate}
                      </span>
                      <span className="text-[11px] text-studio-400">/hr</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-studio-200 dark:border-studio-800 rounded-2xl p-6">
                <p className="text-xs text-studio-500">
                  You haven't listed any studio workspaces yet.
                </p>
                <Link
                  href="/add-studio"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-studio-950 font-bold text-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>List Your First Space</span>
                </Link>
              </div>
            )}
          </div>

          {/* Right: Recent Bookings */}
          <div className="p-6 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Your Studio Bookings
                </h2>
                <p className="text-xs text-studio-500">
                  Recent reservations and shoot schedules
                </p>
              </div>
              <Link
                href="/my-bookings"
                className="text-xs font-bold text-amber-500 hover:underline"
              >
                View all ({bookings.length})
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-studio-100 dark:bg-studio-800/60 animate-pulse"
                  />
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-3 pt-2">
                {bookings.slice(0, 3).map((b) => (
                  <div
                    key={b._id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-studio-100 dark:border-studio-800 bg-studio-50 dark:bg-studio-950/40"
                  >
                    <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500 flex-shrink-0">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {b.studioTitle}
                      </p>
                      <p className="text-xs text-studio-500 flex items-center gap-2 mt-0.5">
                        <span>{b.bookingDate}</span>
                        <span>•</span>
                        <span>
                          {b.startTime} - {b.endTime}
                        </span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === "Confirmed"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                            : b.status === "Cancelled"
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                        }`}
                      >
                        {b.status}
                      </span>
                      <p className="text-xs font-bold text-foreground mt-1">
                        ${b.totalAmount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-studio-200 dark:border-studio-800 rounded-2xl p-6">
                <p className="text-xs text-studio-500">
                  You don't have any studio bookings yet.
                </p>
                <Link
                  href="/studios"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-studio-950 font-bold text-xs"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Discover Studios</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
