import React from "react";
import { Search, Calendar, Zap, Clapperboard, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Discover Spaces",
    description:
      "Filter by discipline, ceiling height, Camlock power, cyclorama dimensions, or acoustic isolation. Review genuine photos, specs, and gear lists.",
    icon: Search,
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    description:
      "Pick your production date and shooting window. Our real-time engine ensures zero double-booking collisions with existing productions.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "Book Instantly",
    description:
      "Lock in transparent hourly rates, refundable security deposits, and platform insurance with instant reservation confirmations.",
    icon: Zap,
  },
  {
    step: "04",
    title: "Create & Produce",
    description:
      "Arrive at the stage, access digital check-in, connect to 1Gbps fiber Wi-Fi, and bring your creative vision to life with complete peace of mind.",
    icon: Clapperboard,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-studio-50/50 dark:bg-studio-950/40 border-y border-studio-200 dark:border-studio-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            The StudioSpace Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
            How Creative Booking Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-studio-600 dark:text-studio-400">
            From discovering rare soundstages to wrapping production, we have streamlined the entire creative space reservation lifecycle.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative flex flex-col p-6 rounded-2xl border border-studio-200 dark:border-studio-800 bg-studio-card dark:bg-studio-900/60 shadow-sm hover:border-amber-500/40 transition-all duration-300"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-extrabold text-amber-500/80 px-2 py-1 rounded bg-amber-500/10">
                    STEP {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-studio-600 dark:text-studio-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

