"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoTooltip } from "../components/InfoTooltip";
import { useCreateGoalMutation, useUpdateGoalMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";
import {
  GoalCategory,
  GoalOwnerType,
  GoalFlowType,
} from "@/app/apolloClient.types";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Goal = Planner["goals"][0];
type PlannerMember = Planner["members"][0];

interface GoalSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  plannerId: string;
  goal: Goal | null; // null = creating new
  members: PlannerMember[];
  onSuccess: () => void;
}

type FormStep = 1 | 2;

export const GoalSlideOver = ({
  isOpen,
  onClose,
  plannerId,
  goal,
  members,
  onSuccess,
}: GoalSlideOverProps) => {
  const isEditing = !!goal;
  const [step, setStep] = useState<FormStep>(1);

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [flowType, setFlowType] = useState<GoalFlowType>(GoalFlowType.Expense);
  const [category, setCategory] = useState<GoalCategory>(GoalCategory.Monthly);
  const [ownerType, setOwnerType] = useState<GoalOwnerType>(GoalOwnerType.User);
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isCpfEligible, setIsCpfEligible] = useState(false);
  const [remarks, setRemarks] = useState("");

  const [createGoal, { loading: creating }] = useCreateGoalMutation();
  const [updateGoal, { loading: updating }] = useUpdateGoalMutation();

  const hasPartner = members.length > 1;
  const loading = creating || updating;

  // Reset form when opening/closing or when goal changes
  useEffect(() => {
    if (isOpen) {
      if (goal) {
        setName(goal.name);
        setAmount(goal.amount.toString());
        setFlowType(goal.flowType);
        setCategory(goal.category);
        setOwnerType(goal.ownerType);
        setDuration(goal.duration?.toString() || "");
        setStartDate(goal.startDate?.slice(0, 7) || ""); // YYYY-MM format
        setIsCpfEligible(goal.isCpfEligible);
        setRemarks(goal.remarks || "");
      } else {
        // Reset for new goal
        setName("");
        setAmount("");
        setFlowType(GoalFlowType.Expense);
        setCategory(GoalCategory.Monthly);
        setOwnerType(GoalOwnerType.User);
        setDuration("");
        setStartDate("");
        setIsCpfEligible(false);
        setRemarks("");
      }
      setStep(1);
    }
  }, [isOpen, goal]);

  const handleSubmit = async () => {
    if (!name || !amount) return;

    const input = {
      name,
      amount: parseFloat(amount),
      category,
      flowType,
      ownerType,
      isCpfEligible,
      remarks: remarks || undefined,
      ...(category === GoalCategory.Goal && {
        duration: parseInt(duration, 10) || undefined,
        startDate: startDate ? `${startDate}-01` : undefined,
      }),
    };

    try {
      if (isEditing && goal) {
        await updateGoal({
          variables: {
            id: goal.id,
            input,
          },
        });
      } else {
        await createGoal({
          variables: {
            input: {
              plannerId,
              ...input,
            },
          },
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save goal:", err);
    }
  };

  const canProceedToStep2 = name && amount && flowType;
  const canSubmit =
    canProceedToStep2 &&
    (category === GoalCategory.Monthly || (duration && startDate));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/20 z-40"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-navy/10">
              <h2 className="font-heading font-semibold text-navy">
                {isEditing ? "Edit Goal" : "New Goal"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-navy/50 hover:text-navy rounded-full hover:bg-navy/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-5">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="mb-4">
                      <p className="text-xs text-highlight font-medium">
                        Step 1 of 2
                      </p>
                      <h3 className="font-heading text-lg font-semibold text-navy mt-1">
                        Basic Info
                      </h3>
                    </div>

                    <div>
                      <Label htmlFor="name" className="text-sm text-navy/70">
                        What are you budgeting for?
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Groceries, Emergency Fund"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount" className="text-sm text-navy/70">
                        {category === GoalCategory.Monthly
                          ? "Monthly amount"
                          : "Total amount"}
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="pl-7"
                          min={0}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-navy/70 mb-2 block">
                        What type of expense is this?
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          GoalFlowType.Expense,
                          GoalFlowType.Savings,
                          GoalFlowType.Investment,
                        ].map((type) => (
                          <button
                            key={type}
                            onClick={() => setFlowType(type)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              flowType === type
                                ? type === GoalFlowType.Expense
                                  ? "bg-red-100 text-red-700"
                                  : type === GoalFlowType.Savings
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                : "bg-navy/5 text-navy/60 hover:bg-navy/10"
                            }`}
                          >
                            {type.charAt(0) + type.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="mb-4">
                      <p className="text-xs text-highlight font-medium">
                        Step 2 of 2
                      </p>
                      <h3 className="font-heading text-lg font-semibold text-navy mt-1">
                        Details
                      </h3>
                    </div>

                    {hasPartner && (
                      <div>
                        <Label className="text-sm text-navy/70 mb-2 block">
                          Who is this for?
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setOwnerType(GoalOwnerType.User)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              ownerType === GoalOwnerType.User
                                ? "bg-highlight text-white"
                                : "bg-navy/5 text-navy/60 hover:bg-navy/10"
                            }`}
                          >
                            Mine
                          </button>
                          <button
                            onClick={() => setOwnerType(GoalOwnerType.Partner)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              ownerType === GoalOwnerType.Partner
                                ? "bg-highlight text-white"
                                : "bg-navy/5 text-navy/60 hover:bg-navy/10"
                            }`}
                          >
                            Partner
                          </button>
                          <button
                            onClick={() => setOwnerType(GoalOwnerType.Shared)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              ownerType === GoalOwnerType.Shared
                                ? "bg-highlight text-white"
                                : "bg-navy/5 text-navy/60 hover:bg-navy/10"
                            }`}
                          >
                            Shared
                          </button>
                        </div>
                        {ownerType === GoalOwnerType.Shared && (
                          <p className="text-xs text-navy/50 mt-1">
                            Cost will be split based on your contribution ratio
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <Label className="text-sm text-navy/70 mb-2 block">
                        Is this ongoing or time-limited?
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setCategory(GoalCategory.Monthly)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            category === GoalCategory.Monthly
                              ? "bg-highlight text-white"
                              : "bg-navy/5 text-navy/60 hover:bg-navy/10"
                          }`}
                        >
                          Ongoing Monthly
                        </button>
                        <button
                          onClick={() => setCategory(GoalCategory.Goal)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            category === GoalCategory.Goal
                              ? "bg-highlight text-white"
                              : "bg-navy/5 text-navy/60 hover:bg-navy/10"
                          }`}
                        >
                          Time-bound Goal
                        </button>
                      </div>
                    </div>

                    {category === GoalCategory.Goal && (
                      <div className="space-y-3 p-3 bg-navy/5 rounded-lg">
                        <div>
                          <Label
                            htmlFor="startDate"
                            className="text-sm text-navy/70"
                          >
                            When does this start?
                          </Label>
                          <Input
                            id="startDate"
                            type="month"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="duration"
                            className="text-sm text-navy/70"
                          >
                            Duration (months)
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g., 12"
                            className="mt-1"
                            min={1}
                          />
                        </div>
                        {duration && amount && (
                          <p className="text-xs text-navy/60">
                            Monthly contribution:{" "}
                            <span className="font-medium text-navy">
                              $
                              {(
                                parseFloat(amount) / parseInt(duration, 10)
                              ).toFixed(0)}
                              /mo
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="cpfEligible"
                        checked={isCpfEligible}
                        onChange={(e) => setIsCpfEligible(e.target.checked)}
                        className="h-4 w-4 rounded border-navy/30 text-highlight focus:ring-highlight"
                      />
                      <Label
                        htmlFor="cpfEligible"
                        className="text-sm text-navy/70 cursor-pointer"
                      >
                        <InfoTooltip term="oa">CPF OA can be used</InfoTooltip>
                      </Label>
                    </div>
                    <p className="text-xs text-navy/50 -mt-2 ml-7">
                      e.g., housing loan, education
                    </p>

                    <div>
                      <Label htmlFor="remarks" className="text-sm text-navy/70">
                        Notes (optional)
                      </Label>
                      <Textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Any additional notes..."
                        className="mt-1 h-20"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-navy/10 flex gap-3">
              {step === 1 ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="flex-1 rounded-full bg-highlight hover:bg-highlight/90"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="rounded-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    className="flex-1 rounded-full bg-highlight hover:bg-highlight/90"
                  >
                    {loading
                      ? "Saving..."
                      : isEditing
                        ? "Save Changes"
                        : "Add Goal"}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoalSlideOver;
