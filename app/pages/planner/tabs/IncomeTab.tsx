"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { ContributionSplitSection } from "../components/contributionSplit";
import {
  useUpdateMemberDataMutation,
  useUpdateRatioSettingsMutation,
} from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";
import { RatioMode } from "@/app/apolloClient.types";
import { splitMembers } from "@/lib/utils/member";
import { MemberIncomeCard } from "../components/memberIncomeCard";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;

interface IncomeTabProps {
  plannerId: string;
  planner: Planner;
  currentUserId: string | null;
  onUpdate: () => void;
}

export const IncomeTab = ({
  plannerId,
  planner,
  currentUserId,
  onUpdate,
}: IncomeTabProps) => {
  const { members, ratioMode, customRatios } = planner;
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const [updateMemberData, { loading: updatingMember }] =
    useUpdateMemberDataMutation();
  const [updateRatioSettings, { loading: updatingRatio }] =
    useUpdateRatioSettingsMutation();

  const { currentMember, partnerMember } = splitMembers(members, currentUserId);

  const handleSaveMemberEdit = async (data: {
    displayName?: string;
    age: number;
    monthlyIncome: number;
  }) => {
    try {
      await updateMemberData({
        variables: { plannerId, input: data },
      });
      toast.success("Income profile updated");
      onUpdate();
    } catch {
      toast.error("Failed to update income profile. Please try again.");
    }
  };

  const handleRatioModeChange = async (mode: RatioMode) => {
    if (mode === RatioMode.IncomeBased) {
      try {
        await updateRatioSettings({
          variables: {
            plannerId,
            input: { ratioMode: RatioMode.IncomeBased },
          },
        });
        toast.success("Contribution split updated to income-based");
        onUpdate();
      } catch {
        toast.error("Failed to update contribution split. Please try again.");
      }
    }
  };

  const handleSaveCustomRatio = async (
    ratios: { userId: string; percentage: number }[],
  ) => {
    try {
      await updateRatioSettings({
        variables: {
          plannerId,
          input: {
            ratioMode: RatioMode.Custom,
            customRatios: ratios,
          },
        },
      });
      toast.success("Custom contribution ratio saved");
      onUpdate();
    } catch {
      toast.error("Failed to save custom ratio. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* CPF Info Banner */}
      <div className="bg-highlight/15 border border-highlight/30 p-4 rounded-2xl flex items-start gap-3">
        <Info className="h-5 w-5 text-highlight shrink-0 mt-0.5" />
        <p className="text-sm text-navy/80 leading-relaxed">
          CPF contributions are auto-calculated based on the latest 2024 MOM
          contribution rates. Your take-home amount includes mandatory employee
          deductions.
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column — Member income cards */}
        <div className="lg:col-span-7 space-y-4">
          {currentMember && (
            <MemberIncomeCard
              member={currentMember}
              isCurrentUser
              isExpanded={expandedMember === currentMember.user.id}
              onToggleExpand={() =>
                setExpandedMember(
                  expandedMember === currentMember.user.id
                    ? null
                    : currentMember.user.id,
                )
              }
              onSaveEdit={handleSaveMemberEdit}
              isSaving={updatingMember}
            />
          )}
          {partnerMember && (
            <MemberIncomeCard
              member={partnerMember}
              isCurrentUser={false}
              isExpanded={expandedMember === partnerMember.user.id}
              onToggleExpand={() =>
                setExpandedMember(
                  expandedMember === partnerMember.user.id
                    ? null
                    : partnerMember.user.id,
                )
              }
              onSaveEdit={handleSaveMemberEdit}
              isSaving={updatingMember}
            />
          )}
        </div>

        {/* Right column — Contribution split */}
        {members.length > 1 && (
          <div className="lg:col-span-5">
            <ContributionSplitSection
              members={members}
              currentUserId={currentUserId}
              ratioMode={ratioMode}
              customRatios={customRatios}
              onRatioModeChange={handleRatioModeChange}
              onSaveCustomRatio={handleSaveCustomRatio}
              isSaving={updatingRatio}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeTab;
