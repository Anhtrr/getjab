export function generateStaticParams() {
  return [
    { id: "first-boxing-workout" },
    { id: "beginner-bag-work" },
    { id: "shadow-boxing-fundamentals" },
    { id: "quick-cardio-boxing" },
    { id: "sweet-science-rounds" },
    { id: "fight-conditioning" },
    { id: "advanced-combo-flow" },
    { id: "speed-precision" },
    { id: "body-shot-specialist" },
    { id: "anhs-heavy-bag" },
    { id: "kronk-gym-rounds" },
    { id: "power-punching" },
    { id: "philly-shell-rounds" },
    { id: "counter-punching-workshop" },
    { id: "full-camp-round" },
  ];
}



export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
