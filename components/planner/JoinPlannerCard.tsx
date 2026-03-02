"use client";

import { UserPlus } from "lucide-react";

interface JoinPlannerCardProps {
  onClick: () => void;
}

export const JoinPlannerCard = ({ onClick }: JoinPlannerCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white border-dashed border-2 border-gray-300 rounded-3xl p-8 group cursor-pointer hover:border-navy transition-all hover:bg-gray-50 flex flex-col justify-center items-center h-full min-h-[300px] text-left"
    >
      <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mb-4 text-navy group-hover:scale-110 transition-transform duration-300">
        <UserPlus className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">Join a Planner</h3>
      <p className="text-gray-500 text-sm text-center max-w-[200px]">
        Use an invite code to join an existing shared budget.
      </p>
    </button>
  );
};
