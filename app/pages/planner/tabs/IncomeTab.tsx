"use client";

import { useState } from "react";
import { MemberIncomeCard } from "../components/MemberIncomeCard";
import { ContributionSplitSection } from "../components/ContributionSplitSection";
import {
  useUpdateMemberDataMutation,
  useUpdateRatioSettingsMutation,
} from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";
import { RatioMode } from "@/app/apolloClient.types";

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

  const currentMember = members.find((m) => m.user.id === currentUserId);
  const partnerMember = members.find((m) => m.user.id !== currentUserId);

  const handleSaveMemberEdit = async (data: {
    displayName?: string;
    age: number;
    monthlyIncome: number;
  }) => {
    try {
      await updateMemberData({
        variables: {
          plannerId,
          input: data,
        },
      });
      onUpdate();
    } catch (err) {
      console.error("Failed to update:", err);
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
        onUpdate();
      } catch (err) {
        console.error("Failed to update ratio:", err);
      }
    }
  };

  const handleSaveCustomRatio = async (
    ratios: { userId: string; percentage: number }[]
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
      onUpdate();
    } catch (err) {
      console.error("Failed to update ratio:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Member Cards */}
      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-navy">Income Profiles</h3>
        {currentMember && (
          <MemberIncomeCard
            member={currentMember}
            isCurrentUser
            isExpanded={expandedMember === currentMember.user.id}
            onToggleExpand={() =>
              setExpandedMember(
                expandedMember === currentMember.user.id
                  ? null
                  : currentMember.user.id
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
                  : partnerMember.user.id
              )
            }
            onSaveEdit={handleSaveMemberEdit}
            isSaving={updatingMember}
          />
        )}
      </div>

      {/* Contribution Ratio Section */}
      {members.length > 1 && (
        <ContributionSplitSection
          members={members}
          currentUserId={currentUserId}
          ratioMode={ratioMode}
          customRatios={customRatios}
          onRatioModeChange={handleRatioModeChange}
          onSaveCustomRatio={handleSaveCustomRatio}
          isSaving={updatingRatio}
        />
      )}
    </div>
  );
};

export default IncomeTab;
