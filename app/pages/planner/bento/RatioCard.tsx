"use client";

import { useState } from "react";
import { useUpdateRatioSettingsMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";
import { RatioMode } from "@/app/apolloClient.types";
import { formatCurrency } from "@/lib/utils/budget";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Member = Planner["members"][number];
type CustomRatio = { userId: string; percentage: number };

interface RatioCardProps {
  plannerId: string;
  members: Member[];
  ratioMode: RatioMode;
  customRatios: CustomRatio[] | null | undefined;
  onUpdate: () => void;
}

const RatioCard = ({
  plannerId,
  members,
  ratioMode,
  customRatios,
  onUpdate,
}: RatioCardProps) => {
  const [mode, setMode] = useState<RatioMode>(ratioMode);
  const [customValues, setCustomValues] = useState<Record<string, number>>(() => {
    const values: Record<string, number> = {};
    if (customRatios) {
      for (const r of customRatios) {
        values[r.userId] = r.percentage;
      }
    } else {
      // Default to equal split
      const equalShare = Math.floor(100 / members.length);
      members.forEach((m, i) => {
        values[m.user.id] =
          i === members.length - 1
            ? 100 - equalShare * (members.length - 1)
            : equalShare;
      });
    }
    return values;
  });
  const [error, setError] = useState<string | null>(null);

  const [updateRatioSettings, { loading }] = useUpdateRatioSettingsMutation();

  // Calculate income-based ratios
  const totalTakeHome = members.reduce(
    (sum, m) => sum + (m.cpfBreakdown?.takeHomePay ?? 0),
    0
  );

  const incomeBasedRatios: Record<string, number> = {};
  if (totalTakeHome > 0) {
    members.forEach((m) => {
      const takeHome = m.cpfBreakdown?.takeHomePay ?? 0;
      incomeBasedRatios[m.user.id] = Math.round((takeHome / totalTakeHome) * 100);
    });
  } else {
    const equalShare = Math.floor(100 / members.length);
    members.forEach((m, i) => {
      incomeBasedRatios[m.user.id] =
        i === members.length - 1
          ? 100 - equalShare * (members.length - 1)
          : equalShare;
    });
  }

  const handleModeChange = async (newMode: RatioMode) => {
    setMode(newMode);
    setError(null);

    const input: { ratioMode: RatioMode; customRatios?: { userId: string; percentage: number }[] } = {
      ratioMode: newMode,
    };

    if (newMode === RatioMode.Custom) {
      input.customRatios = Object.entries(customValues).map(([userId, percentage]) => ({
        userId,
        percentage,
      }));
    }

    const result = await updateRatioSettings({
      variables: { plannerId, input },
    });

    if (result.data?.updateRatioSettings.__typename === "ErrorResponse") {
      const errorField = result.data.updateRatioSettings.fields?.[0];
      setError(errorField?.message ?? "Failed to update ratios");
      setMode(ratioMode); // Revert
    } else {
      onUpdate();
    }
  };

  const handleCustomChange = (userId: string, value: number) => {
    setCustomValues((prev) => ({ ...prev, [userId]: value }));
  };

  const saveCustomRatios = async () => {
    const total = Object.values(customValues).reduce((sum, v) => sum + v, 0);
    if (total !== 100) {
      setError("Ratios must sum to 100%");
      return;
    }

    setError(null);
    const result = await updateRatioSettings({
      variables: {
        plannerId,
        input: {
          ratioMode: RatioMode.Custom,
          customRatios: Object.entries(customValues).map(([userId, percentage]) => ({
            userId,
            percentage,
          })),
        },
      },
    });

    if (result.data?.updateRatioSettings.__typename === "ErrorResponse") {
      const errorField = result.data.updateRatioSettings.fields?.[0];
      setError(errorField?.message ?? "Failed to update ratios");
    } else {
      onUpdate();
    }
  };

  const activeRatios = mode === RatioMode.IncomeBased ? incomeBasedRatios : customValues;

  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-4">
      <h3 className="font-heading text-sm font-semibold mb-3 text-navy/80">
        Contribution Ratio
      </h3>

      <div className="space-y-3">
        {/* Mode selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleModeChange(RatioMode.IncomeBased)}
            disabled={loading}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
              mode === RatioMode.IncomeBased
                ? "bg-highlight/20 border border-highlight/40 text-highlight"
                : "border border-navy/10 text-navy/60 hover:bg-navy/5"
            }`}
          >
            Income-based
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(RatioMode.Custom)}
            disabled={loading}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
              mode === RatioMode.Custom
                ? "bg-highlight/20 border border-highlight/40 text-highlight"
                : "border border-navy/10 text-navy/60 hover:bg-navy/5"
            }`}
          >
            Custom
          </button>
        </div>

        {/* Ratio display */}
        <div className="space-y-2">
          {members.map((member) => {
            const displayName = member.displayName || member.user.name || "Member";
            const ratio = activeRatios[member.user.id] ?? 0;

            return (
              <div key={member.user.id} className="flex items-center gap-2">
                <span className="text-xs text-navy/70 w-20 truncate">
                  {displayName}
                </span>
                {mode === RatioMode.Custom ? (
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={customValues[member.user.id] ?? 0}
                    onChange={(e) =>
                      handleCustomChange(member.user.id, parseInt(e.target.value) || 0)
                    }
                    className="w-16 rounded-md border border-navy/10 bg-white/70 px-2 py-1 text-xs text-center focus:border-highlight/50 focus:outline-none"
                  />
                ) : (
                  <span className="text-xs font-medium w-16 text-center">
                    {ratio}%
                  </span>
                )}
                <div className="flex-1 h-2 rounded-full bg-navy/10 overflow-hidden">
                  <div
                    className="h-full bg-highlight transition-all"
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {mode === RatioMode.Custom && (
          <button
            type="button"
            onClick={saveCustomRatios}
            disabled={loading}
            className="w-full rounded-lg bg-highlight px-3 py-1.5 text-xs font-medium text-white hover:bg-highlight/90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Ratios"}
          </button>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        {/* Combined take-home */}
        <div className="border-t border-navy/10 pt-2 mt-2">
          <div className="flex justify-between text-xs">
            <span className="text-navy/50">Combined Take-home</span>
            <span className="font-medium text-highlight">
              {formatCurrency(totalTakeHome)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioCard;
