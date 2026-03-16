"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { redirect } from "next/navigation";

export default function DevPage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  const { isSubscribed, activate, deactivate } = useSubscription();

  return (
    <div className="px-4 pt-12 max-w-lg md:max-w-2xl mx-auto text-center space-y-6">
      <h1 className="text-2xl font-bold">Dev Tools</h1>
      <p className="text-muted">
        Pro status: <span className={isSubscribed ? "text-green-400" : "text-red-400"}>{isSubscribed ? "Active" : "Inactive"}</span>
      </p>
      <button
        onClick={isSubscribed ? deactivate : activate}
        className="btn-primary px-8 py-3 rounded-full"
      >
        {isSubscribed ? "Deactivate Pro" : "Activate Pro"}
      </button>
    </div>
  );
}
