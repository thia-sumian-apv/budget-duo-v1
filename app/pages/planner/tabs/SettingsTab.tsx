"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeavePlannerMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;

interface SettingsTabProps {
  plannerId: string;
  planner: Planner;
  plannerCode: string;
  onUpdate: () => void;
}

export const SettingsTab = ({
  plannerId,
  planner,
  plannerCode,
}: SettingsTabProps) => {
  const [copied, setCopied] = useState(false);
  const [leavePlanner, { loading: leaving }] = useLeavePlannerMutation();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(plannerCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLeavePlanner = async () => {
    if (!confirm("Are you sure you want to leave this planner? This action cannot be undone.")) {
      return;
    }

    try {
      await leavePlanner({ variables: { plannerId } });
      // Redirect to home or refresh
      window.location.href = "/";
    } catch (err) {
      console.error("Failed to leave:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      {/* Planner Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-navy/10 bg-white/60 p-5"
      >
        <h3 className="font-heading font-semibold text-navy mb-4">
          Planner Details
        </h3>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-navy/50 mb-1">Name</p>
            <p className="font-medium text-navy">{planner.name}</p>
          </div>

          <div>
            <p className="text-xs text-navy/50 mb-1">Share Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-navy/5 rounded-lg font-mono text-sm text-navy">
                {plannerCode}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="h-9 px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-navy/50 mt-1">
              Share this code with your partner so they can join this planner.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Members */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-navy/10 bg-white/60 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-navy/50" />
          <h3 className="font-heading font-semibold text-navy">Members</h3>
        </div>

        <div className="space-y-3">
          {planner.members.map((member) => (
            <div
              key={member.user.id}
              className="flex items-center gap-3 py-2"
            >
              <div className="w-8 h-8 rounded-full bg-highlight/20 flex items-center justify-center">
                <span className="text-xs font-bold text-highlight">
                  {member.displayName?.[0] || member.user.name?.[0] || "?"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">
                  {member.displayName || member.user.name || "Unknown"}
                </p>
                <p className="text-xs text-navy/50">{member.user.email}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  member.role === "OWNER"
                    ? "bg-highlight/10 text-highlight"
                    : "bg-navy/5 text-navy/60"
                }`}
              >
                {member.role === "OWNER" ? "Owner" : "Member"}
              </span>
            </div>
          ))}
        </div>

        {planner.members.length < 2 && (
          <p className="text-xs text-navy/50 mt-3 pt-3 border-t border-navy/10">
            Waiting for partner to join using the share code above.
          </p>
        )}
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-red-200 bg-red-50/50 p-5"
      >
        <h3 className="font-heading font-semibold text-red-700 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-red-600/70 mb-4">
          Leaving this planner will remove your access to all shared goals and data.
          This action cannot be undone.
        </p>
        <Button
          variant="ghost"
          onClick={handleLeavePlanner}
          disabled={leaving}
          className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {leaving ? "Leaving..." : "Leave Planner"}
        </Button>
      </motion.div>
    </div>
  );
};

export default SettingsTab;
