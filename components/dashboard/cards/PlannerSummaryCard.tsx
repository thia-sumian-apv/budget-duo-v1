"use client";

import Link from "next/link";
import { Wallet, Users, ChevronRight } from "lucide-react";

interface PlannerMember {
  id: string;
  name: string;
}

interface PlannerSummaryCardProps {
  id: string;
  name: string;
  members: PlannerMember[];
  totalAllocated?: number;
  totalRemaining?: number;
}

export const PlannerSummaryCard = ({
  id,
  name,
  members,
  totalAllocated = 0,
  totalRemaining = 0,
}: PlannerSummaryCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link
      href={`/planner/${id}`}
      className="dashboard-card p-6 flex flex-col min-h-[200px] hover:border-highlight/50 hover:shadow-md transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-highlight/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-highlight" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy group-hover:text-highlight transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>{members.length} member{members.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-highlight group-hover:translate-x-1 transition-all" />
      </div>

      {/* Stats */}
      <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Allocated</p>
          <p className="text-lg font-bold text-navy">{formatCurrency(totalAllocated)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Remaining</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>
    </Link>
  );
};
