"use client";

import { useState, useMemo } from "react";
import { GitBranch } from "lucide-react";
import { PillSelect, type PillOption } from "../PillSelect";
import { splitMembers } from "@/lib/utils/member";
import { IncomeBasedDisplay } from "./IncomeBasedDisplay";
import { CustomRatioDisplay } from "./CustomRatioDisplay";
import type { ContributionSplitSectionProps } from "./types";
import { RatioMode } from "./types";

const MODE_OPTIONS: PillOption<string>[] = [
  { value: RatioMode.IncomeBased, label: "Income-Based" },
  { value: RatioMode.Custom, label: "Custom" },
];

export const ContributionSplitSection = ({
  members,
  currentUserId,
  ratioMode,
  customRatios,
  onRatioModeChange,
  onSaveCustomRatio,
  isSaving,
}: ContributionSplitSectionProps) => {
  const [selectedMode, setSelectedMode] = useState<RatioMode>(ratioMode);
  const [customValues, setCustomValues] = useState<Record<string, number>>({});

  const { currentMember, partnerMember } = splitMembers(members, currentUserId);

  const incomeBased = useMemo(() => {
    const currentTakeHome = currentMember?.cpfBreakdown?.takeHomePay ?? 0;
    const partnerTakeHome = partnerMember?.cpfBreakdown?.takeHomePay ?? 0;
    const total = currentTakeHome + partnerTakeHome;

    return {
      current: total > 0 ? (currentTakeHome / total) * 100 : 50,
      partner: total > 0 ? (partnerTakeHome / total) * 100 : 50,
      total,
    };
  }, [currentMember, partnerMember]);

  const handleModeChange = async (mode: string) => {
    const ratioModeValue = mode as RatioMode;
    setSelectedMode(ratioModeValue);
    if (ratioModeValue === RatioMode.IncomeBased) {
      await onRatioModeChange(ratioModeValue);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-navy/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-navy rounded-xl text-white">
          <GitBranch className="h-5 w-5" />
        </div>
        <h3 className="font-bold text-lg text-navy">Contribution Split</h3>
      </div>

      {/* Mode Selector */}
      <PillSelect
        options={MODE_OPTIONS}
        value={selectedMode}
        onChange={handleModeChange}
        variant="segment"
        className="mb-8"
      />

      {/* Display */}
      {selectedMode === RatioMode.IncomeBased ? (
        <IncomeBasedDisplay
          members={members}
          currentUserId={currentUserId}
          incomeBased={incomeBased}
        />
      ) : (
        <CustomRatioDisplay
          members={members}
          customRatios={customRatios}
          customValues={customValues}
          onCustomValuesChange={setCustomValues}
          onSave={onSaveCustomRatio}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};
