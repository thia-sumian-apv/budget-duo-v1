"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export const CreatePlannerCard = () => {
  return (
    <Link
      href="/planner/new"
      className="dashboard-card p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-highlight/50 hover:shadow-md transition-all duration-200 group"
    >
      <div className="w-16 h-16 rounded-2xl bg-highlight/10 flex items-center justify-center mb-4 group-hover:bg-highlight/20 transition-colors">
        <Plus className="h-8 w-8 text-highlight" />
      </div>
      <h3 className="text-lg font-bold text-navy mb-1">Create New Planner</h3>
      <p className="text-sm text-gray-500 text-center">
        Start a new budget plan for you and your partner
      </p>
    </Link>
  );
};
