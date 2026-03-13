export function generateStaticParams() {
  return [
    { id: "first-boxing-workout" },
    { id: "beginner-bag-work" },
    { id: "shadow-boxing-fundamentals" },
    { id: "quick-cardio-boxing" },
    { id: "power-punching" },
    { id: "speed-precision" },
    { id: "defensive-boxing" },
    { id: "body-shot-specialist" },
    { id: "advanced-combo-flow" },
    { id: "fight-conditioning" },
    { id: "counter-punching-workshop" },
    { id: "full-camp-round" },
    { id: "anhs-heavy-bag" },
  ];
}



export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
