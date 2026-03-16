export default function TimerLoading() {
  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto text-center">
      <div className="h-8 w-36 bg-border/30 rounded-lg mb-8 mx-auto animate-pulse" />
      <div className="w-48 h-48 rounded-full bg-border/15 mx-auto mb-8 animate-pulse" />
      <div className="space-y-3 max-w-xs mx-auto">
        <div className="h-12 bg-border/20 rounded-full animate-pulse" />
        <div className="h-12 bg-border/10 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
