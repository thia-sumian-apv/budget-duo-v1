"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconTooltip } from "./InfoTooltip";
import { formatCurrency } from "@/lib/utils/budget";
import type { GetPlannerQuery } from "../Planner.api";
import { RatioMode } from "@/app/apolloClient.types";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type PlannerMember = Planner["members"][0];

interface ContributionSplitSectionProps {
  members: PlannerMember[];
  currentUserId: string | null;
  ratioMode: RatioMode;
  customRatios: Planner["customRatios"];
  onRatioModeChange: (mode: RatioMode) => Promise<void>;
  onSaveCustomRatio: (
    ratios: { userId: string; percentage: number }[]
  ) => Promise<void>;
  isSaving: boolean;
}

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

  const currentMember = members.find((m) => m.user.id === currentUserId);
  const partnerMember = members.find((m) => m.user.id !== currentUserId);

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

  const handleModeChange = async (mode: RatioMode) => {
    setSelectedMode(mode);
    if (mode === RatioMode.IncomeBased) {
      await onRatioModeChange(mode);
    }
  };

  const handleSaveCustom = async () => {
    const ratios = members.map((m) => ({
      userId: m.user.id,
      percentage: customValues[m.user.id] ?? 50,
    }));

    const total = ratios.reduce((sum, r) => sum + r.percentage, 0);
    if (Math.abs(total - 100) > 0.01) {
      alert("Ratios must add up to 100%");
      return;
    }

    await onSaveCustomRatio(ratios);
  };

  return (
    <div className="rounded-xl border border-navy/10 bg-white/60 p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-heading font-semibold text-navy">
          Contribution Split
        </h3>
        <IconTooltip term="incomeBased" />
      </div>

      <p className="text-sm text-navy/60 mb-4">
        How should shared expenses be split between you?
      </p>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleModeChange(RatioMode.IncomeBased)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMode === RatioMode.IncomeBased
              ? "bg-highlight text-white"
              : "bg-navy/5 text-navy/70 hover:bg-navy/10"
          }`}
        >
          Income-Based
        </button>
        <button
          onClick={() => setSelectedMode(RatioMode.Custom)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMode === RatioMode.Custom
              ? "bg-highlight text-white"
              : "bg-navy/5 text-navy/70 hover:bg-navy/10"
          }`}
        >
          Custom
        </button>
      </div>

      {/* Income-Based Display */}
      {selectedMode === RatioMode.IncomeBased && (
        <div className="space-y-3">
          <p className="text-xs text-navy/50">
            Split proportionally based on take-home income
          </p>
          {members.map((member) => {
            const isCurrentUser = member.user.id === currentUserId;
            const percentage = isCurrentUser
              ? incomeBased.current
              : incomeBased.partner;
            return (
              <div key={member.user.id} className="flex items-center gap-3">
                <span className="text-sm text-navy/70 w-20 truncate">
                  {member.displayName || member.user.name}
                </span>
                <div className="flex-1 h-2 bg-navy/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-highlight transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-navy w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
          <p className="text-xs text-navy/50 pt-2">
            Combined: {formatCurrency(incomeBased.total)}/month
          </p>
        </div>
      )}

      {/* Custom Display */}
      {selectedMode === RatioMode.Custom && (
        <div className="space-y-3">
          <p className="text-xs text-navy/50">
            Set your own contribution percentages
          </p>
          {members.map((member) => {
            const currentValue =
              customValues[member.user.id] ??
              customRatios?.find((r) => r.userId === member.user.id)
                ?.percentage ??
              50;

            return (
              <div key={member.user.id} className="flex items-center gap-3">
                <span className="text-sm text-navy/70 w-20 truncate">
                  {member.displayName || member.user.name}
                </span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={currentValue}
                  onChange={(e) =>
                    setCustomValues({
                      ...customValues,
                      [member.user.id]: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-20 h-8 text-center"
                />
                <span className="text-sm text-navy/50">%</span>
              </div>
            );
          })}
          <Button
            onClick={handleSaveCustom}
            disabled={isSaving}
            className="mt-2 rounded-full bg-highlight hover:bg-highlight/90"
          >
            {isSaving ? "Saving..." : "Save Ratio"}
          </Button>
        </div>
      )}
    </div>
  );
};
