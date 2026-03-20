import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  UserPlus,
  BarChart3,
  ChevronRight,
  PartyPopper,
  Copy,
  Check,
  Target,
} from "lucide-react";
import { StepIndicator } from "../StepIndicator";
import { formatCurrency } from "@/lib/utils/budget";
import type { CpfData } from "../wizardReducer";

interface CompleteStepProps {
  displayName: string;
  monthlyIncome: string;
  cpfData: CpfData | null;
  userName?: string;
  plannerCode: string;
  onComplete: () => void;
  onStepClick?: (step: import("../wizardReducer").WizardStep) => void;
}

export const CompleteStep = ({
  displayName,
  monthlyIncome,
  cpfData,
  userName,
  plannerCode,
  onComplete,
  onStepClick,
}: CompleteStepProps) => {
  const firstName = (displayName || userName || "").split(" ")[0] || "there";
  const gross = parseFloat(monthlyIncome || "0");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(plannerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <StepIndicator currentStep="complete" onStepClick={onStepClick} />

      {/* Celebration icon + heading */}
      <div className="mb-8 text-center">
        <div className="relative inline-flex mb-6">
          <div className="w-24 h-24 bg-highlight/10 rounded-full flex items-center justify-center">
            <PartyPopper className="h-12 w-12 text-highlight" />
          </div>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
          You&apos;re all set, {firstName}!
        </h1>
        <p className="mt-2 text-navy/60 max-w-md mx-auto">
          Your financial profile is complete. Now you can start building your
          first shared budget.
        </p>
      </div>

      {/* Bento action grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Go to Dashboard — navy, spans full width on mobile / 2 cols */}
        <button
          onClick={onComplete}
          className="group sm:col-span-2 flex flex-col items-start p-7 bg-navy text-white rounded-xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 text-left relative overflow-hidden"
        >
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-15 transition-opacity">
            <BarChart3 className="h-24 w-24" />
          </div>
          <div className="bg-highlight p-2.5 rounded-full mb-5">
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-heading text-xl text-white font-bold mb-1">
            Go to Dashboard
          </h3>
          <p className="text-white/60 text-sm">
            Access your financial overview and start managing your cash flow
            today.
          </p>
        </button>

        {/* Invite Partner — show planner code */}
        <div className="flex flex-col items-start p-7 bg-white border border-navy/10 rounded-xl shadow-sm">
          <div className="p-2.5 bg-navy/5 rounded-full mb-5">
            <UserPlus className="h-5 w-5 text-navy" />
          </div>
          <h3 className="font-heading text-base font-bold text-navy mb-1">
            Invite Your Partner
          </h3>
          <p className="text-navy/50 text-sm mb-4">
            Share this code so your partner can join this planner.
          </p>
          <div className="w-full flex items-center gap-2 bg-navy/5 rounded-lg px-3 py-2">
            <span className="flex-1 font-mono font-bold text-navy tracking-widest text-sm">
              {plannerCode}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-navy/40 hover:text-highlight transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-highlight" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Summary — tertiary card, spans remaining col */}
        {cpfData && (
          <div className="flex flex-col justify-between p-7 bg-navy/5 border border-transparent rounded-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy/40 mb-4">
              Your Income Summary
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-navy/60">Gross</span>
                <span className="font-bold text-navy text-sm">
                  {formatCurrency(gross)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-navy/60">Take-Home</span>
                <span className="font-bold text-highlight text-sm">
                  {formatCurrency(cpfData.takeHomePay)}
                </span>
              </div>
              <div className="h-px bg-navy/10" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-navy/60">Total CPF</span>
                <span className="font-bold text-navy text-sm">
                  {formatCurrency(cpfData.totalContribution)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add First Goal — full-width tertiary row */}
      <button
        onClick={onComplete}
        className="group w-full flex items-center gap-5 p-5 bg-navy/5 border border-transparent rounded-xl transition-all hover:bg-white hover:border-navy/10 hover:shadow-md text-left"
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 group-hover:bg-highlight/10 transition-colors">
          <Target className="h-5 w-5 text-navy" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-navy text-sm">
            Add Your First Goal
          </h3>
          <p className="text-navy/50 text-xs mt-0.5">
            Saving for a vacation? A new home? Start tracking your progress now.
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-navy/30 group-hover:text-highlight transition-colors shrink-0" />
      </button>
    </motion.div>
  );
};
