"use client";

import { LogOut, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLeavePlannerMutation } from "../../Planner.api";

interface DangerZoneCardProps {
  plannerId: string;
}

export const DangerZoneCard = ({ plannerId }: DangerZoneCardProps) => {
  const [leavePlanner, { loading: leaving }] = useLeavePlannerMutation();

  const handleLeavePlanner = async () => {
    if (
      !confirm(
        "Are you sure you want to leave this planner? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await leavePlanner({ variables: { plannerId } });
      toast.success("You have left the planner");
      window.location.href = "/";
    } catch {
      toast.error("Failed to leave planner. Please try again.");
    }
  };

  return (
    <section className="bg-red-50/50 rounded-2xl p-6 shadow-sm border border-red-200/50">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
      </div>
      <p className="text-sm text-red-800/70 mb-6 leading-relaxed">
        Leaving this planner will revoke your access to all shared transactions,
        goals, and history. This action cannot be undone unless re-invited.
      </p>
      <Button
        variant="outline"
        onClick={handleLeavePlanner}
        disabled={leaving}
        className="w-full rounded-xl border-2 border-red-400 text-red-600 font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
      >
        <LogOut className="mr-2 h-4 w-4" />
        {leaving ? "Leaving..." : "Leave Planner"}
      </Button>
    </section>
  );
};
