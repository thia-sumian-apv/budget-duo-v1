"use client";

import { Lock } from "lucide-react";

const CashflowMonitorScreen = () => {
  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-heading font-semibold text-navy">Cashflow Monitoring</h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-navy/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-navy/70">
          <Lock className="h-3 w-3" /> Locked
        </span>
      </div>
      <p className="mt-2 text-sm text-navy/70">
        This feature is locked and coming soon. You will be able to track
        accounts and monthly trends here.
      </p>
    </div>
  );
};

export default CashflowMonitorScreen;
