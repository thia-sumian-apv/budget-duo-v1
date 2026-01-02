"use client";

import { useGetPlannerQuery } from "./Planner.api";
import MembersCard from "./bento/MembersCard";
import RatioCard from "./bento/RatioCard";
import GoalsCard from "./bento/GoalsCard";
import SummaryCard from "./bento/SummaryCard";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

interface PlannerDetailViewProps {
  plannerId: string;
}

const PlannerDetailView = ({ plannerId }: PlannerDetailViewProps) => {
  const { userId: rawUserId } = useCurrentUser();
  const userId = rawUserId ?? null;
  const { data, loading, error, refetch } = useGetPlannerQuery({
    variables: { id: plannerId },
    fetchPolicy: "cache-and-network",
  });

  if (loading && !data) {
    return (
      <div className="p-5 text-sm text-navy/70">Loading planner details...</div>
    );
  }

  if (error || !data?.getPlanner) {
    return (
      <div className="p-5 text-sm text-red-600">
        Failed to load planner details
      </div>
    );
  }

  const planner = data.getPlanner;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Row 1: Members (left) and Ratio (right) */}
      <MembersCard
        members={planner.members}
        plannerId={plannerId}
        currentUserId={userId}
        onUpdate={() => refetch()}
      />
      <RatioCard
        plannerId={plannerId}
        members={planner.members}
        ratioMode={planner.ratioMode}
        customRatios={planner.customRatios}
        onUpdate={() => refetch()}
      />

      {/* Row 2: Goals (full width) */}
      <div className="md:col-span-2">
        <GoalsCard
          plannerId={plannerId}
          goals={planner.goals}
          members={planner.members}
          currentUserId={userId}
          onUpdate={() => refetch()}
        />
      </div>

      {/* Row 3: Summary (full width) */}
      <div className="md:col-span-2">
        <SummaryCard
          members={planner.members}
          goals={planner.goals}
          ratioMode={planner.ratioMode}
          customRatios={planner.customRatios}
          currentUserId={userId}
        />
      </div>
    </div>
  );
};

export default PlannerDetailView;
