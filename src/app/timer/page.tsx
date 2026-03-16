import Timer from "@/components/Timer";

export const metadata = {
  title: "Round Timer - Jab",
};

export default function TimerPage() {
  return (
    <div className="px-4 pt-4 pb-8 max-w-lg md:max-w-2xl mx-auto">
      <Timer />
    </div>
  );
}
