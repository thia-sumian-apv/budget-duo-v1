"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getMemberName } from "@/lib/utils/member";
import type { PlannerMember, Planner } from "./types";

interface CustomRatioDisplayProps {
  members: PlannerMember[];
  customRatios: Planner["customRatios"];
  customValues: Record<string, number>;
  onCustomValuesChange: (values: Record<string, number>) => void;
  onSave: (ratios: { userId: string; percentage: number }[]) => Promise<void>;
  isSaving: boolean;
}

export const CustomRatioDisplay = ({
  members,
  customRatios,
  customValues,
  onCustomValuesChange,
  onSave,
  isSaving,
}: CustomRatioDisplayProps) => {
  const handleSave = async () => {
    const ratios = members.map((m) => ({
      userId: m.user.id,
      percentage: customValues[m.user.id] ?? 50,
    }));

    const total = ratios.reduce((sum, r) => sum + r.percentage, 0);
    if (Math.abs(total - 100) > 0.01) {
      toast.error("Ratios must add up to 100%");
      return;
    }

    await onSave(ratios);
  };

  return (
    <div className="space-y-5">
      {members.map((member) => {
        const currentValue =
          customValues[member.user.id] ??
          customRatios?.find((r) => r.userId === member.user.id)?.percentage ??
          50;
        const name = getMemberName(member, "Member");

        return (
          <div key={member.user.id} className="flex items-center gap-4">
            <Label className="text-sm font-semibold text-navy shrink-0 w-28 truncate">
              {name}
            </Label>
            <div className="relative flex-1">
              <Input
                type="number"
                min={0}
                max={100}
                value={currentValue}
                onChange={(e) =>
                  onCustomValuesChange({
                    ...customValues,
                    [member.user.id]: parseFloat(e.target.value) || 0,
                  })
                }
                className="pr-8 text-right"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-navy/40 pointer-events-none">
                %
              </span>
            </div>
          </div>
        );
      })}
      <Button onClick={handleSave} disabled={isSaving} className="w-full">
        {isSaving ? "Saving..." : "Save Ratio"}
      </Button>
    </div>
  );
};
