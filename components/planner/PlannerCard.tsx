"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { MemberAvatars } from "./MemberAvatars";

export type HealthStatus = "on_track" | "tight" | "over_budget";

interface Member {
  id: string;
  name: string;
}

interface PlannerCardProps {
  id: string;
  name: string;
  members: Member[];
  totalAllocated: number;
  totalRemaining: number;
  totalIncome: number;
  lastActivity?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return "Just now";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
};

const getHealthStatus = (remaining: number, totalIncome: number): HealthStatus => {
  if (remaining < 0) return "over_budget";
  if (totalIncome > 0 && remaining <= totalIncome * 0.1) return "tight";
  return "on_track";
};

const statusConfig: Record<HealthStatus, { label: string; className: string }> = {
  on_track: {
    label: "On Track",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  tight: {
    label: "Tight",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  over_budget: {
    label: "Over Budget",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export const PlannerCard = ({
  id,
  name,
  members,
  totalAllocated,
  totalRemaining,
  totalIncome,
  lastActivity,
}: PlannerCardProps) => {
  const healthStatus = getHealthStatus(totalRemaining, totalIncome);
  const status = statusConfig[healthStatus];

  return (
    <Link
      href={`/planner/${id}`}
      className="bg-white border border-gray-200/50 shadow-sm rounded-3xl p-8 group hover:border-highlight/30 hover:shadow-md transition-all flex flex-col justify-between h-full min-h-[300px]"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy group-hover:text-highlight transition-colors">
                {name}
              </h3>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-semibold">
              Allocated
            </p>
            <span className="text-2xl font-bold text-navy">
              {formatCurrency(totalAllocated)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-semibold">
              Remaining
            </p>
            <span className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totalRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <MemberAvatars members={members} />
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Last Activity</p>
          <p className="text-xs font-bold text-navy">{formatRelativeTime(lastActivity)}</p>
        </div>
      </div>
    </Link>
  );
};
