"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreatePlannerMutation } from "./Planner.api";
import { X } from "lucide-react";

interface CreatePlannerModalProps {
  onClose: () => void;
  onSuccess: (plannerId: string) => void;
}

const CreatePlannerModal = ({ onClose, onSuccess }: CreatePlannerModalProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createPlanner, { loading }] = useCreatePlannerMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    const result = await createPlanner({
      variables: { input: { name: name.trim() } },
    });

    if (result.data?.createPlanner.__typename === "CreatePlannerSuccessfulResponse") {
      onSuccess(result.data.createPlanner.planner.id);
    } else if (result.data?.createPlanner.__typename === "ErrorResponse") {
      const errorField = result.data.createPlanner.fields?.[0];
      setError(errorField?.message ?? "Failed to create planner");
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-navy/10 p-5 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-heading font-semibold text-navy">Create New Planner</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-navy/50 hover:text-navy/70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-navy/70 mb-1">
              Planner Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Our Budget 2025"
              className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm text-navy focus:border-highlight/50 focus:outline-none"
              autoFocus
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create Planner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlannerModal;
