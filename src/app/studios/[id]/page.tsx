"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IStudio } from "@/types";
import { api } from "@/lib/api";
import { BookingModal } from "@/components/studios/BookingModal";
import {
  Star,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Share2,
  Heart,
  ArrowLeft,
  DollarSign,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

function StudioDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const { isAuthenticated } = useAuth();

  const [studio, setStudio] = useState<IStudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const hasHandledBookingRedirect = useRef(false);

  useEffect(() => {
    if (
      !hasHandledBookingRedirect.current &&
      isAuthenticated &&
      (searchParams.get("book") === "true" || searchParams.get("from") === "booking")
    ) {
      hasHandledBookingRedirect.current = true;
      setBookingModalOpen(true);
      toast.success("Welcome back! Ready to reserve your studio workspace.");
    }
  }, [isAuthenticated, searchParams]);

  useEffect(() => {
    async function fetchStudio() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.studios.getById(id);
        if (res.success && res.studio) {
          setStudio(res.studio);
          setSelectedImage(res.studio.image);
        }
      } catch (err: any) {
        toast.error(err.message || "Could not retrieve studio workspace details.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudio();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Studio link copied to clipboard!");
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save spaces to your wishlist.");
      return;
    }
    if (!studio) return;

    try {
      setIsSaved(!isSaved);
      const res = await api.wishlist.toggle(studio._id);
      toast.success(res.message);
    } catch (err: any) {
      setIsSaved(!isSaved);
      toast.error(err.message || "Failed to update wishlist.");
    }
  };

  const handleBookWorkspace = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to reserve this workspace.");
      router.push(`/register?redirect=${encodeURIComponent(`/studios/${id}?book=true`)}&from=booking`);
      return;
    }
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-8 bg-studio-200 dark:bg-studio-800 rounded-lg w-1/3" />
        <div className="aspect-[21/9] bg-studio-200 dark:bg-studio-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-studio-200 dark:bg-studio-800 rounded w-1/2" />
            <div className="h-24 bg-studio-200 dark:bg-studio-800 rounded" />
          </div>
          <div className="h-64 bg-studio-200 dark:bg-studio-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">Studio Not Found</h2>
        <p className="text-sm text-studio-500 max-w-sm">
          The requested creative space does not exist or may have been unlisted by its owner.
        </p>
        <Link
          href="/studios"
          className="px-5 py-2.5 rounded-xl bg-amber-400 text-studio-950 font-bold text-sm"
        >
          Browse All Studios
        </Link>
      </div>
    );
  }

  const galleryImages = [
    studio.image,
    ...(studio.gallery && studio.gallery.length > 0 ? studio.gallery : []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-white dark:bg-studio-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link & Action Buttons */}
        <div className="flex items-center justify-between">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-xs font-bold text-studio-600 dark:text-studio-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore Studios</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-900 text-studio-700 dark:text-studio-200 hover:border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Share Studio"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleWishlist}
              className={`p-2.5 rounded-xl border transition-colors text-xs font-semibold flex items-center gap-1.5 ${
                isSaved
                  ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                  : "border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-900 text-studio-700 dark:text-studio-200 hover:border-amber-500/40"
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Title, Badges & Location Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {studio.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-studio-100 dark:bg-studio-800 text-studio-800 dark:text-studio-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{studio.rating ? studio.rating.toFixed(2) : "5.00"}</span>
              <span className="text-studio-400">({studio.reviewCount || 1} verified reviews)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
            {studio.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-studio-500">
            <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>{studio.location}</span>
            <span>•</span>
            <Users className="w-4 h-4 text-studio-400 flex-shrink-0" />
            <span>Max Capacity: {studio.maxCapacity} creators & crew</span>
          </div>
        </div>

        {/* Gallery Carousel & Showcase */}
        <div className="space-y-4">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-studio-100 dark:bg-studio-900 border border-studio-200 dark:border-studio-800 shadow-md">
            <img
              src={selectedImage || studio.image}
              alt={studio.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnails list */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 sm:w-32 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? "border-amber-500 shadow-glow"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Two-Column Layout: Details Specs vs Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Specs, Amenities, Overview, Host Bio, Reviews (col-span-8) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-foreground">
                Workspace Overview
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-studio-600 dark:text-studio-300 whitespace-pre-line">
                {studio.overview}
              </p>
            </div>

            {/* Amenity Specifications List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-foreground">
                Included Equipment & Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studio.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-studio-200 dark:border-studio-800 bg-studio-50/50 dark:bg-studio-900/40 text-xs sm:text-sm font-medium text-studio-800 dark:text-studio-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Details */}
            <div className="p-6 rounded-3xl border border-studio-200 dark:border-studio-800 bg-studio-50/70 dark:bg-studio-900/40 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Verified Studio Host
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-amber-500/40 flex-shrink-0 bg-studio-200 dark:bg-studio-800">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studio.ownerName || "Elena Vance")}`}
                    alt={studio.ownerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <span>{studio.ownerName || "Elena Vance"}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </h3>
                  <p className="text-xs text-studio-500">
                    Host since 2026 • 100% response rate within 1 hour
                  </p>
                  <p className="text-xs text-studio-400 mt-1">
                    Contact: {studio.ownerEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Creative Reviews */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Verified Creator Reviews
                </h2>
                <span className="text-xs font-semibold text-amber-500">
                  ★ {studio.rating.toFixed(2)} ({studio.reviewCount} Reviews)
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center justify-center">
                        DC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Devon Chen (Director of Photography)</p>
                        <p className="text-[10px] text-studio-400">Filmed Commercial Lookbook • Oct 2026</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500 text-xs">★★★★★</div>
                  </div>
                  <p className="text-xs text-studio-600 dark:text-studio-300 leading-relaxed">
                    "The lighting rail system and Camlock power distribution made our 14-hour commercial shoot effortless. The acoustic dampening in this space is second to none."
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 font-bold text-xs flex items-center justify-center">
                        MS
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Marcus Sterling (Audio Producer)</p>
                        <p className="text-[10px] text-studio-400">Tracked 5-Piece Jazz Ensemble • Sep 2026</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500 text-xs">★★★★★</div>
                  </div>
                  <p className="text-xs text-studio-600 dark:text-studio-300 leading-relaxed">
                    "Seamless booking process. Everything listed was exactly on site, tested, and calibrated. Can’t recommend this studio space enough for serious creators."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget Card (col-span-4) */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="p-6 sm:p-7 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-xl space-y-5">
              {/* Rate & Deposit Header */}
              <div className="flex items-baseline justify-between border-b border-studio-100 dark:border-studio-800 pb-4">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-xs text-studio-500"> / hour</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-studio-500">Security Deposit</p>
                  <p className="text-xs font-bold text-foreground">${studio.securityDeposit}</p>
                </div>
              </div>

              {/* Quick Specs summary */}
              <div className="space-y-2 text-xs text-studio-600 dark:text-studio-400">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-semibold text-foreground">{studio.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Crew Size</span>
                  <span className="font-semibold text-foreground">{studio.maxCapacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning & Power</span>
                  <span className="font-semibold text-emerald-500">Included in rate</span>
                </div>
              </div>

              {/* Book Workspace Now Button launching the Booking Modal or redirecting to Sign Up */}
              <button
                onClick={handleBookWorkspace}
                className="w-full py-4 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Workspace Now</span>
              </button>

              <p className="text-center text-[11px] text-studio-400">
                You won't be charged until host confirms availability.
              </p>

              <div className="pt-2 border-t border-studio-100 dark:border-studio-800 text-[11px] text-studio-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Protected by StudioSpace Host Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal Component */}
        <BookingModal
          studio={studio}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default function StudioDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
          <div className="h-8 bg-studio-200 dark:bg-studio-800 rounded-lg w-1/3" />
          <div className="aspect-[21/9] bg-studio-200 dark:bg-studio-800 rounded-3xl" />
        </div>
      }
    >
      <StudioDetailsContent />
    </Suspense>
  );
}
