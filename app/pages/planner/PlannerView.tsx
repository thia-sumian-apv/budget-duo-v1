"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPlannerCode } from "@/lib/utils/plannerCode";
import { ArrowLeft, Copy, Check } from "lucide-react";
import MemberCard from "./MemberCard";
import MemberDataEditor from "./MemberDataEditor";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import type { MyPlannersQuery } from "./Planner.api";

type Planner = MyPlannersQuery["myPlanners"][number];

interface PlannerViewProps {
  planner: Planner;
  onBack: () => void;
  onUpdate: () => void;
}

const PlannerView = ({ planner, onBack, onUpdate }: PlannerViewProps) => {
  const { userId } = useCurrentUser();
  const [copied, setCopied] = useState(false);
  const [editingMember, setEditingMember] = useState(false);

  const currentMember = planner.members.find((m) => m.user.id === userId);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(planner.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-base font-heading font-semibold text-navy">{planner.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-navy/50">
              Code: {formatPlannerCode(planner.code)}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-navy/50 hover:text-navy/70 transition"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {editingMember && currentMember ? (
        <MemberDataEditor
          plannerId={planner.id}
          member={currentMember}
          onClose={() => setEditingMember(false)}
          onSuccess={() => {
            setEditingMember(false);
            onUpdate();
          }}
        />
      ) : (
        <>
          <div className="rounded-xl border border-navy/10 bg-white/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-navy">Members</h3>
              {currentMember && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMember(true)}
                >
                  Edit My Info
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {planner.members.map((member) => (
                <MemberCard
                  key={member.user.id}
                  member={member}
                  isCurrentUser={member.user.id === userId}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlannerView;
