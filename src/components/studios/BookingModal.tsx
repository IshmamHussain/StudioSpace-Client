"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IStudio } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { calculateBookingPrice, formatCurrency } from "../../lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

interface BookingModalProps {
  studio: IStudio;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ studio, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [bookingDate, setBookingDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<{ startTime: string; endTime: string }[]>([]);

  // Load existing bookings for this studio to warn user of conflicts
  useEffect(() => {
    if (!isOpen || !studio._id) return;
    async function loadOccupied() {
      try {
        const res = await api.bookings.getStudioSlots(studio._id);
        if (res.success && res.bookings) {
          const onDate = res.bookings.filter(b => b.bookingDate === bookingDate);
          setOccupiedSlots(onDate);
        }
      } catch {
        // Ignore background slot lookup error
      }
    }
    loadOccupied();
  }, [isOpen, studio._id, bookingDate]);

  if (!isOpen) return null;

  const pricing = calculateBookingPrice(
    studio.hourlyRate,
    startTime,
    endTime,
    studio.securityDeposit
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info("Please sign in or create an account to confirm your studio reservation.");
      router.push(`/register?redirect=/my-bookings`);
      return;
    }

    if (startTime >= endTime) {
      toast.error("Wrap time (End Time) must be later than call time (Start Time).");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.bookings.create({
        studioId: studio._id,
        bookingDate,
        startTime,
        endTime,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success(res.message || "Studio reservation submitted! Status: Pending host review.");
        onClose();
        router.push("/my-bookings");
      }
    } catch (err: any) {
      // Conflict error is handled with user feedback
      toast.error(err.message || "Booking request failed. Please check for scheduling conflicts.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-studio-400 hover:text-studio-700 dark:hover:text-white hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pr-8 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Reserve Workspace
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
            {studio.title}
          </h2>
          <p className="text-xs text-studio-500">
            {studio.location} • ${studio.hourlyRate} / hour
          </p>
        </div>

        {/* Existing Confirmed Slots Warning on selected date */}
        {occupiedSlots.length > 0 && (
          <div className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Existing Reservations on {bookingDate}:</span>
            </p>
            <ul className="list-disc list-inside pl-1 space-y-0.5 text-[11px]">
              {occupiedSlots.map((slot, i) => (
                <li key={i}>
                  Reserved from <strong>{slot.startTime}</strong> to <strong>{slot.endTime}</strong>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 pt-1">
              Live Scheduling Engine: Overlapping reservation windows cannot be booked.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Booking Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-studio-700 dark:text-studio-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Production Shoot Date</span>
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              required
            />
          </div>

          {/* Time Window (Start & End) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Call Time (Start)</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-studio-700 dark:text-studio-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Wrap Time (End)</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                required
              />
            </div>
          </div>

          {/* Production Notes / Creative Purpose */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
              Production Scope / Equipment Details <span className="text-studio-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 3-point interview with 4 crew members and light playback."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="p-4 rounded-2xl border border-studio-200 dark:border-studio-800 bg-studio-50/70 dark:bg-studio-950/60 space-y-2 text-xs">
            <p className="font-bold text-studio-800 dark:text-studio-200 uppercase tracking-wider text-[11px]">
              Transparent Cost Breakdown
            </p>

            <div className="flex justify-between text-studio-600 dark:text-studio-400">
              <span>${studio.hourlyRate} × {pricing.totalHours} shoot hours</span>
              <span className="font-semibold">{formatCurrency(pricing.subtotal)}</span>
            </div>

            <div className="flex justify-between text-studio-600 dark:text-studio-400">
              <span>Refundable Security Deposit</span>
              <span className="font-semibold">{formatCurrency(pricing.deposit)}</span>
            </div>

            <div className="flex justify-between text-studio-600 dark:text-studio-400">
              <span>Platform Service & Insurance Fee (8%)</span>
              <span className="font-semibold">{formatCurrency(pricing.serviceFee)}</span>
            </div>

            <div className="pt-2 border-t border-studio-200 dark:border-studio-800 flex justify-between text-sm font-extrabold text-foreground">
              <span>Total Estimated Reservation</span>
              <span className="text-amber-500 text-base">{formatCurrency(pricing.totalAmount)}</span>
            </div>
          </div>

          {/* Host Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-studio-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Includes $1M Host Liability Protection and free cancellation up to 48 hours prior.</span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={submitting || pricing.totalHours <= 0}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow disabled:opacity-50"
          >
            {submitting ? "Verifying Time Collision & Reserving..." : "Confirm Studio Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
}

