"use client";

import { Button } from "@/components/ui/button";
import { formatPlannerCode } from "@/lib/utils/plannerCode";
import { Users, Plus, UserPlus } from "lucide-react";
import type { MyPlannersQuery } from "./Planner.api";

type Planner = MyPlannersQuery["myPlanners"][number];

interface PlannerListProps {
  planners: Planner[];
  onSelectPlanner: (plannerId: string) => void;
  onCreateNew: () => void;
  onJoinExisting: () => void;
}

const PlannerList = ({
  planners,
  onSelectPlanner,
  onCreateNew,
  onJoinExisting,
}: PlannerListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-heading font-semibold text-navy">Your Planners</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onJoinExisting}>
            <UserPlus className="mr-1 h-4 w-4" />
            Join
          </Button>
          <Button size="sm" onClick={onCreateNew}>
            <Plus className="mr-1 h-4 w-4" />
            New
          </Button>
        </div>
      </div>

      {planners.length === 0 ? (
        <div className="rounded-xl border border-navy/10 bg-white/50 p-6 text-center">
          <Users className="mx-auto h-10 w-10 text-navy/30" />
          <p className="mt-3 text-sm text-navy/70">No planners yet</p>
          <p className="mt-1 text-xs text-navy/50">
            Create a new planner or join one with a code
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {planners.map((planner) => (
            <button
              key={planner.id}
              type="button"
              onClick={() => onSelectPlanner(planner.id)}
              className="w-full text-left rounded-xl border border-navy/10 bg-white/50 p-4 hover:bg-navy/5 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-navy">{planner.name}</div>
                  <div className="mt-1 text-xs text-navy/50">
                    Code: {formatPlannerCode(planner.code)}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-navy/50">
                  <Users className="h-3 w-3" />
                  {planner.members.length}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlannerList;
