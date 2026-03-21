"use client";

import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalsEmptyStateProps {
  hasGoals: boolean;
  onAddGoal: () => void;
}

export const GoalsEmptyState = ({
  hasGoals,
  onAddGoal,
}: GoalsEmptyStateProps) => {
  return (
    <div className="w-full bg-white rounded-2xl p-10 text-center shadow-sm border border-navy/10 flex flex-col items-center">
      <div className="relative">
        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-highlight/15 rounded-full flex items-center justify-center">
          <Target
            className="h-16 w-16 md:h-20 md:w-20 text-highlight"
            strokeWidth={1}
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold font-heading text-navy mb-4">
        {hasGoals ? "No matching goals" : "No goals yet"}
      </h2>
      <p className="text-navy/60 text-lg leading-relaxed max-w-sm mx-auto mb-10">
        {hasGoals
          ? "Try adjusting your filters to see more goals."
          : "Ready to start your financial journey? Add your first expense, saving, or investment goal to keep track of your future together."}
      </p>

      {!hasGoals && (
        <Button
          onClick={onAddGoal}
          className="rounded-full bg-highlight hover:bg-highlight/90 font-bold py-4 px-10 shadow-lg shadow-highlight/20 text-base"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Your First Goal
        </Button>
      )}
    </div>
  );
};
