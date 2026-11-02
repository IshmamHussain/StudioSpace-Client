import React from "react";
import Link from "next/link";
import { Camera, Film, Mic, Music, Palette, ArrowUpRight } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  tagline: string;
  queryParam: string;
  icon: React.ElementType;
  gradient: string;
  count: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "photo",
    name: "Photo Studios",
    tagline: "Infinity cyc walls, daylight lofts, Profoto lighting rigs",
    queryParam: "Photo Studio",
    icon: Camera,
    gradient: "from-sky-500/20 to-blue-600/10",
    count: "48 Spaces",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "film",
    name: "Cinema Soundstages",
    tagline: "Heavy Camlock 3-phase power, acoustic NC-25 shells, ceiling grids",
    queryParam: "Film Stage",
    icon: Film,
    gradient: "from-rose-500/20 to-red-600/10",
    count: "32 Stages",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "podcast",
    name: "Podcast Lounges",
    tagline: "Multi-cam 4K switcher, Shure SM7B mics, acoustic felt tables",
    queryParam: "Podcast Lounge",
    icon: Mic,
    gradient: "from-purple-500/20 to-indigo-600/10",
    count: "26 Lounges",
    image:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "music",
    name: "Music Suites",
    tagline: "SSL analog consoles, live tracking rooms, Dolby Atmos 7.1.4",
    queryParam: "Music Suite",
    icon: Music,
    gradient: "from-amber-500/20 to-orange-600/10",
    count: "41 Suites",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "art",
    name: "Art Workshops",
    tagline: "High-fire electric kilns, sculptor benches, natural skylights",
    queryParam: "Art Workshop",
    icon: Palette,
    gradient: "from-emerald-500/20 to-teal-600/10",
    count: "19 Studios",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
  },
];

export function CategoryBrowser() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-studio-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            Curated Spaces by Discipline
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
            Browse by Studio Discipline
          </h2>
          <p className="mt-2 text-sm sm:text-base text-studio-600 dark:text-studio-400">
            From acoustic-isolated recording suites to expansive drive-in daylight stages, filter and reserve spaces tailored to your production workflow.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/studios?category=${encodeURIComponent(cat.queryParam)}`}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-studio-200 dark:border-studio-800 bg-studio-50/60 dark:bg-studio-900/40 hover:border-amber-500/50 hover:bg-studio-100 dark:hover:bg-studio-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white dark:bg-studio-800 shadow-sm border border-studio-200 dark:border-studio-700/60 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5 text-amber-500" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-studio-400 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-amber-500 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-studio-500 dark:text-studio-400 line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-studio-200/60 dark:border-studio-800 flex items-center justify-between text-xs font-semibold text-studio-600 dark:text-studio-400">
                  <span>{cat.count}</span>
                  <span className="text-amber-500 font-bold group-hover:underline">Explore →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

