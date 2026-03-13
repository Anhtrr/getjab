import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ActiveSessionBanner from "@/components/ActiveSessionBanner";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "Jab - Combat Sports Workouts & Timer",
  description:
    "Boxing, Muay Thai & kickboxing workouts with round timer, combo callouts, and progress tracking. Train like a fighter.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jab",
  },
  openGraph: {
    title: "Jab - Combat Sports Workouts & Timer",
    description: "Boxing, Muay Thai & kickboxing workouts with round timer, combo callouts, and progress tracking. Train like a fighter.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased bg-background text-foreground overflow-x-hidden">
        <main className="min-h-screen pb-20 pt-safe">{children}</main>
        <Navigation />
        <ActiveSessionBanner />
        <PWAInstallPrompt />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
