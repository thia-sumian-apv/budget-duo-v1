import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Home, PiggyBank, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "../StepIndicator";
import { formatCurrency } from "@/lib/utils/budget";
import type { CpfData } from "../wizardReducer";

interface BreakdownStepProps {
  age: string;
  monthlyIncome: string;
  cpfData: CpfData | null;
  onNext: () => void;
  onBack: () => void;
  onStepClick?: (step: import("../wizardReducer").WizardStep) => void;
}

export const BreakdownStep = ({
  age,
  monthlyIncome,
  cpfData,
  onNext,
  onBack,
  onStepClick,
}: BreakdownStepProps) => {
  const gross = parseFloat(monthlyIncome || "0");
  const takeHomePct = cpfData
    ? Math.round((cpfData.takeHomePay / gross) * 100)
    : 80;
  const cpfPct = 100 - takeHomePct;

  return (
    <motion.div
      key="breakdown"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Stepper — on grey background */}
      <StepIndicator currentStep="breakdown" onStepClick={onStepClick} />

      {/* Heading — on grey background */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
          Understanding Your Money
        </h1>
        <p className="text-navy/60 mt-1 leading-relaxed">
          We&apos;ve broken down your monthly income based on current Singapore
          CPF contribution rates.
        </p>
      </div>

      {/* Gross + take-home bento — white/navy cards on grey background */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border border-navy/10 p-5 rounded-xl flex flex-col justify-center shadow-sm">
          <p className="text-navy/50 text-xs font-semibold uppercase tracking-wider mb-1">
            Monthly Gross
          </p>
          <p className="text-xl font-bold text-navy">
            {formatCurrency(gross)}
          </p>
        </div>
        <div className="md:col-span-2 bg-navy text-white p-5 rounded-xl relative overflow-hidden flex flex-col justify-center border-l-4 border-highlight">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
            Estimated Take-Home Pay
          </p>
          <p className="text-3xl font-black">
            {cpfData ? formatCurrency(cpfData.takeHomePay) : "—"}
          </p>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Allocation bar — white card on grey background */}
      <div className="bg-white border border-navy/10 p-5 rounded-xl shadow-sm mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-heading font-bold text-navy text-sm">
            Allocation Breakdown
          </h4>
          <div className="flex gap-3 text-xs font-semibold text-navy/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-highlight rounded-full inline-block" />
              Take-home ({takeHomePct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-navy rounded-full inline-block" />
              CPF ({cpfPct}%)
            </span>
          </div>
        </div>
        <div className="h-4 w-full bg-navy/10 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-highlight transition-all duration-700"
            style={{ width: `${takeHomePct}%` }}
          />
          <div
            className="h-full bg-navy transition-all duration-700"
            style={{ width: `${cpfPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-navy/40 italic">
          Based on employee contribution for age {age}.
        </p>
      </div>

      {/* CPF account cards — white cards on grey background */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-navy/10 p-5 rounded-xl shadow-sm">
          <div className="w-9 h-9 bg-highlight/10 rounded-full flex items-center justify-center text-highlight mb-3">
            <Home className="h-4 w-4" />
          </div>
          <h5 className="font-heading font-bold text-navy text-sm mb-1">
            Ordinary Account
          </h5>
          <p className="text-2xl font-extrabold text-navy mb-1">
            {cpfData ? formatCurrency(cpfData.ordinaryAccount) : "—"}
          </p>
          <p className="text-xs text-navy/50 leading-snug">
            Housing, insurance, investment.
          </p>
        </div>
        <div className="bg-white border border-navy/10 p-5 rounded-xl shadow-sm">
          <div className="w-9 h-9 bg-highlight/10 rounded-full flex items-center justify-center text-highlight mb-3">
            <PiggyBank className="h-4 w-4" />
          </div>
          <h5 className="font-heading font-bold text-navy text-sm mb-1">
            Special Account
          </h5>
          <p className="text-2xl font-extrabold text-navy mb-1">
            {cpfData ? formatCurrency(cpfData.specialAccount) : "—"}
          </p>
          <p className="text-xs text-navy/50 leading-snug">
            Old age retirement products.
          </p>
        </div>
        <div className="bg-white border border-navy/10 p-5 rounded-xl shadow-sm">
          <div className="w-9 h-9 bg-highlight/10 rounded-full flex items-center justify-center text-highlight mb-3">
            <HeartPulse className="h-4 w-4" />
          </div>
          <h5 className="font-heading font-bold text-navy text-sm mb-1">
            Medisave
          </h5>
          <p className="text-2xl font-extrabold text-navy mb-1">
            {cpfData ? formatCurrency(cpfData.medisaveAccount) : "—"}
          </p>
          <p className="text-xs text-navy/50 leading-snug">
            Hospitalisation &amp; approved insurance.
          </p>
        </div>
      </div>

      {/* Nav buttons — on grey background */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full text-navy/60 text-sm"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Edit income
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 rounded-full bg-highlight hover:bg-highlight/90 font-semibold shadow-md"
        >
          Complete Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
