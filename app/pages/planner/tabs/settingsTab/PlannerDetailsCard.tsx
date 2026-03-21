"use client";

import { useState } from "react";
import { Copy, Check, FileEdit, Info } from "lucide-react";
import { toast } from "sonner";

interface PlannerDetailsCardProps {
  plannerName: string;
  plannerCode: string;
}

export const PlannerDetailsCard = ({
  plannerName,
  plannerCode,
}: PlannerDetailsCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(plannerCode);
      setCopied(true);
      toast.success("Share code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy share code");
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
      <div className="flex items-center gap-3 mb-6">
        <FileEdit className="h-5 w-5 text-highlight" />
        <h2 className="text-xl font-bold text-navy">Planner Details</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy/60 mb-1.5 px-1">
            Planner Name
          </label>
          <div className="bg-gray-50 rounded-xl px-4 py-3 font-medium text-navy">
            {plannerName}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy/60 mb-1.5 px-1">
            Share Code
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-200 font-mono text-navy px-4 py-3 rounded-xl flex items-center justify-between">
              <span className="tracking-widest font-bold">{plannerCode}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-highlight text-white px-4 py-3 rounded-xl hover:bg-highlight/90 active:scale-95 transition-all flex items-center justify-center"
            >
              {copied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-highlight/10 border border-highlight/20 rounded-xl p-4 flex gap-3">
          <Info className="h-5 w-5 text-highlight shrink-0 mt-0.5" />
          <p className="text-sm text-navy/70 leading-relaxed">
            Share this code with your partner to link your devices and manage
            your budget together in real-time.
          </p>
        </div>
      </div>
    </section>
  );
};
