"use client";

import { PillSelect } from "../PillSelect";
import { formatCurrency } from "@/lib/utils/budget";
import { FLOW_TYPE_CONFIG, FLOW_TYPES } from "@/lib/utils/flowTypes";
import type { FlowTypeBreakdownProps } from "./types";
import { useFlowTypeView } from "./useFlowTypeView";

export const FlowTypeBreakdown = (props: FlowTypeBreakdownProps) => {
  const { viewMode, setViewMode, active, canToggle, viewOptions } =
    useFlowTypeView(props);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-navy/10">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-heading font-extrabold text-xl text-navy">
          Flow Type Breakdown
        </h4>
      </div>

      {canToggle && (
        <div className="mb-6">
          <PillSelect
            options={viewOptions}
            value={viewMode}
            onChange={setViewMode}
            variant="filter"
          />
        </div>
      )}

      <div className="space-y-6">
        {FLOW_TYPES.map((type) => {
          const config = FLOW_TYPE_CONFIG[type];
          const amount = active.totals[type] ?? 0;
          const percentage =
            active.income > 0 ? (amount / active.income) * 100 : 0;

          return (
            <div key={type} className="space-y-2">
              <div className="flex justify-between text-sm font-bold font-heading">
                <span className="text-navy/60">{config.pluralLabel}</span>
                <span className="text-navy">{formatCurrency(amount)}</span>
              </div>
              <div className="h-3 w-full bg-navy/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${config.barColor} rounded-full transition-all duration-500`}
                  style={{
                    width: `${Math.max(Math.min(percentage, 100), 2)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
