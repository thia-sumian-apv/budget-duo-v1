"use client";

interface GoalCountProps {
  total: number;
  filtered?: number;
}

export const GoalCount = ({ total, filtered }: GoalCountProps) => {
  if (total === 0) return null;

  const label =
    filtered != null
      ? `Showing ${filtered} of ${total} goal${total !== 1 ? "s" : ""}`
      : `${total} goal${total !== 1 ? "s" : ""} tracked`;

  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-navy/40">
      {label}
    </p>
  );
};
