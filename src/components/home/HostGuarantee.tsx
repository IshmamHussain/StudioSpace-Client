import React from "react";
import Link from "next/link";
import { ShieldCheck, UserCheck, Wrench, Headphones, ArrowRight } from "lucide-react";

const ASSURANCES = [
  {
    title: "$1M Liability Protection",
    desc: "Every verified studio booking is backed by comprehensive commercial property and liability protection up to $1,000,000.",
    icon: ShieldCheck,
  },
  {
    title: "100% Verified Creator Profiles",
    desc: "All filmmakers, photographers, and producers undergo identity and production credential verification prior to booking.",
    icon: UserCheck,
  },
  {
    title: "Professional Equipment Safety",
    desc: "Stage rigging, lighting grids, and camlock electrical systems are certified by licensed stage technicians and sound engineers.",
    icon: Wrench,
  },
  {
    title: "24/7 Concierge Support",
    desc: "Our on-call production coordinators assist with emergency key exchange, power distro questions, and schedule extensions.",
    icon: Headphones,
  },
];

export function HostGuarantee() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-studio-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-studio-200 dark:border-studio-800 bg-gradient-to-b from-studio-50 to-white dark:from-studio-900/40 dark:to-studio-950 p-8 sm:p-12 lg:p-16 overflow-hidden relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Heading & Platform Message */}
            <div className="lg:col-span-5 space-y-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Peace of Mind Guarantee
              </span>

              <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground leading-tight">
                Designed for Creators, Protected by Industry Standards
              </h2>

              <p className="text-sm sm:text-base text-studio-600 dark:text-studio-400 leading-relaxed">
                Whether you are renting a boutique podcast room or operating a commercial 3,500 sq ft film soundstage, our marketplace platform safeguards your craft, equipment, and schedule.
              </p>

              <div className="pt-2">
                <Link
                  href="/add-studio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-studio-950 font-bold text-sm transition-all hover:shadow-glow"
                >
                  <span>List Your Studio Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Guarantee Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ASSURANCES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-studio-200 dark:border-studio-800 bg-white/80 dark:bg-studio-900/60 backdrop-blur-md space-y-2 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-studio-600 dark:text-studio-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

