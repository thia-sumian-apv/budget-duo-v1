"use client";

import { Switch } from "@/components/ui/switch";

interface CpfToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const CpfToggle = ({ checked, onCheckedChange }: CpfToggleProps) => (
  <div className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl border border-teal-200/50">
    <div className="flex-1 mr-4">
      <p className="text-sm font-bold text-teal-700">CPF OA Eligible?</p>
      <p className="text-xs text-teal-600/70 mt-0.5">
        If eligible, this will be deducted from your CPF OA first, with any
        remainder from cash.
      </p>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-teal-500 shrink-0"
    />
  </div>
);
