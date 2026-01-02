"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateMemberDataMutation } from "./Planner.api";

interface MemberLike {
  displayName?: string | null;
  age?: number | null;
  monthlyIncome?: number | null;
}

interface MemberDataEditorProps {
  plannerId: string;
  member: MemberLike;
  onClose: () => void;
  onSuccess: () => void;
}

const MemberDataEditor = ({
  plannerId,
  member,
  onClose,
  onSuccess,
}: MemberDataEditorProps) => {
  const [displayName, setDisplayName] = useState(member.displayName ?? "");
  const [age, setAge] = useState(member.age?.toString() ?? "");
  const [monthlyIncome, setMonthlyIncome] = useState(
    member.monthlyIncome?.toString() ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  const [updateMemberData, { loading }] = useUpdateMemberDataMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await updateMemberData({
      variables: {
        plannerId,
        input: {
          displayName: displayName || null,
          age: age ? parseInt(age, 10) : null,
          monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        },
      },
    });

    if (result.data?.updateMemberData.__typename === "UpdateMemberDataSuccessfulResponse") {
      onSuccess();
    } else if (result.data?.updateMemberData.__typename === "ErrorResponse") {
      const errorField = result.data.updateMemberData.fields?.[0];
      setError(errorField?.message ?? "Failed to update");
    }
  };

  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-4">
      <h3 className="text-sm font-heading font-medium text-navy mb-4">Edit Your Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-navy/70 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How you want to be called"
            className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-navy/70 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 30"
              min="0"
              max="150"
              className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-navy/70 mb-1">
              Monthly Income (SGD)
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g., 5000"
              min="0"
              step="100"
              className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MemberDataEditor;
