"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { useCreateGoalMutation, useUpdateGoalMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";
import {
  GoalCategory,
  GoalOwnerType,
  GoalFlowType,
} from "@/app/apolloClient.types";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Member = Planner["members"][number];
type Goal = Planner["goals"][number];

type DurationMode = "duration" | "endDate";

interface GoalFormProps {
  plannerId: string;
  defaultOwnerType: GoalOwnerType;
  currentUserId: string | null;
  members: Member[];
  existingGoal?: Goal | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Helper to calculate duration from two YYYY-MM dates
const calculateDuration = (start: string, end: string): number => {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
};

// Helper to calculate end date from start date and duration
const calculateEndDate = (start: string, months: number): string => {
  const [year, month] = start.split("-").map(Number);
  const totalMonths = month + months - 1;
  const endYear = year + Math.floor((totalMonths - 1) / 12);
  const endMonth = ((totalMonths - 1) % 12) + 1;
  return `${endYear}-${String(endMonth).padStart(2, "0")}`;
};

// Get current month in YYYY-MM format
const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const GoalForm = ({
  plannerId,
  defaultOwnerType,
  members,
  existingGoal,
  onClose,
  onSuccess,
}: GoalFormProps) => {
  const isEditing = !!existingGoal;

  const [name, setName] = useState(existingGoal?.name ?? "");
  const [amount, setAmount] = useState(existingGoal?.amount?.toString() ?? "");
  const [category, setCategory] = useState<GoalCategory>(
    (existingGoal?.category as GoalCategory) ?? GoalCategory.Monthly
  );
  const [duration, setDuration] = useState(
    existingGoal?.duration?.toString() ?? ""
  );
  const [startDate, setStartDate] = useState<string | null>(
    existingGoal?.startDate ?? null
  );
  const [endDate, setEndDate] = useState<string | null>(
    existingGoal?.endDate ?? null
  );
  const [durationMode, setDurationMode] = useState<DurationMode>("duration");
  const [ownerType, setOwnerType] = useState<GoalOwnerType>(
    (existingGoal?.ownerType as GoalOwnerType) ?? defaultOwnerType
  );
  const [flowType, setFlowType] = useState<GoalFlowType>(
    (existingGoal?.flowType as GoalFlowType) ?? GoalFlowType.Expense
  );
  const [isCpfEligible, setIsCpfEligible] = useState(
    existingGoal?.isCpfEligible ?? false
  );
  const [remarks, setRemarks] = useState(existingGoal?.remarks ?? "");
  const [error, setError] = useState<string | null>(null);

  const [createGoal, { loading: creating }] = useCreateGoalMutation();
  const [updateGoal, { loading: updating }] = useUpdateGoalMutation();

  const loading = creating || updating;

  // Auto-calculate duration or end date when the other changes
  useEffect(() => {
    if (category !== GoalCategory.Goal || !startDate) return;

    if (durationMode === "duration" && duration) {
      const months = parseInt(duration);
      if (!isNaN(months) && months > 0) {
        setEndDate(calculateEndDate(startDate, months));
      }
    }
  }, [startDate, duration, durationMode, category]);

  useEffect(() => {
    if (category !== GoalCategory.Goal || !startDate || !endDate) return;

    if (durationMode === "endDate") {
      const months = calculateDuration(startDate, endDate);
      if (months > 0) {
        setDuration(months.toString());
      }
    }
  }, [startDate, endDate, durationMode, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (category === GoalCategory.Goal) {
      const durationNum = parseInt(duration);
      if (isNaN(durationNum) || durationNum <= 0) {
        setError("Please enter a valid duration");
        return;
      }
    }

    if (isEditing && existingGoal) {
      const result = await updateGoal({
        variables: {
          id: existingGoal.id,
          input: {
            name: name.trim(),
            amount: amountNum,
            category,
            duration:
              category === GoalCategory.Goal ? parseInt(duration) : null,
            startDate: category === GoalCategory.Goal ? startDate : null,
            ownerType,
            flowType,
            isCpfEligible,
            remarks: remarks.trim() || null,
          },
        },
      });

      if (
        result.data?.updateGoal.__typename === "UpdateGoalSuccessfulResponse"
      ) {
        onSuccess();
      } else if (result.data?.updateGoal.__typename === "ErrorResponse") {
        const errorField = result.data.updateGoal.fields?.[0];
        setError(errorField?.message ?? "Failed to update goal");
      }
    } else {
      const result = await createGoal({
        variables: {
          input: {
            plannerId,
            name: name.trim(),
            amount: amountNum,
            category,
            duration:
              category === GoalCategory.Goal ? parseInt(duration) : undefined,
            startDate: category === GoalCategory.Goal ? startDate : undefined,
            ownerType,
            flowType,
            isCpfEligible,
            remarks: remarks.trim() || undefined,
          },
        },
      });

      if (
        result.data?.createGoal.__typename === "CreateGoalSuccessfulResponse"
      ) {
        onSuccess();
      } else if (result.data?.createGoal.__typename === "ErrorResponse") {
        const errorField = result.data.createGoal.fields?.[0];
        setError(errorField?.message ?? "Failed to create goal");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-navy/10 p-5 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-heading font-semibold text-navy">
            {isEditing ? "Edit Goal" : "Add Goal"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-navy/50 hover:text-navy/70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-navy/70 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Monthly Groceries"
              className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none"
              autoFocus={!isEditing}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-navy/70 mb-1">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCategory(GoalCategory.Monthly)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  category === GoalCategory.Monthly
                    ? "bg-highlight/20 border border-highlight/40 text-highlight"
                    : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCategory(GoalCategory.Goal)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  category === GoalCategory.Goal
                    ? "bg-highlight/20 border border-highlight/40 text-highlight"
                    : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                }`}
              >
                Time-bound Goal
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs text-navy/70 mb-1">
              {category === GoalCategory.Monthly
                ? "Monthly Amount"
                : "Target Amount"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none"
            />
          </div>

          {/* Time-bound Goal Settings */}
          {category === GoalCategory.Goal && (
            <div className="space-y-3 p-3 rounded-lg border border-navy/10 bg-base/50">
              <div className="text-xs text-navy/50 font-medium">
                Time Period
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs text-navy/70 mb-1">
                  Start Month
                </label>
                <MonthYearPicker
                  value={startDate}
                  onChange={(v) => setStartDate(v)}
                  placeholder="Select start month"
                />
              </div>

              {/* Duration Mode Toggle */}
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDurationMode("duration")}
                  className={`flex-1 rounded px-2 py-1 transition ${
                    durationMode === "duration"
                      ? "bg-navy/10 text-navy"
                      : "text-navy/50 hover:text-navy/70"
                  }`}
                >
                  Set duration
                </button>
                <button
                  type="button"
                  onClick={() => setDurationMode("endDate")}
                  className={`flex-1 rounded px-2 py-1 transition ${
                    durationMode === "endDate"
                      ? "bg-navy/10 text-navy"
                      : "text-navy/50 hover:text-navy/70"
                  }`}
                >
                  Set end date
                </button>
              </div>

              {durationMode === "duration" ? (
                <div>
                  <label className="block text-xs text-navy/70 mb-1">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 12"
                    min="1"
                    className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none"
                  />
                  {startDate && duration && parseInt(duration) > 0 && (
                    <div className="text-xs text-navy/40 mt-1">
                      Ends:{" "}
                      {endDate
                        ? `${endDate.split("-")[1]}/${endDate.split("-")[0]}`
                        : ""}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-navy/70 mb-1">
                    End Month
                  </label>
                  <MonthYearPicker
                    value={endDate}
                    onChange={(v) => setEndDate(v)}
                    placeholder="Select end month"
                    minDate={startDate ?? getCurrentMonth()}
                  />
                  {startDate && endDate && (
                    <div className="text-xs text-navy/40 mt-1">
                      Duration: {duration} months
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Owner Type */}
          <div>
            <label className="block text-xs text-navy/70 mb-1">Owner</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOwnerType(GoalOwnerType.User)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  ownerType === GoalOwnerType.User
                    ? "bg-highlight/20 border border-highlight/40 text-highlight"
                    : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                }`}
              >
                Mine
              </button>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => setOwnerType(GoalOwnerType.Partner)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    ownerType === GoalOwnerType.Partner
                      ? "bg-highlight/20 border border-highlight/40 text-highlight"
                      : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                  }`}
                >
                  Partner
                </button>
              )}
              <button
                type="button"
                onClick={() => setOwnerType(GoalOwnerType.Shared)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  ownerType === GoalOwnerType.Shared
                    ? "bg-highlight/20 border border-highlight/40 text-highlight"
                    : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                }`}
              >
                Shared
              </button>
            </div>
          </div>

          {/* Flow Type */}
          <div>
            <label className="block text-xs text-navy/70 mb-1">Category</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFlowType(GoalFlowType.Expense)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  flowType === GoalFlowType.Expense
                    ? "bg-red-600/20 border border-red-600/40 text-red-600"
                    : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFlowType(GoalFlowType.Savings)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  flowType === GoalFlowType.Savings
                    ? "bg-green-600/20 border border-green-600/40 text-green-600"
                    : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                }`}
              >
                Savings
              </button>
              <button
                type="button"
                onClick={() => setFlowType(GoalFlowType.Investment)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  flowType === GoalFlowType.Investment
                    ? "bg-blue-600/20 border border-blue-600/40 text-blue-600"
                    : "border border-navy/10 text-navy/60 hover:bg-navy/5"
                }`}
              >
                Investment
              </button>
            </div>
          </div>

          {/* CPF Eligible */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cpfEligible"
              checked={isCpfEligible}
              onChange={(e) => setIsCpfEligible(e.target.checked)}
              className="rounded border-navy/20 bg-white/70 text-highlight focus:ring-highlight/50"
            />
            <label htmlFor="cpfEligible" className="text-xs text-navy/70">
              CPF OA eligible (e.g., housing, education)
            </label>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs text-navy/70 mb-1">
              Remarks (optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any notes..."
              rows={2}
              className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                  ? "Save"
                  : "Add Goal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
