"use client";

import { Lock } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  locked?: boolean;
  selected?: boolean;
}

export const FeatureCard = ({
  title,
  description,
  onClick,
  icon,
  locked = false,
  selected = false,
}: FeatureCardProps) => (
  <button
    type="button"
    onClick={locked ? undefined : onClick}
    className={`w-full text-left rounded-xl border p-4 transition ${
      selected
        ? "border-navy/10 bg-white/50 hover:bg-white/70"
        : "border-highlight/40 bg-highlight/10"
    } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-heading text-base font-semibold text-navy">
            {title}
          </span>
          {locked && (
            <span className="inline-flex items-center gap-1 rounded-full border border-navy/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-navy/70">
              <Lock className="h-3 w-3" /> Locked
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-navy/70">{description}</p>
      </div>
      <div className="shrink-0 text-highlight">{icon}</div>
    </div>
  </button>
);
