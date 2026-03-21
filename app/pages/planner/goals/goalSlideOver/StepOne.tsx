"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PillSelect, type PillOption } from "../../components/PillSelect";
import { GoalTypeSelector } from "./GoalTypeSelector";
import { CpfToggle } from "./CpfToggle";
import { GoalFlowType, GoalOwnerType, type GoalFormState } from "./types";

interface StepOneProps {
  form: GoalFormState;
  hasPartner: boolean;
  onNameChange: (value: string) => void;
  onFlowTypeChange: (type: GoalFlowType) => void;
  onOwnerTypeChange: (type: GoalOwnerType) => void;
  onCpfEligibleChange: (value: boolean) => void;
}

const OWNER_OPTIONS: PillOption<GoalOwnerType>[] = [
  { value: GoalOwnerType.User, label: "Mine" },
  { value: GoalOwnerType.Partner, label: "Partner" },
  { value: GoalOwnerType.Shared, label: "Shared" },
];

export const StepOne = ({
  form,
  hasPartner,
  onNameChange,
  onFlowTypeChange,
  onOwnerTypeChange,
  onCpfEligibleChange,
}: StepOneProps) => (
  <div className="space-y-6">
    <div>
      <Label htmlFor="name" className="text-sm font-bold text-navy">
        Goal Name
      </Label>
      <Input
        id="name"
        value={form.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="e.g. Travel Fund 2024"
        className="mt-1"
      />
    </div>

    <GoalTypeSelector value={form.flowType} onChange={onFlowTypeChange} />

    {hasPartner && (
      <PillSelect<GoalOwnerType>
        label="Owner"
        variant="segment"
        options={OWNER_OPTIONS}
        value={form.ownerType}
        onChange={onOwnerTypeChange}
      />
    )}

    <CpfToggle
      checked={form.isCpfEligible}
      onCheckedChange={onCpfEligibleChange}
    />
  </div>
);
