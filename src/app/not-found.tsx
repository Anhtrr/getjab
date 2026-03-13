import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-black text-accent mb-4">404</p>
        <h2 className="text-xl font-bold mb-2">Page not found</h2>
        <p className="text-muted text-sm mb-6">
          This page doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-block btn-primary px-8 py-3 rounded-full text-sm font-bold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
