import EditWorkoutClient from "./EditWorkoutClient";

export async function generateStaticParams() {
  return [{ id: "_" }];
}

export default function EditWorkoutPage() {
  return <EditWorkoutClient />;
}
