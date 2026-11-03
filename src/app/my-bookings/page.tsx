"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IBooking } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import { generateBookingInvoice } from "../../lib/pdfInvoice";
import { toast } from "sonner";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Download,
  XCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

function MyBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<IBooking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (
      !hasGreeted.current &&
      (searchParams.get("from") === "booking" ||
        searchParams.get("redirect")?.includes("bookings"))
    ) {
      hasGreeted.current = true;
      toast.success(
        "Welcome to your bookings section! You can review and manage your reservations here."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.info("Please log in to review your studio bookings.");
      router.replace("/login?redirect=/my-bookings");
    }
  }, [authLoading, isAuthenticated, router]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.bookings.getMyBookings();
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      console.warn("Could not load bookings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;

    try {
      setIsCancelling(true);
      const res = await api.bookings.cancel(cancelTarget._id);
      if (res.success) {
        toast.success(res.message || "Booking reservation cancelled successfully.");
        // Optimistic status update
        setBookings((prev) =>
          prev.map((b) => (b._id === cancelTarget._id ? { ...b, status: "Cancelled" } : b))
        );
        setCancelTarget(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadInvoice = (booking: IBooking) => {
    try {
      generateBookingInvoice(booking);
      toast.success("PDF Invoice generated and downloaded!");
    } catch (err: any) {
      toast.error("Failed to generate PDF receipt.");
    }
  };

  const statusBadges: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    Confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Completed: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    Cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs font-mono text-studio-500 animate-pulse">
          Retrieving reservation history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Creator Schedule & Invoices
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
              My Studio Bookings
            </h1>
            <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 mt-1">
              Track reserved shoot windows, download official PDF booking invoices, or cancel pending requests.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow self-start sm:self-auto"
          >
            <span>Book Another Studio</span>
          </Link>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isPending = booking.status === "Pending";
              const badgeStyle =
                statusBadges[booking.status] ||
                "bg-studio-100 dark:bg-studio-800 text-studio-600 border-studio-300";

              return (
                <div
                  key={booking._id}
                  className={`p-5 sm:p-6 rounded-3xl border bg-white dark:bg-studio-900 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors ${
                    booking.status === "Cancelled"
                      ? "border-rose-500/40 dark:border-rose-500/30"
                      : "border-studio-200 dark:border-studio-800 hover:border-amber-500/30"
                  }`}
                >
                  {/* Left Column: Image & Details */}
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      className="w-20 sm:w-28 aspect-[16/10] rounded-2xl object-cover bg-studio-100 flex-shrink-0"
                    />

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {booking.status !== "Cancelled" && (
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeStyle}`}
                          >
                            {booking.status}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-studio-400">
                          Ref: #{booking._id.slice(-6).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        {booking.studioTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-studio-500">
                        <div className="flex items-center gap-1">
                          <CalendarCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>
                            {booking.startTime} - {booking.endTime} ({booking.totalHours} hrs)
                          </span>
                        </div>
                        <div>
                          <span>Host: {booking.ownerEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing & Action Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-studio-100 dark:border-studio-800">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-studio-500">Total Reservation</p>
                      <p className="text-xl font-extrabold text-foreground">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                      <p className="text-[11px] text-studio-400">
                        (${booking.hourlyRate}/hr + deposit)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* PDF Invoice Button */}
                      <button
                        onClick={() => handleDownloadInvoice(booking)}
                        className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-studio-800 dark:text-studio-200 hover:border-amber-500/40 flex items-center gap-1.5 transition-colors"
                        title="Download PDF Booking Receipt"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-500" />
                        <span>PDF Invoice</span>
                      </button>

                      {/* Cancel Booking (Enabled for Pending slots) */}
                      {isPending ? (
                        <button
                          onClick={() => setCancelTarget(booking)}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors flex items-center gap-1"
                          title="Cancel pending reservation"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      ) : booking.status === "Cancelled" ? (
                        <span className="px-3.5 py-2 text-xs font-bold rounded-xl border border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-1.5 shadow-sm">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Cancelled</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-studio-400 italic px-2">
                          Lock In Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-studio-300 dark:border-studio-800 bg-white/40 dark:bg-studio-900/20 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              You Have No Studio Reservations Yet
            </h3>
            <p className="text-xs sm:text-sm text-studio-500 max-w-sm mx-auto">
              Explore photography cyc stages, podcast suites, or film stages and book your next shoot with instant confirmation.
            </p>
            <div>
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-studio-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                <span>Browse Available Studios</span>
              </Link>
            </div>
          </div>
        )}

        {/* Custom Modal for Cancellation Confirmation */}
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-foreground">
                  Cancel Studio Reservation?
                </h3>
                <p className="text-xs sm:text-sm text-studio-500 leading-relaxed">
                  Are you sure you want to cancel your shoot slot at{" "}
                  <strong className="text-foreground">"{cancelTarget.studioTitle}"</strong> on{" "}
                  {formatDate(cancelTarget.bookingDate)} from {cancelTarget.startTime} to{" "}
                  {cancelTarget.endTime}?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  disabled={isCancelling}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-studio-700 dark:text-studio-200 hover:bg-studio-100 transition-colors"
                >
                  Keep Reservation
                </button>

                <button
                  type="button"
                  onClick={handleCancelConfirm}
                  disabled={isCancelling}
                  className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-50"
                >
                  {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-xs font-mono text-studio-500 animate-pulse">
            Loading reservations...
          </p>
        </div>
      }
    >
      <MyBookingsContent />
    </Suspense>
  );
}

