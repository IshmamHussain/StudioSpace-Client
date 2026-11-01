# StudioSpace — Peer-to-Peer Creative Studio Marketplace

> High-Performance Peer-to-Peer Marketplace Designed for Filmmakers, Photographers, Podcasters, and Musicians to Discover, Inspect, and Reserve Production Soundstages, Daylight Cyc Walls, and Music Suites.

- **Live Site URL:** `https://studiospace-marketplace.vercel.app` *(Production Vercel Deployment)*
- **Live Server API:** `https://studiospace-api.onrender.com` *(Backend Deployment)*

---

## 🌟 Key Features

1. **Aperture & Spotlight Editorial Design System**: Custom-crafted "Cinema Tungsten & Modern Editorial" visual language inspired by Leica, A24, and Apple Pro. Features butter-smooth micro-interactions, high-contrast dark/light mode toggles, and uniform studio card layouts without boilerplate templates.
2. **Interactive 3-Slide Hero Showcase**: Immersive multi-slide banner featuring high-resolution cinematography visuals, technical equipment tags (Camlock 200A 3-Phase, NC-25 Sound Isolation, SSL AWS 948 Console), and direct CTA links to explore and host creative spaces.
3. **Dynamic MongoDB-Powered Catalog with `.limit(6)`**: Real-time integration fetching the 6 highest-rated creative studios dynamically on the homepage, alongside a multi-discipline category browser (Photo Studios, Film Stages, Podcast Lounges, Music Suites, Art Workshops).
4. **Challenge 1 — HTTPOnly Cookie JWT Mutation Security**: Server mutations (`POST /api/studios`, `DELETE /api/studios/:id`, `POST /api/bookings`) are secured using signed JSON Web Tokens stored in HTTPOnly cookies, returning 401 Unauthorized for invalid sessions and ensuring zero token leakage to JavaScript.
5. **Challenge 2 — Double-Booking Collision Prevention Engine**: Comprehensive atomic interval intersection algorithm checking existing "Confirmed" bookings in MongoDB before processing reservations, cleanly rejecting conflicting time windows with HTTP 409 Conflict alerts.
6. **Challenge 3 — Full System Dark/Light Theme Customization**: Fluid theme toggle switching between "Tungsten Obsidian" darkroom mode and "Porcelain Daylight" photo studio mode, persisted via SSR-safe hydration.
7. **Client-Side PDF Booking Invoice Generator (Optional Feature 1)**: Instant vector PDF receipt export for studio reservations detailing shoot schedules, hourly rates, security deposits, and platform guarantee IDs.
8. **Saved Studios Wishlist (Optional Feature 2)**: Optimistic MongoDB-synced wishlist toggling allowing creators to bookmark spaces and manage favorites on a dedicated `/wishlist` route.
9. **Zero Browser Alerts & Modern Toasts**: Standardized feedback powered entirely by Sonner toast notifications and custom animated modal dialogs—no standard `window.alert()` or `confirm()`.
10. **Zero-Flicker Session Persistence on Reload**: Persistent session verification endpoint `/api/auth/me` with local storage pre-hydration, guaranteeing that logged-in users are never redirected to Login on page reload.

---

## 🛠️ Tech Stack

- **Front-End Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling & Design Tokens:** Tailwind CSS, Lucide Icons, Custom CSS Variables
- **UI & Animations:** Sonner Toasts, Framer Motion, Custom Accessible Modals & Skeletons
- **Export & Utilities:** `jspdf` (Client Vector PDF Invoice Generator)
- **State & Theming:** React Context API, `next-themes`
- **Backend & Database:** Express.js, TypeScript, MongoDB Atlas Native Driver, HTTPOnly JWT

---

## 🔑 Examiner Test Credentials

Examiner accounts are pre-seeded in the database with genuine studio listings, bookings, and wishlist items. You can also click the quick **"Examiner Test Credentials"** buttons on the Login page to auto-fill these credentials instantly!

| Account Type | Email | Password | Pre-Configured Assets |
|---|---|---|---|
| **Studio Host Examiner** | `host.examiner@studiospace.io` | `StudioSpace2026!` | Owns 8 verified creative studios & active bookings in `/my-listings` |
| **Creator / Renter Examiner** | `creator.examiner@studiospace.io` | `StudioSpace2026!` | Has pending & confirmed bookings in `/my-bookings` and saved spaces in `/wishlist` |

*Password Criteria Satisfied: Minimum 6 characters, at least 1 uppercase letter (`S`), at least 1 lowercase letter (`tudio`).*

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### 2. Setup Client Application
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### 3. Environment Variables (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Running the Development Server
```bash
# Run Next.js App Router on http://localhost:3000
npm run dev
```

### 5. Running with Backend Server
In a separate terminal window:
```bash
# Navigate to the server directory
cd ../server

# Install server dependencies and run
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live StudioSpace application.

