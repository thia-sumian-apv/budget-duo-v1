"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MonthYearPicker from "@/components/ui/MonthYearPicker";
import { AmountField } from "./AmountField";

interface TimeBoundFieldsProps {
  amount: string;
  startDate: string;
  duration: string;
  onAmountChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}

export const TimeBoundFields = ({
  amount,
  startDate,
  duration,
  onAmountChange,
  onStartDateChange,
  onDurationChange,
}: TimeBoundFieldsProps) => {
  const monthlyContribution =
    duration && amount
      ? (parseFloat(amount) / parseInt(duration, 10)).toFixed(0)
      : null;

  return (
    <div className="p-4 bg-gray-50 border border-navy/10 rounded-2xl space-y-4">
      <AmountField
        id="totalAmount"
        label="Total Amount"
        value={amount}
        onChange={onAmountChange}
      />

      <div>
        <Label className="text-sm font-bold text-navy">Start Date</Label>
        <MonthYearPicker
          value={startDate || null}
          onChange={(v) => onStartDateChange(v || "")}
          placeholder="Select start month"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="duration" className="text-sm font-bold text-navy">
          Duration (months)
        </Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
          placeholder="e.g., 12"
          className="mt-1"
          min={1}
        />
      </div>

      {monthlyContribution && (
        <p className="text-xs text-navy/60">
          Monthly contribution:{" "}
          <span className="font-medium text-navy">
            ${monthlyContribution}/mo
          </span>
        </p>
      )}
    </div>
  );
};
