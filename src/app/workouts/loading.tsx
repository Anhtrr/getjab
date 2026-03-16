export default function WorkoutsLoading() {
  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto">
      <div className="h-8 w-32 bg-border/30 rounded-lg mb-6 animate-pulse" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="card-glass rounded-2xl p-5 animate-pulse"
          >
            <div className="h-5 w-3/4 bg-border/30 rounded mb-2" />
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-border/20 rounded-full" />
              <div className="h-4 w-12 bg-border/20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
