"use client";

import { useParams } from "next/navigation";
import PlannerDetailView from "@/app/pages/planner/PlannerDetailView";

export default function PlannerPage() {
  const params = useParams();
  const plannerId = params.id as string;

  if (!plannerId) {
    return (
      <div className="dashboard-card p-8 text-center">
        <p className="text-red-600">Invalid planner ID</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card min-h-[600px]">
      <PlannerDetailView plannerId={plannerId} />
    </div>
  );
}
