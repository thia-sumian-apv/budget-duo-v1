"use client";

import { Button } from "@/components/ui/button";

export const SidebarUpgradeCard = () => {
  return (
    <div className="rounded-2xl bg-highlight/10 border border-highlight/20 p-4">
      <p className="text-xs font-bold text-highlight uppercase tracking-wider mb-1">
        Upgrade Pro
      </p>
      <p className="text-xs text-navy/70 mb-3">
        Unlock advanced HDB simulators.
      </p>
      <Button
        className="w-full py-2 bg-highlight text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
        onClick={() => {
          // Placeholder - will implement upgrade flow later
        }}
      >
        Go Premium
      </Button>
    </div>
  );
};
