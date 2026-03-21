"use client";

import { cn } from "@/lib/utils";

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface PillSelectProps<T extends string> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: "filter" | "segment";
  className?: string;
  label?: string;
}

export function PillSelect<T extends string>({
  options,
  value,
  onChange,
  variant = "filter",
  className,
  label,
}: PillSelectProps<T>) {
  if (variant === "segment") {
    return (
      <div className={className}>
        {label && (
          <label className="text-sm font-bold text-navy block mb-2">{label}</label>
        )}
        <div className="bg-neutral-100 p-1 rounded-xl border border-navy/10 flex">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all",
                value === option.value
                  ? "bg-white text-navy shadow-sm"
                  : "text-navy/50 hover:text-navy/70"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Filter variant
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
            value === option.value
              ? "bg-navy text-white"
              : "bg-gray-200 text-navy/60 hover:bg-gray-300"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
