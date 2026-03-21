"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EditFormData } from "./types";

interface MemberEditFormProps {
  form: EditFormData;
  onChange: (form: EditFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const MemberEditForm = ({
  form,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: MemberEditFormProps) => {
  return (
    <div className="mt-4 space-y-3 pt-4 border-t border-navy/10">
      <div>
        <Label className="text-sm font-semibold text-navy">Display Name</Label>
        <Input
          value={form.displayName}
          onChange={(e) => onChange({ ...form, displayName: e.target.value })}
          className="mt-1"
          placeholder="Optional"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm font-semibold text-navy">Age</Label>
          <Input
            type="number"
            value={form.age}
            onChange={(e) => onChange({ ...form, age: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold text-navy">
            Gross Income
          </Label>
          <Input
            type="number"
            value={form.monthlyIncome}
            onChange={(e) =>
              onChange({ ...form, monthlyIncome: e.target.value })
            }
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={onSave} disabled={isSaving}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
