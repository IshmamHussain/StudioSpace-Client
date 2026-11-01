import React from "react";
import { HeroSlider } from "../components/home/HeroSlider";
import { FeaturedStudios } from "../components/home/FeaturedStudios";
import { CategoryBrowser } from "../components/home/CategoryBrowser";
import { HowItWorks } from "../components/home/HowItWorks";
import { HostGuarantee } from "../components/home/HostGuarantee";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Slider (At least 3 slides) */}
      <HeroSlider />

      {/* 2. Featured Studios (Dynamic limit 6 from MongoDB) */}
      <FeaturedStudios />

      {/* 3. Browse by Studio Categories */}
      <CategoryBrowser />

      {/* 4. Extra Section 1: How Booking Works */}
      <HowItWorks />

      {/* 5. Extra Section 2: Host Guarantee & Creator Support */}
      <HostGuarantee />
    </div>
  );
}

