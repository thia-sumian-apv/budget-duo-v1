"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateMemberDataMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";

type PlannerMember = NonNullable<GetPlannerQuery["getPlanner"]>["members"][0];

interface SetupWizardProps {
  plannerId: string;
  members: PlannerMember[];
  currentUserId: string | null;
  onComplete: () => void;
}

type WizardStep = "welcome" | "income" | "education" | "complete";

export const SetupWizard = ({
  plannerId,
  members,
  currentUserId,
  onComplete,
}: SetupWizardProps) => {
  const [step, setStep] = useState<WizardStep>("welcome");
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateMemberData] = useUpdateMemberDataMutation();

  const currentMember = members.find((m) => m.user.id === currentUserId);

  const handleSubmitIncome = async () => {
    if (!age || !monthlyIncome) return;

    setIsSubmitting(true);
    try {
      const result = await updateMemberData({
        variables: {
          plannerId,
          input: {
            displayName: displayName || undefined,
            age: parseInt(age, 10),
            monthlyIncome: parseFloat(monthlyIncome),
          },
        },
      });

      if (result.data?.updateMemberData.__typename === "UpdateMemberDataSuccessfulResponse") {
        setStep("education");
      }
    } catch (err) {
      console.error("Failed to update member data:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-5">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md text-center"
          >
            <div className="mx-auto w-12 h-12 rounded-full bg-highlight/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-highlight" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy">
              Let&apos;s set up your budget
            </h2>
            <p className="mt-3 text-navy/70">
              We&apos;ll need a few details to calculate your CPF contributions
              and help you plan your finances together.
            </p>
            <Button
              onClick={() => setStep("income")}
              className="mt-6 rounded-full bg-highlight hover:bg-highlight/90"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-4 text-xs text-navy/50">Takes about 1 minute</p>
          </motion.div>
        )}

        {step === "income" && (
          <motion.div
            key="income"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full"
          >
            <div className="mb-6">
              <p className="text-sm text-highlight font-medium">Step 1 of 2</p>
              <h2 className="font-heading text-xl font-bold text-navy mt-1">
                Your Income Details
              </h2>
              <p className="text-sm text-navy/70 mt-1">
                This helps us calculate your CPF and take-home pay.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-sm text-navy/70">
                  Display Name (optional)
                </Label>
                <Input
                  id="displayName"
                  placeholder={currentMember?.user.name || "Your name"}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-sm text-navy/70">
                  Your Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1"
                  min={16}
                  max={100}
                />
                <p className="text-xs text-navy/50 mt-1">
                  Used to calculate CPF contribution rates
                </p>
              </div>

              <div>
                <Label htmlFor="income" className="text-sm text-navy/70">
                  Monthly Gross Income <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50">
                    $
                  </span>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 5000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="pl-7"
                    min={0}
                  />
                </div>
                <p className="text-xs text-navy/50 mt-1">
                  Your salary before CPF deductions
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep("welcome")}
                className="rounded-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmitIncome}
                disabled={!age || !monthlyIncome || isSubmitting}
                className="flex-1 rounded-full bg-highlight hover:bg-highlight/90"
              >
                {isSubmitting ? "Saving..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === "education" && (
          <motion.div
            key="education"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full"
          >
            <div className="mb-6">
              <p className="text-sm text-highlight font-medium">Step 2 of 2</p>
              <h2 className="font-heading text-xl font-bold text-navy mt-1">
                Understanding CPF
              </h2>
              <p className="text-sm text-navy/70 mt-1">
                Here&apos;s how your salary is allocated in Singapore.
              </p>
            </div>

            <div className="rounded-xl border border-navy/10 bg-white/60 p-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-navy/10">
                <span className="text-sm text-navy/70">Gross Salary</span>
                <span className="font-medium text-navy">
                  ${parseFloat(monthlyIncome || "0").toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    OA
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">Ordinary Account</p>
                    <p className="text-xs text-navy/50">Housing, education, investments</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
                    SA
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">Special Account</p>
                    <p className="text-xs text-navy/50">Retirement savings (4% interest)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                    MA
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">Medisave Account</p>
                    <p className="text-xs text-navy/50">Healthcare and insurance</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-navy/10">
                <span className="text-sm font-medium text-navy">Take-Home Pay</span>
                <span className="font-bold text-highlight">
                  What you actually receive
                </span>
              </div>
            </div>

            <p className="text-xs text-navy/50 mt-3 text-center">
              We automatically calculate these based on your age and income.
            </p>

            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep("income")}
                className="rounded-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleFinish}
                className="flex-1 rounded-full bg-highlight hover:bg-highlight/90"
              >
                <Check className="mr-2 h-4 w-4" />
                Start Planning
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SetupWizard;
