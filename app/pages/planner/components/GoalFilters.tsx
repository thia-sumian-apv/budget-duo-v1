"use client";

import { PillSelect, type PillOption } from "./PillSelect";

type OwnerFilter = "all" | "mine" | "partner" | "shared";
type FlowFilter = "all" | "EXPENSE" | "SAVINGS" | "INVESTMENT";

const OWNER_OPTIONS: PillOption<OwnerFilter>[] = [
  { value: "all", label: "All" },
  { value: "mine", label: "Mine" },
  { value: "partner", label: "Partner" },
  { value: "shared", label: "Shared" },
];

const FLOW_OPTIONS: PillOption<FlowFilter>[] = [
  { value: "all", label: "All" },
  { value: "EXPENSE", label: "Expense" },
  { value: "SAVINGS", label: "Savings" },
  { value: "INVESTMENT", label: "Investment" },
];

interface GoalFiltersProps {
  ownerFilter: OwnerFilter;
  flowFilter: FlowFilter;
  onOwnerFilterChange: (filter: OwnerFilter) => void;
  onFlowFilterChange: (filter: FlowFilter) => void;
}

export const GoalFilters = ({
  ownerFilter,
  flowFilter,
  onOwnerFilterChange,
  onFlowFilterChange,
}: GoalFiltersProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-navy/40 px-1">
          Filter by Owner
        </span>
        <PillSelect
          options={OWNER_OPTIONS}
          value={ownerFilter}
          onChange={onOwnerFilterChange}
          variant="filter"
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-navy/40 px-1">
          Filter by Type
        </span>
        <PillSelect
          options={FLOW_OPTIONS}
          value={flowFilter}
          onChange={onFlowFilterChange}
          variant="filter"
        />
      </div>
    </div>
  );
};

export type { OwnerFilter, FlowFilter };
