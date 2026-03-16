"use client";

import { useState, useRef } from "react";
import { Download, Upload, Check, AlertTriangle } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { exportAllData, importAllData } from "@/lib/storage";
import { notifyLogsChanged } from "@/hooks/useProgress";
import { notifyGameStateChanged } from "@/hooks/useGamification";

export default function DataManagement() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    const data = exportAllData();
    const filename = `jab-backup-${new Date().toISOString().split("T")[0]}.json`;

    if (Capacitor.isNativePlatform()) {
      try {
        const saved = await Filesystem.writeFile({
          path: filename,
          data: btoa(unescape(encodeURIComponent(data))),
          directory: Directory.Cache,
        });
        await Share.share({ files: [saved.uri] });
        setStatus({ type: "success", message: "Data exported successfully" });
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        setStatus({ type: "error", message: "Export failed" });
      }
    } else {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ type: "success", message: "Data exported successfully" });
    }
    setTimeout(() => setStatus(null), 3000);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = importAllData(reader.result as string);
      if (result.success) {
        notifyLogsChanged();
        notifyGameStateChanged();
        setStatus({ type: "success", message: "Data imported successfully" });
      } else {
        setStatus({ type: "error", message: result.error || "Import failed" });
      }
      setTimeout(() => setStatus(null), 4000);
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-3">Data</h3>
      <div className="space-y-2">
        <button
          onClick={handleExport}
          className="w-full card-glass rounded-xl p-4 flex items-center gap-3 hover:border-accent/20 transition-colors text-left"
        >
          <Download className="w-4 h-4 text-accent shrink-0" />
          <div>
            <p className="font-medium text-sm">Export Data</p>
            <p className="text-xs text-muted">Download a backup of all your training data</p>
          </div>
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full card-glass rounded-xl p-4 flex items-center gap-3 hover:border-accent/20 transition-colors text-left"
        >
          <Upload className="w-4 h-4 text-accent shrink-0" />
          <div>
            <p className="font-medium text-sm">Import Data</p>
            <p className="text-xs text-muted">Restore from a previous backup</p>
          </div>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {status && (
        <div
          className={`mt-3 flex items-center gap-2 text-xs p-3 rounded-xl ${
            status.type === "success"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <Check className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          )}
          {status.message}
        </div>
      )}
    </div>
  );
}
