import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Calendar,
  Banknote,
  ShieldCheck,
  Calculator,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "../StepIndicator";

interface IncomeStepProps {
  displayName: string;
  age: string;
  monthlyIncome: string;
  defaultName?: string;
  isSubmitting: boolean;
  onDisplayNameChange: (v: string) => void;
  onAgeChange: (v: string) => void;
  onMonthlyIncomeChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  onStepClick?: (step: import("../wizardReducer").WizardStep) => void;
}

export const IncomeStep = ({
  displayName,
  age,
  monthlyIncome,
  defaultName,
  isSubmitting,
  onDisplayNameChange,
  onAgeChange,
  onMonthlyIncomeChange,
  onNext,
  onBack,
  onStepClick,
}: IncomeStepProps) => {
  return (
    <motion.div
      key="income"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Stepper — on grey background */}
      <StepIndicator currentStep="income" onStepClick={onStepClick} />

      {/* Heading — on grey background */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
          Tell us a bit about your finances
        </h1>
        <p className="text-navy/60 mt-1">
          This helps us customise your Budget Duo experience and automate CPF
          calculations.
        </p>
      </div>

      {/* Form card — white card, inputs only */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-navy/10 space-y-5">
        {/* Display Name */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-navy font-heading">
            Display Name
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40 pointer-events-none" />
            <Input
              placeholder={defaultName || "e.g. Alex"}
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              className="pl-10 rounded-full bg-navy/5 border-0 focus-visible:ring-2 focus-visible:ring-highlight"
            />
          </div>
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold text-navy font-heading">
              Age <span className="text-red-500">*</span>
            </Label>
            <span className="text-[10px] text-navy/40 bg-navy/5 px-2 py-0.5 rounded-full">
              Used for Singapore CPF rate calculation
            </span>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40 pointer-events-none" />
            <Input
              type="number"
              placeholder="e.g. 30"
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              className="pl-10 rounded-full bg-navy/5 border-0 focus-visible:ring-2 focus-visible:ring-highlight"
              min={16}
              max={100}
            />
          </div>
        </div>

        {/* Monthly Gross Income */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-navy font-heading">
            Monthly Gross Income (SGD){" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Banknote className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40 pointer-events-none" />
            <Input
              type="number"
              placeholder="0.00"
              value={monthlyIncome}
              onChange={(e) => onMonthlyIncomeChange(e.target.value)}
              className="pl-10 rounded-full bg-navy/5 border-0 focus-visible:ring-2 focus-visible:ring-highlight"
              min={0}
            />
          </div>
        </div>

        {/* Privacy note — stays inside the card */}
        <div className="flex items-start gap-3 p-4 bg-highlight/10 rounded-xl">
          <ShieldCheck className="h-5 w-5 text-highlight shrink-0 mt-0.5" />
          <p className="text-xs text-navy/70 leading-relaxed font-medium">
            Your data is encrypted and only visible to you and your partner.
          </p>
        </div>
      </div>

      {/* Bento info cards — on grey background */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-navy p-5 rounded-xl text-white flex flex-col justify-between h-36">
          <Calculator className="h-7 w-7 text-highlight" />
          <p className="text-sm font-medium opacity-80 leading-snug">
            Real-time calculations for CPF contributions based on 2024 rates.
          </p>
        </div>
        <div className="bg-highlight p-5 rounded-xl text-white flex flex-col justify-between h-36">
          <Lock className="h-7 w-7 text-white" />
          <p className="text-sm font-medium leading-snug">
            End-to-end encryption ensures your financial privacy is maintained.
          </p>
        </div>
      </div>

      {/* Nav buttons — on grey background */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full text-navy/60"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!age || !monthlyIncome || isSubmitting}
          className="flex-1 rounded-full bg-highlight hover:bg-highlight/90 font-semibold shadow-md"
        >
          {isSubmitting ? "Saving..." : "Continue to CPF Breakdown"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
