"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "../shared/Logo";
import { toast } from "sonner";
import { Instagram, Youtube, Send, ArrowRight } from "lucide-react";

// Modern X Logo SVG (per rule: do NOT use old Twitter bird)
function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to StudioSpace Creator Dispatch!");
    setEmail("");
  };

  return (
    <footer className="border-t border-studio-200 dark:border-studio-800 bg-studio-100/90 dark:bg-studio-950 text-studio-600 dark:text-studio-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand & Mission Statement (col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm leading-relaxed max-w-sm text-studio-500 dark:text-studio-400">
              StudioSpace is the premier peer-to-peer marketplace uniting filmmakers, photographers, audio engineers, and visionaries with extraordinary creative spaces across the globe.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-studio-900 dark:text-studio-200 mb-2">
                Join the Creator Dispatch
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@studiospace.io"
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-900 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-studio-950 font-semibold rounded-xl text-sm transition-all hover:shadow-glow flex items-center justify-center gap-1.5"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-studio-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/studios" className="hover:text-amber-500 transition-colors">
                  Explore Studios
                </Link>
              </li>
              <li>
                <Link href="/add-studio" className="hover:text-amber-500 transition-colors">
                  Host Your Space
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-amber-500 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-studio-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/studios?category=Photo%20Studio" className="hover:text-amber-500 transition-colors">
                  Photo Studios
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Film%20Stage" className="hover:text-amber-500 transition-colors">
                  Cinema Soundstages
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Podcast%20Lounge" className="hover:text-amber-500 transition-colors">
                  Podcast Lounges
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Music%20Suite" className="hover:text-amber-500 transition-colors">
                  Music Recording Suites
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Art%20Workshop" className="hover:text-amber-500 transition-colors">
                  Art & Ceramic Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links & Host Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-studio-900 dark:text-white">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-900 hover:text-amber-500 hover:border-amber-500/40 transition-colors"
                title="Follow us on X"
                aria-label="X (formerly Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-900 hover:text-amber-500 hover:border-amber-500/40 transition-colors"
                title="Follow us on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-900 hover:text-amber-500 hover:border-amber-500/40 transition-colors"
                title="Watch our Studio Tours on YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-xs text-studio-400">
              <p className="font-semibold text-studio-600 dark:text-studio-300">Creator Protection</p>
              <p className="mt-1">$1,000,000 Host Liability Guarantee on verified bookings.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="mt-12 pt-8 border-t border-studio-200 dark:border-studio-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-studio-500 dark:text-studio-500">
          <p>© {new Date().getFullYear()} StudioSpace Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-amber-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-amber-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/how-it-works" className="hover:text-amber-500 transition-colors">
              Host Guarantee
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

