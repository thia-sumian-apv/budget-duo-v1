"use client";

type OwnerFilter = "all" | "mine" | "partner" | "shared";
type FlowFilter = "all" | "EXPENSE" | "SAVINGS" | "INVESTMENT";

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
    <div className="flex flex-wrap gap-2">
      {/* Owner filters */}
      <div className="flex gap-1 p-1 bg-navy/5 rounded-lg">
        {(["all", "mine", "partner", "shared"] as OwnerFilter[]).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => onOwnerFilterChange(filter)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                ownerFilter === filter
                  ? "bg-highlight text-white"
                  : "text-navy/60 hover:text-navy hover:bg-white/50"
              }`}
            >
              {filter === "all" && "All"}
              {filter === "mine" && "Mine"}
              {filter === "partner" && "Partner"}
              {filter === "shared" && "Shared"}
            </button>
          )
        )}
      </div>

      {/* Flow type filters */}
      <div className="flex gap-1 p-1 bg-navy/5 rounded-lg">
        {(["all", "EXPENSE", "SAVINGS", "INVESTMENT"] as FlowFilter[]).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => onFlowFilterChange(filter)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                flowFilter === filter
                  ? "bg-highlight text-white"
                  : "text-navy/60 hover:text-navy hover:bg-white/50"
              }`}
            >
              {filter === "all"
                ? "All Types"
                : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export type { OwnerFilter, FlowFilter };
