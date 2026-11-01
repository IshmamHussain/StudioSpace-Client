"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { StudioCategory } from "../../types";
import { toast } from "sonner";
import {
  PlusCircle,
  Upload,
  DollarSign,
  MapPin,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
  Check,
} from "lucide-react";

const CATEGORIES: StudioCategory[] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Art Workshop",
];

const PRESET_AMENITIES = [
  "Seamless White Cyclorama",
  "Profoto AirTTL Strobe Lighting",
  "ARRI SkyPanels Ceiling Grid",
  "Camlock 3-Phase 100A Power",
  "Acoustic NC-25 Sound Isolation",
  "Neumann & Shure SM7B Microphones",
  "RodeCaster Pro II Audio Console",
  "Solid State Logic (SSL) Console",
  "Dolby Atmos 7.1.4 Monitoring",
  "Hair & Makeup Vanity Station",
  "Client Production Lounge",
  "1Gbps High-Speed Fiber Wi-Fi",
  "Drive-In Loading Bay",
  "Electric Ceramics Kiln & Wheels",
  "Commercial HVAC Climate Control",
];

export default function AddStudioPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StudioCategory>("Photo Studio");
  const [hourlyRate, setHourlyRate] = useState<number | "">(125);
  const [securityDeposit, setSecurityDeposit] = useState<number | "">(200);
  const [maxCapacity, setMaxCapacity] = useState<number | "">(20);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [overview, setOverview] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "1Gbps High-Speed Fiber Wi-Fi",
    "Hair & Makeup Vanity Station",
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Private route guard: avoid redirecting if loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.info("Please log in to list a studio space.");
      router.push("/login?redirect=/add-studio");
    }
  }, [loading, isAuthenticated, router]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !hourlyRate || !location || !image) {
      toast.error("Please fill in all required fields (title, rate, address, and featured image).");
      return;
    }

    try {
      setSubmitting(true);
      const gallery = galleryInput
        ? galleryInput.split(",").map((url) => url.trim()).filter(Boolean)
        : [image];

      const res = await api.studios.create({
        title,
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: Number(securityDeposit || 0),
        maxCapacity: Number(maxCapacity || 10),
        location,
        image,
        gallery,
        amenities: selectedAmenities,
        overview,
      });

      if (res.success) {
        toast.success(res.message || "Studio listed successfully!");
        router.push("/my-listings");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create studio listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs font-mono text-studio-500 animate-pulse">
          Verifying host credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Host Workspace Registration
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
            List a New Studio Space
          </h1>
          <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400">
            Share your photography stage, audio suite, or creative warehouse with thousands of verified producers and directors.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-10 rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-xl space-y-6"
        >
          {/* Read-Only Host Details */}
          <div className="p-4 rounded-2xl border border-studio-100 dark:border-studio-800 bg-studio-50 dark:bg-studio-950/50 space-y-1">
            <p className="text-[11px] font-bold text-studio-500 uppercase tracking-wider">
              Listing Host (Read-Only)
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-foreground font-semibold">
              <span>{user?.name}</span>
              <span className="text-studio-400 font-normal">{user?.email}</span>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
                Studio Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Prism Daylight Cyclorama & Soundstage"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StudioCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rates & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
                Hourly Rate ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm text-studio-400 font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : "")}
                  placeholder="125"
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
                Security Deposit ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm text-studio-400 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value ? Number(e.target.value) : "")}
                  placeholder="200"
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
                Max Capacity (People)
              </label>
              <input
                type="number"
                min="1"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value ? Number(e.target.value) : "")}
                placeholder="25"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* Location / Physical Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
              Location / Full Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-studio-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 55 Washington Street, DUMBO Creative District, Brooklyn, NY"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                required
              />
            </div>
          </div>

          {/* Image Upload / URL Input (imgbb / direct URL) */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-studio-700 dark:text-studio-300 flex items-center justify-between">
              <span>Primary Studio Image URL *</span>
              <span className="text-[11px] text-amber-500 font-normal">Supports ImgBB / PostImage / Unsplash</span>
            </label>
            <div className="relative">
              <Upload className="w-4 h-4 text-studio-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                required
              />
            </div>

            {/* Live image preview */}
            {image && (
              <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-studio-200 dark:border-studio-800 bg-studio-100 dark:bg-studio-950">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Gallery Extra Images (Comma-separated) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
              Additional Gallery Image URLs <span className="text-studio-400 font-normal">(Comma-separated)</span>
            </label>
            <input
              type="text"
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1, https://images.unsplash.com/photo-2"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Amenities Selector (Tags / Checkboxes) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
              Select Amenities & Gear Included
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                        : "border-studio-200 dark:border-studio-800 text-studio-600 dark:text-studio-400 hover:border-studio-300 dark:hover:border-studio-700"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Overview */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
              Detailed Workspace Overview *
            </label>
            <textarea
              rows={4}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Provide complete workspace specifications, acoustic treatment, ceiling height, lighting gear, loading dock instructions, and rules..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed"
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{submitting ? "Publishing Listing to MongoDB..." : "Publish Studio Space Listing"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

