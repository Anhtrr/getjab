"use client";

import { useEffect } from "react";
import { APP_STORE_URL } from "@/lib/constants";

export default function QRRedirect({ source }: { source: string }) {
  useEffect(() => {
    // Track the source in the URL so analytics can see it
    const url = new URL(APP_STORE_URL);
    url.searchParams.set("pt", "126738791");
    url.searchParams.set("mt", "8");
    url.searchParams.set("ct", source);
    window.location.href = url.toString();
  }, [source]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-zinc-500 text-sm">Redirecting to App Store...</p>
    </div>
  );
}
