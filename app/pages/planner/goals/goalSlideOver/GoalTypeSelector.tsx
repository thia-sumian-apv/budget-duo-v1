"use client";

import { Label } from "@/components/ui/label";
import { FLOW_TYPE_CONFIG, FLOW_TYPES } from "@/lib/utils/flowTypes";
import { GoalFlowType } from "./types";

interface GoalTypeSelectorProps {
  value: GoalFlowType;
  onChange: (type: GoalFlowType) => void;
}

export const GoalTypeSelector = ({
  value,
  onChange,
}: GoalTypeSelectorProps) => (
  <div>
    <Label className="text-sm font-bold text-navy mb-2 block">Goal Type</Label>
    <div className="grid grid-cols-3 gap-2">
      {FLOW_TYPES.map((type) => {
        const config = FLOW_TYPE_CONFIG[type];
        const enumValue = type as unknown as GoalFlowType;
        const isActive = value === enumValue;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(enumValue)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl font-bold text-xs transition-colors ${
              isActive
                ? config.activeStyle
                : "border-2 border-navy/10 text-navy/60 hover:border-navy/20"
            }`}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  </div>
);
