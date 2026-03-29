"use client";

import { useEffect } from "react";
import { APP_STORE_URL } from "@/lib/constants";

export default function QRRedirect({ source }: { source: string }) {
  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    if (isIOS) {
      const url = new URL(APP_STORE_URL);
      url.searchParams.set("pt", "126738791");
      url.searchParams.set("mt", "8");
      url.searchParams.set("ct", source);
      window.location.href = url.toString();
    } else {
      // Android and other devices → send to PWA with source tracking
      window.location.href = `/?ref=${source}`;
    }
  }, [source]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-zinc-500 text-sm">Redirecting...</p>
    </div>
  );
}
