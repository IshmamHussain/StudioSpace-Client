"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Compass, PlusCircle, Sparkles } from "lucide-react";

interface SlideData {
  id: number;
  badge: string;
  headline: string;
  subtext: string;
  image: string;
  category: string;
  specs: string[];
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    badge: "Cinema Production Soundstages",
    headline: "Craft Cinematic Stories Without Acoustic Limits",
    subtext:
      "Reserve verified soundstages with 200A Camlock power distribution, NC-25 acoustic isolation, and pre-rigged ARRI lighting arrays.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=85",
    category: "Film Stage",
    specs: ["Camlock 200A 3-Phase", "NC-25 Floating Floor", "DMX Lighting Grid"],
  },
  {
    id: 2,
    badge: "Daylight Cyclorama Studios",
    headline: "Illuminate High-Fashion & Editorial Masterpieces",
    subtext:
      "24ft seamless infinite cyclorama walls drenched in natural northern light, complete with Profoto AirTTL strobes and dedicated hair & makeup suites.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85",
    category: "Photo Studio",
    specs: ["24ft White Cyclorama", "Profoto D2 1000W", "Motorized Diffusion"],
  },
  {
    id: 3,
    badge: "Analog Mix & Spatial Audio Suites",
    headline: "Capture Sonic Warmth on Legendary Hardware",
    subtext:
      "Step into world-class recording suites equipped with Solid State Logic (SSL) consoles, Neumann vintage microphones, and certified Dolby Atmos spatial monitoring.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85",
    category: "Music Suite",
    specs: ["SSL AWS 948 Console", "Neumann U87 Vintage", "7.1.4 Dolby Atmos"],
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[680px] overflow-hidden bg-studio-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Crossfade */}
      {SLIDES.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
          } transition-transform duration-10000`}
        >
          <img
            src={s.image}
            alt={s.headline}
            className="w-full h-full object-cover"
          />
          {/* Deep Cinematic Overlay & Spotlight Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-studio-950 via-studio-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-black/40" />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          {/* Category / Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-md text-amber-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
            {slide.headline}
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-studio-300 leading-relaxed max-w-xl">
            {slide.subtext}
          </p>

          {/* Specification Chips */}
          <div className="hidden sm:flex items-center gap-2 pt-1">
            {slide.specs.map((spec, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-studio-200"
              >
                ✓ {spec}
              </span>
            ))}
          </div>

          {/* Primary CTA Buttons (Linking to /studios and /add-studio) */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all duration-200 hover:shadow-glow"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Studios</span>
            </Link>

            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-semibold text-sm transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Host Your Space</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls: Arrows */}
      <div className="absolute z-20 bottom-8 right-6 sm:right-12 flex items-center gap-2">
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
          }
          className="p-3 rounded-full border border-white/20 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="p-3 rounded-full border border-white/20 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Pagination Dots / Progress Bars */}
      <div className="absolute z-20 bottom-8 left-4 sm:left-8 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? "w-8 bg-amber-400"
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

