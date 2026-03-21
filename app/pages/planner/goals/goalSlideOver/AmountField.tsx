"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const AmountField = ({
  id,
  label,
  value,
  onChange,
}: AmountFieldProps) => (
  <div>
    <Label htmlFor={id} className="text-sm font-bold text-navy">
      {label}
    </Label>
    <div className="relative mt-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50">
        $
      </span>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="pl-7"
        min={0}
      />
    </div>
  </div>
);
