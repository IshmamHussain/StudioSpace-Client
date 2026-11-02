# StudioSpace — Peer-to-Peer Creative Studio Marketplace

StudioSpace is a high-performance peer-to-peer marketplace engineered for creators, filmmakers, photographers, podcasters, and musicians to discover, tour, and book verified production soundstages, daylight cycloramas, podcast lounges, and analog music suites.

- **Live Site URL:** `https://studio-space-rho.vercel.app` *(Production Vercel Deployment)*
- **API Server URL:** `https://studiospace-server.onrender.com` *(Update with your deployed Backend URL)*

---

## 🌟 Core Features

- **Curated Multi-Discipline Studio Directory**: Explore verified creative venues categorized into Photo Studios, Cinema Film Stages, Video Podcast Lounges, Analog Mix & Music Suites, and Ceramic Art Workshops with high-resolution gallery inspections, verified amenities, and capacity ratings.
- **Real-Time Double-Booking Collision Prevention Engine**: Intelligent scheduling interval algorithm that cross-checks confirmed reservations in real-time, preventing schedule overlaps and rejecting conflicting date/time reservation requests with instant conflict feedback.
- **Enterprise-Grade Authentication & Session Security**: Secure authentication powered by BetterAuth with MongoDB adapter and signed JWT cookies, ensuring session persistence on reload and zero token exposure to client-side scripts.
- **Vector PDF Booking Invoice & Receipt Export**: Instant client-side PDF receipt generation (`jspdf`) detailing booking schedules, studio location, hourly rate breakdown, security deposits, and platform guarantee IDs.
- **Interactive Studio Wishlist & Bookmarking**: Optimistic real-time bookmarking system allowing authenticated creators to curate and manage favorite spaces across devices with zero perceived latency.
- **Aperture & Spotlight Adaptive Design System**: Bespoke darkroom/daylight aesthetic featuring seamless switching between "Tungsten Obsidian" dark mode and "Porcelain Daylight" light mode, complete with fluid Framer Motion micro-interactions and zero browser alerts.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Custom CSS Variables
- **Animations & Feedback:** Framer Motion, Sonner Toasts
- **Authentication:** BetterAuth React Client, Signed JWT HTTPOnly Cookie Sync
- **Document Generation:** jsPDF Vector Engine
- **State & Theming:** React Context API, `next-themes`

---

## 🔑 Examiner Test Credentials

Pre-seeded accounts with active studio listings, confirmed reservations, and wishlist items. You can also click the quick **"Examiner Test Credentials"** buttons on the Login page to auto-fill these instantly:

| Role | Email | Password | Pre-Configured Assets |
|---|---|---|---|
| **Studio Host** | `host.examiner@studiospace.io` | `StudioSpace2026!` | Owns 8 verified creative studios & active bookings in `/my-listings` |
| **Creator / Renter** | `creator.examiner@studiospace.io` | `StudioSpace2026!` | Has active bookings in `/my-bookings` and saved listings in `/wishlist` |

*Password Criteria Satisfied: Minimum 6 characters, at least 1 uppercase letter (`S`), at least 1 lowercase letter (`tudio`).*

---

## 🚀 Local Setup Steps

### 1. Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/IshmamHussain/StudioSpace-Client.git
cd StudioSpace-Client
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore StudioSpace locally.
