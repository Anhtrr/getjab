export default function ProgressLoading() {
  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto">
      <div className="h-8 w-28 bg-border/30 rounded-lg mb-6 animate-pulse" />
      <div className="space-y-4">
        {/* Level badge skeleton */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-border/20 animate-pulse" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-glass rounded-xl p-4 text-center animate-pulse">
              <div className="h-8 w-8 bg-border/30 rounded mx-auto mb-1" />
              <div className="h-3 w-12 bg-border/20 rounded mx-auto" />
            </div>
          ))}
        </div>
        {/* Heatmap skeleton */}
        <div className="card-glass rounded-2xl p-4 h-32 animate-pulse">
          <div className="h-4 w-32 bg-border/30 rounded mb-3" />
          <div className="h-20 bg-border/10 rounded" />
        </div>
      </div>
    </div>
  );
}
