"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IStudio } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { toast } from "sonner";
import {
  FolderKanban,
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  MapPin,
  AlertTriangle,
  X,
} from "lucide-react";

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [studios, setStudios] = useState<IStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<IStudio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.info("Please log in to manage your studio listings.");
      router.replace("/login?redirect=/my-listings");
    }
  }, [authLoading, isAuthenticated, router]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const res = await api.studios.getMyListings();
      if (res.success && res.studios) {
        setStudios(res.studios);
      }
    } catch (err: any) {
      console.warn("Could not load your listings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadListings();
    }
  }, [isAuthenticated]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const res = await api.studios.delete(deleteTarget._id);
      if (res.success) {
        toast.success(res.message || "Studio listing permanently removed.");
        setStudios((prev) => prev.filter((s) => s._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete studio listing.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs font-mono text-studio-500 animate-pulse">
          Authenticating host session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Host Management Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
              My Studio Listings
            </h1>
            <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 mt-1">
              Manage your listed production soundstages, update hourly specs, or add new spaces.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Studio</span>
          </Link>
        </div>

        {/* Listings Display */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 animate-pulse"
              />
            ))}
          </div>
        ) : studios.length > 0 ? (
          <div className="rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-studio-200 dark:border-studio-800 bg-studio-50/50 dark:bg-studio-950/50 text-xs font-bold text-studio-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Studio Workspace</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Hourly Rate</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-studio-100 dark:divide-studio-800">
                  {studios.map((studio) => (
                    <tr
                      key={studio._id}
                      className="hover:bg-studio-50/60 dark:hover:bg-studio-800/40 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={studio.image}
                            alt={studio.title}
                            className="w-16 h-12 rounded-xl object-cover bg-studio-100 flex-shrink-0"
                          />
                          <div>
                            <Link
                              href={`/studios/${studio._id}`}
                              className="font-bold text-foreground hover:text-amber-500 transition-colors line-clamp-1"
                            >
                              {studio.title}
                            </Link>
                            <span className="text-xs text-studio-400">
                              Rating: ★ {studio.rating?.toFixed(2) || "5.00"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">
                          {studio.category}
                        </span>
                      </td>

                      {/* Rate */}
                      <td className="py-4 px-6 font-bold text-foreground">
                        ${studio.hourlyRate} <span className="text-xs font-normal text-studio-500">/ hr</span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6 text-xs text-studio-500 max-w-[200px] truncate">
                        {studio.location}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/studios/${studio._id}`}
                            className="p-2 rounded-lg text-studio-400 hover:text-studio-700 dark:hover:text-studio-200 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
                            title="View Public Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/studios/edit/${studio._id}`}
                            className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                            title="Edit Studio Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteTarget(studio)}
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete Studio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-studio-100 dark:divide-studio-800">
              {studios.map((studio) => (
                <div key={studio._id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={studio.image}
                      alt={studio.title}
                      className="w-16 h-14 rounded-xl object-cover bg-studio-100 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <Link
                        href={`/studios/${studio._id}`}
                        className="font-bold text-foreground text-sm line-clamp-1"
                      >
                        {studio.title}
                      </Link>
                      <p className="text-xs text-amber-500 font-semibold">
                        ${studio.hourlyRate} / hr • {studio.category}
                      </p>
                      <p className="text-[11px] text-studio-500 truncate">{studio.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-studio-100 dark:border-studio-800">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-studio-100 dark:bg-studio-800 text-studio-700 dark:text-studio-200"
                    >
                      View
                    </Link>
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(studio)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-studio-300 dark:border-studio-800 bg-white/40 dark:bg-studio-900/20 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              You Have No Active Studio Listings
            </h3>
            <p className="text-xs sm:text-sm text-studio-500 max-w-sm mx-auto">
              Ready to monetize your photography cyc, podcast booth, or soundstage? List your space now with zero upfront fees.
            </p>
            <div>
              <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-studio-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your First Studio Space</span>
              </Link>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal Dialog (Per Rule: No default alert/confirm!) */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground">
                  Confirm Studio Removal
                </h3>
                <p className="text-xs sm:text-sm text-studio-500 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-foreground">"{deleteTarget.title}"</strong> from the
                  StudioSpace marketplace? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-studio-700 dark:text-studio-200 hover:bg-studio-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

