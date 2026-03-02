"use client";

import Link from "next/link";
import { PiggyBank } from "lucide-react";

interface PlannerSetupCardProps {
  id: string;
  name: string;
}

export const PlannerSetupCard = ({ id, name }: PlannerSetupCardProps) => {
  return (
    <div className="bg-white border border-gray-200/50 shadow-sm rounded-3xl p-8 group hover:border-highlight/30 hover:shadow-md transition-all flex flex-col justify-between h-full min-h-[300px] relative overflow-hidden">
      {/* Dimmed overlay */}
      <div className="absolute inset-0 bg-gray-50/50 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-700">{name}</h3>
            </div>
          </div>
          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full border border-gray-300">
            Needs Setup
          </span>
        </div>

        {/* Stats placeholder */}
        <div className="mb-8 opacity-50">
          <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-semibold">
            Monthly Budget
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-400">--</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            href={`/planner/${id}`}
            className="block w-full py-3 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20 text-center"
          >
            Complete Setup
          </Link>
        </div>
      </div>
    </div>
  );
};
