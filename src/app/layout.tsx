import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/shared/ThemeProvider";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/navbar/Navbar";
import { Footer } from "../components/footer/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "StudioSpace — The Peer-to-Peer Creative Studio Marketplace",
  description:
    "Discover, book, and list high-performance photography cyc walls, cinema sound stages, podcast lounges, music recording suites, and art workshops.",
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

