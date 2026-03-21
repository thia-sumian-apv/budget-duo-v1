"use client";

import { formatCurrency } from "@/lib/utils/budget";
import type { Goal } from "./types";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-SG", { month: "short", year: "numeric" });
};

interface GoalDetailsProps {
  goal: Goal;
}

export const GoalDetails = ({ goal }: GoalDetailsProps) => {
  const isTimeBound = goal.category === "GOAL";

  return (
    <>
      {isTimeBound && (
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-navy/60">Total Amount</span>
            <span className="text-navy font-medium">
              {formatCurrency(goal.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy/60">Duration</span>
            <span className="text-navy font-medium">
              {goal.duration} months
            </span>
          </div>
          {goal.startDate && (
            <div className="flex justify-between">
              <span className="text-navy/60">Period</span>
              <span className="text-navy font-medium">
                {formatDate(goal.startDate)} – {formatDate(goal.endDate)}
              </span>
            </div>
          )}
        </div>
      )}

      {goal.remarks && (
        <div className="pt-2 border-t border-navy/10 text-sm">
          <p className="text-navy/60 text-xs mb-1">Notes</p>
          <p className="text-navy">{goal.remarks}</p>
        </div>
      )}
    </>
  );
};
