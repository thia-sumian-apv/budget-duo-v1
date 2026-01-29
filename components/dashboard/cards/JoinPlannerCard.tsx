"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const JoinPlannerCard = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;

    setIsJoining(true);
    // TODO: Implement join planner mutation
    console.log("Joining planner with code:", inviteCode);
    setIsJoining(false);
  };

  return (
    <div className="dashboard-card p-6 flex flex-col min-h-[200px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
          <Users className="h-6 w-6 text-navy" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-navy">Join a Planner</h3>
          <p className="text-sm text-gray-500">Enter your partner&apos;s invite code</p>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <Input
          type="text"
          placeholder="Enter invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="rounded-xl border-gray-200 focus:border-highlight focus:ring-highlight"
        />
        <Button
          onClick={handleJoin}
          disabled={!inviteCode.trim() || isJoining}
          className="w-full bg-navy hover:bg-navy-dark text-white rounded-xl font-semibold"
        >
          {isJoining ? "Joining..." : "Join Planner"}
        </Button>
      </div>
    </div>
  );
};
