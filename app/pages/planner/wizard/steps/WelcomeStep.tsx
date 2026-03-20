import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "../StepIndicator";

interface WelcomeStepProps {
  userName?: string;
  onNext: () => void;
  onStepClick?: (step: import("../wizardReducer").WizardStep) => void;
}

export const WelcomeStep = ({ userName, onNext, onStepClick }: WelcomeStepProps) => {
  const firstName = userName?.split(" ")[0] || "there";

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Stepper — on grey background */}
      <StepIndicator currentStep="welcome" onStepClick={onStepClick} />

      {/* Heading — on grey background */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-navy leading-tight">
          Welcome to your financial journey, {firstName}!
        </h1>
        <p className="mt-2 text-navy/60 leading-relaxed">
          Let&apos;s get you set up in less than 3 minutes. We&apos;ll help you
          understand your CPF and take-home pay so you can plan with confidence.
        </p>
      </div>

      {/* Value prop cards — white cards on grey background */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-navy/10">
          <div className="p-2.5 bg-navy/5 rounded-lg shrink-0">
            <Zap className="h-5 w-5 text-highlight" />
          </div>
          <div>
            <p className="font-heading font-bold text-navy text-sm">
              Quick Setup
            </p>
            <p className="text-xs text-navy/50 mt-0.5">Simple 3-minute flow</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-navy/10">
          <div className="p-2.5 bg-highlight/10 rounded-lg shrink-0">
            <ShieldCheck className="h-5 w-5 text-highlight" />
          </div>
          <div>
            <p className="font-heading font-bold text-navy text-sm">
              Private &amp; Secure
            </p>
            <p className="text-xs text-navy/50 mt-0.5">Your data stays local</p>
          </div>
        </div>
      </div>

      {/* CTA — on grey background */}
      <Button
        onClick={onNext}
        className="rounded-full bg-highlight hover:bg-highlight/90 px-8 font-semibold shadow-md shadow-highlight/20"
      >
        Let&apos;s Start
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
};
