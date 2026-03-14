"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function OgImagePage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  // Hide app navigation and main padding so the OG canvas is clean
  useEffect(() => {
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");
    if (nav) nav.style.display = "none";
    if (main) {
      main.style.padding = "0";
      main.style.minHeight = "auto";
    }
    return () => {
      if (nav) nav.style.display = "";
      if (main) {
        main.style.padding = "";
        main.style.minHeight = "";
      }
    };
  }, []);

  return (
    <div style={{ background: "#000", padding: 0, margin: 0 }}>
      {/* OG Image Canvas — exactly 1200x630. Right-click → Capture node screenshot */}
      <div
        id="og-canvas"
        className="relative overflow-hidden"
        style={{ width: 1200, height: 630, background: "#0a0a0a" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(0,229,255,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 40% at 85% 60%, rgba(0,144,255,0.06) 0%, transparent 55%)",
              "radial-gradient(ellipse 60% 40% at 15% 75%, rgba(168,85,247,0.04) 0%, transparent 50%)",
            ].join(", "),
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center h-full px-20 gap-16">
          {/* App icon */}
          <div
            className="shrink-0 flex items-center justify-center"
            style={{
              width: 200,
              height: 200,
              borderRadius: 40,
              background: "linear-gradient(135deg, #00e5ff, #0090ff)",
              boxShadow: "0 0 60px rgba(0,229,255,0.3), 0 0 120px rgba(0,144,255,0.1)",
            }}
          >
            <span
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontSize: 80,
                fontWeight: 900,
                color: "white",
                letterSpacing: -4,
              }}
            >
              JAB
            </span>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1,
                marginBottom: 16,
                background: "linear-gradient(135deg, #00e5ff, #0090ff)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              JAB
            </h1>
            <p
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.3,
                marginBottom: 24,
              }}
            >
              Combat Sports Workouts & Timer
            </p>
            <p
              style={{
                fontSize: 18,
                color: "#0a0a0a",
                fontWeight: 700,
                background: "linear-gradient(135deg, #00e5ff, #0090ff)",
                display: "inline-block",
                padding: "8px 20px",
                borderRadius: 100,
                marginBottom: 16,
              }}
            >
              Free — No Ads, No Account
            </p>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.35)",
                fontWeight: 500,
              }}
            >
              getjab.app
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 4,
            background: "linear-gradient(90deg, transparent, #00e5ff, #0090ff, transparent)",
          }}
        />
      </div>
    </div>
  );
}
