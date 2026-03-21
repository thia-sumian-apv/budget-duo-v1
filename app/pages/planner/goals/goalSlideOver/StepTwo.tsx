"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PillSelect, type PillOption } from "../../components/PillSelect";
import { AmountField } from "./AmountField";
import { TimeBoundFields } from "./TimeBoundFields";
import { GoalCategory, type GoalFormState } from "./types";

interface StepTwoProps {
  form: GoalFormState;
  onCategoryChange: (category: GoalCategory) => void;
  onAmountChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
}

const CATEGORY_OPTIONS: PillOption<GoalCategory>[] = [
  { value: GoalCategory.Monthly, label: "Ongoing Monthly" },
  { value: GoalCategory.Goal, label: "Time-bound Goal" },
];

export const StepTwo = ({
  form,
  onCategoryChange,
  onAmountChange,
  onStartDateChange,
  onDurationChange,
  onRemarksChange,
}: StepTwoProps) => (
  <div className="space-y-6">
    <PillSelect<GoalCategory>
      label="Timeline Category"
      variant="segment"
      options={CATEGORY_OPTIONS}
      value={form.category}
      onChange={onCategoryChange}
    />

    {form.category === GoalCategory.Monthly && (
      <AmountField
        id="monthlyAmount"
        label="Monthly Amount"
        value={form.amount}
        onChange={onAmountChange}
      />
    )}

    {form.category === GoalCategory.Goal && (
      <TimeBoundFields
        amount={form.amount}
        startDate={form.startDate}
        duration={form.duration}
        onAmountChange={onAmountChange}
        onStartDateChange={onStartDateChange}
        onDurationChange={onDurationChange}
      />
    )}

    <div>
      <Label htmlFor="remarks" className="text-sm font-bold text-navy">
        Notes (optional)
      </Label>
      <Textarea
        id="remarks"
        value={form.remarks}
        onChange={(e) => onRemarksChange(e.target.value)}
        placeholder="Any additional notes..."
        className="mt-1 h-20"
      />
    </div>
  </div>
);
