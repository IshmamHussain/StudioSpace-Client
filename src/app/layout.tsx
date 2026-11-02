import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/shared/ThemeProvider";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/navbar/Navbar";
import { Footer } from "../components/footer/Footer";
import { Toaster } from "sonner";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0D11" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "StudioSpace — The Peer-to-Peer Creative Studio Marketplace",
    template: "%s | StudioSpace",
  },
  description:
    "Discover, book, and list high-performance photography cyc walls, cinema sound stages, podcast lounges, music recording suites, and art workshops with verified acoustic and electrical specs.",
  keywords: [
    "creative studio rental",
    "soundstage booking",
    "photo cyc studio",
    "podcast studio rental",
    "recording studio ssl",
    "film production spaces",
    "audio engineering suites",
    "creator marketplace",
  ],
  authors: [{ name: "StudioSpace Platform" }],
  creator: "StudioSpace",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studiospace.market",
    siteName: "StudioSpace",
    title: "StudioSpace — The Peer-to-Peer Creative Studio Marketplace",
    description:
      "High-performance creative workspaces for filmmakers, photographers, and audio engineers. Instant booking with verified hardware specs and double-booking collision guards.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "StudioSpace Creative Studio Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioSpace — The Peer-to-Peer Creative Studio Marketplace",
    description:
      "High-performance creative workspaces for filmmakers, photographers, and audio engineers.",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
    creator: "@StudioSpace",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-500/20 selection:text-amber-500">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              richColors
              closeButton
              theme="system"
              toastOptions={{
                duration: 4000,
                className: "font-sans border border-studio-200 dark:border-studio-800 shadow-xl rounded-2xl",
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
