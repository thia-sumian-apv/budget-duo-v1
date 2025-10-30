"use client";

import { Lock } from "lucide-react";

const CashflowMonitorScreen = () => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Cashflow Monitoring</h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
          <Lock className="h-3 w-3" /> Locked
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70">
        This feature is locked and coming soon. You will be able to track
        accounts and monthly trends here.
      </p>
    </div>
  );
};

export default CashflowMonitorScreen;
