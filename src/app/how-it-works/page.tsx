import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorks } from "../../components/home/HowItWorks";
import { HostGuarantee } from "../../components/home/HostGuarantee";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Discover how StudioSpace connects independent filmmakers, photographers, and audio engineers with production-ready stages in four simple steps.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16 bg-studio-50/50 dark:bg-studio-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Platform Workflow
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground">
            How StudioSpace Connects Creators & Hosts
          </h1>
          <p className="text-sm sm:text-base text-studio-600 dark:text-studio-400 leading-relaxed">
            Whether you are an independent director producing a music video or a studio owner maximizing stage utilization, StudioSpace provides the infrastructure, insurance, and scheduling precision you need.
          </p>
        </div>

        {/* Workflow Component */}
        <HowItWorks />

        {/* Host Guarantee Section */}
        <HostGuarantee />

        {/* Final CTA Card */}
        <div className="p-8 sm:p-12 rounded-3xl border border-studio-200 dark:border-studio-800 bg-studio-card dark:bg-studio-900 text-center space-y-6 max-w-3xl mx-auto shadow-md">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Ready to Elevate Your Next Production?
          </h3>
          <p className="text-xs sm:text-sm text-studio-500 max-w-md mx-auto">
            Join thousands of verified filmmakers, photographers, and audio engineers already creating on StudioSpace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/studios"
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow"
            >
              Explore Creative Studios
            </Link>
            <Link
              href="/add-studio"
              className="px-6 py-3 rounded-xl border border-studio-200 dark:border-studio-800 hover:border-amber-500/40 text-foreground font-semibold text-sm transition-colors"
            >
              Host Your Space
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
