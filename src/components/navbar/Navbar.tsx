"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../shared/Logo";
import { ThemeToggle } from "../shared/ThemeToggle";
import {
  Menu,
  X,
  PlusCircle,
  FolderKanban,
  CalendarCheck,
  Heart,
  LogOut,
  ChevronDown,
  Compass,
  Layers,
  Info,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Studios", href: "/studios" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-studio-200 dark:border-studio-800/80 bg-white/80 dark:bg-studio-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Center: Desktop Navigation Links with Active Indicators */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? "text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-studio-600 dark:text-studio-300 hover:text-studio-950 dark:hover:text-white hover:bg-studio-100 dark:hover:bg-studio-900"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full bg-amber-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions, Theme Toggle, Auth State */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="flex items-center gap-2.5 p-1 pl-2 rounded-full border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-900/60 hover:border-amber-500/40 transition-colors focus:outline-none"
                  aria-expanded={dropdownOpen}
                >
                  <span className="text-sm font-semibold text-studio-800 dark:text-studio-200 max-w-[120px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-500/30">
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-studio-500 transition-transform duration-200 mr-1 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-900 shadow-xl shadow-black/10 dark:shadow-black/40 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-studio-100 dark:border-studio-800">
                      <p className="text-sm font-semibold text-studio-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-studio-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/add-studio"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-studio-700 dark:text-studio-200 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-500" />
                        Add New Studio
                      </Link>

                      <Link
                        href="/my-listings"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-studio-700 dark:text-studio-200 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
                      >
                        <FolderKanban className="w-4 h-4 text-studio-400" />
                        My Studio Listings
                      </Link>

                      <Link
                        href="/my-bookings"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-studio-700 dark:text-studio-200 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-studio-400" />
                        My Bookings
                      </Link>

                      <Link
                        href="/wishlist"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-studio-700 dark:text-studio-200 hover:bg-studio-100 dark:hover:bg-studio-800 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        Saved Wishlist
                      </Link>
                    </div>

                    <div className="border-t border-studio-100 dark:border-studio-800 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-studio-700 dark:text-studio-200 hover:text-studio-950 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-studio-950 dark:text-studio-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 rounded-xl shadow-sm transition-all duration-150 hover:shadow-glow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-studio-600 dark:text-studio-300 hover:bg-studio-100 dark:hover:bg-studio-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-studio-200 dark:border-studio-800 bg-white dark:bg-studio-950 px-4 pt-2 pb-6 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? "bg-amber-500/10 text-amber-500 font-semibold"
                    : "text-studio-700 dark:text-studio-300 hover:bg-studio-100 dark:hover:bg-studio-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-studio-100 dark:border-studio-800">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-studio-50 dark:bg-studio-900 rounded-xl">
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/40"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-studio-500 truncate">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/add-studio"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-studio-700 dark:text-studio-200"
                >
                  <PlusCircle className="w-4 h-4 text-amber-500" />
                  Add New Studio
                </Link>

                <Link
                  href="/my-listings"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-studio-700 dark:text-studio-200"
                >
                  <FolderKanban className="w-4 h-4 text-studio-400" />
                  My Studio Listings
                </Link>

                <Link
                  href="/my-bookings"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-studio-700 dark:text-studio-200"
                >
                  <CalendarCheck className="w-4 h-4 text-studio-400" />
                  My Bookings
                </Link>

                <Link
                  href="/wishlist"
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-studio-700 dark:text-studio-200"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  Saved Wishlist
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-500"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  className="text-center py-2.5 text-sm font-semibold border border-studio-200 dark:border-studio-800 rounded-xl text-studio-800 dark:text-studio-200"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-center py-2.5 text-sm font-semibold bg-amber-400 text-studio-950 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

