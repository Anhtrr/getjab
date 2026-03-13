interface ComboDisplayProps {
  combos: string[];
}

export default function ComboDisplay({ combos }: ComboDisplayProps) {
  if (combos.length === 0) return null;

  return (
    <div className="space-y-2">
      {combos.map((combo, i) => (
        <div
          key={i}
          className="font-mono text-lg card-glass rounded-xl px-4 py-3 text-center font-bold hover:border-[#00e5ff]/20 transition-colors"
        >
          {combo}
        </div>
      ))}
    </div>
  );
}
