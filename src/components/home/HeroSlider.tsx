"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { Compass, PlusCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

// Swiper core & module styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1920&q=85",
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
      "https://images.unsplash.com/photo-1768818928341-3b31b8965c6d?auto=format&fit=crop&w=1920&q=85",
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
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1920&q=85",
    category: "Music Suite",
    specs: ["SSL AWS 948 Console", "Neumann U87 Vintage", "7.1.4 Dolby Atmos"],
  },
];

export function HeroSlider() {
  return (
    <div className="relative w-full h-[560px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-studio-950 text-white select-none">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        pagination={{
          clickable: true,
          bulletClass: "inline-block w-2.5 h-1.5 mx-1 rounded-full bg-white/40 cursor-pointer transition-all duration-300",
          bulletActiveClass: "!w-10 !bg-amber-400 shadow-glow",
          el: ".hero-swiper-pagination",
        }}
        navigation={{
          prevEl: ".hero-swiper-prev",
          nextEl: ".hero-swiper-next",
        }}
        className="h-full w-full"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            {/* Slide Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.headline}
                className="w-full h-full object-cover"
              />
              {/* Deep Cinematic Overlay & Spotlight Radial Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-studio-950 via-studio-950/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-black/50" />
            </div>

            {/* Slide Content Overlay */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-700">
                {/* Category / Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 backdrop-blur-md text-amber-400 text-xs font-bold tracking-wide uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.badge}</span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-sm">
                  {slide.headline}
                </h1>

                {/* Subtext */}
                <p className="text-base sm:text-lg text-studio-200/90 leading-relaxed max-w-xl">
                  {slide.subtext}
                </p>

                {/* Specification Chips */}
                <div className="hidden sm:flex items-center gap-2 pt-1">
                  {slide.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-studio-100 shadow-sm"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>

                {/* Primary CTA Buttons (Linking to /studios) */}
                <div className="flex flex-wrap items-center gap-3.5 pt-4">
                  <Link
                    href="/studios"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all duration-200 hover:shadow-glow hover:scale-[1.02]"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Studios</span>
                  </Link>

                  <Link
                    href="/studios"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/25 hover:border-white/50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    <span>Host Your Space</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper Navigation Arrows */}
      <div className="absolute z-30 bottom-8 right-6 sm:right-12 flex items-center gap-2.5">
        <button
          className="hero-swiper-prev p-3 rounded-full border border-white/20 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all hover:scale-105 focus:outline-none cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          className="hero-swiper-next p-3 rounded-full border border-white/20 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all hover:scale-105 focus:outline-none cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Swiper Pagination Bullets */}
      <div className="hero-swiper-pagination absolute z-30 bottom-8 left-4 sm:left-8 flex items-center gap-1.5" />
    </div>
  );
}
