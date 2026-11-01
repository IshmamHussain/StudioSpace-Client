import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function calculateBookingPrice(hourlyRate: number, startTime: string, endTime: string, deposit = 0) {
  if (!startTime || !endTime || startTime >= endTime) {
    return { totalHours: 0, subtotal: 0, serviceFee: 0, deposit: 0, totalAmount: 0 };
  }

  const [sHour, sMin] = startTime.split(":").map(Number);
  const [eHour, eMin] = endTime.split(":").map(Number);
  const totalHours = Math.max(1, (eHour * 60 + eMin - (sHour * 60 + sMin)) / 60);

  const subtotal = Math.round(hourlyRate * totalHours);
  const serviceFee = Math.round(subtotal * 0.08); // 8% fee
  const totalAmount = subtotal + deposit + serviceFee;

  return {
    totalHours,
    subtotal,
    serviceFee,
    deposit,
    totalAmount,
  };
}

