"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useJoinPlannerMutation,
  useGetPlannerByCodeLazyQuery,
} from "./Planner.api";
import { normalizePlannerCode } from "@/lib/utils/plannerCode";
import { X, Users } from "lucide-react";

interface JoinPlannerModalProps {
  onClose: () => void;
  onSuccess: (plannerId: string) => void;
}

const JoinPlannerModal = ({ onClose, onSuccess }: JoinPlannerModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [getPlannerByCode, { data: previewData, loading: previewLoading }] =
    useGetPlannerByCodeLazyQuery();
  const [joinPlanner, { loading: joinLoading }] = useJoinPlannerMutation();

  const normalizedCode = normalizePlannerCode(code);
  const previewPlanner = previewData?.getPlannerByCode;

  const handleCodeChange = (value: string) => {
    setCode(value.toUpperCase());
    setError(null);

    const normalized = normalizePlannerCode(value);
    if (normalized.length === 6) {
      getPlannerByCode({ variables: { code: normalized } });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (normalizedCode.length !== 6) {
      setError("Please enter a valid 6-character code");
      return;
    }

    const result = await joinPlanner({
      variables: { input: { code: normalizedCode } },
    });

    if (
      result.data?.joinPlanner.__typename === "JoinPlannerSuccessfulResponse"
    ) {
      onSuccess(result.data.joinPlanner.planner.id);
    } else if (result.data?.joinPlanner.__typename === "ErrorResponse") {
      const errorField = result.data.joinPlanner.fields?.[0];
      setError(errorField?.message ?? "Failed to join planner");
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl border border-navy/10 p-5 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-heading font-semibold text-navy">
            Join a Planner
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
          <div>
            <label className="block text-xs text-navy/70 mb-1">
              Planner Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="ABC-DEF"
              maxLength={7}
              className="w-full rounded-lg border border-navy/10 bg-white/70 px-3 py-3 text-center text-lg font-mono tracking-widest text-navy focus:border-highlight/50 focus:outline-none"
              autoFocus
            />
            <p className="mt-1 text-xs text-navy/40">
              Ask the planner owner for the 6-character code
            </p>
          </div>

          {previewLoading && (
            <div className="text-xs text-navy/50">Looking up planner...</div>
          )}

          {previewPlanner && normalizedCode.length === 6 && (
            <div className="rounded-lg border border-navy/10 bg-base/50 p-3">
              <div className="text-sm font-medium text-navy">
                {previewPlanner.name}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-navy/50">
                <Users className="h-3 w-3" />
                {previewPlanner.members.length} member
                {previewPlanner.members.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {!previewPlanner &&
            normalizedCode.length === 6 &&
            !previewLoading && (
              <div className="text-xs text-red-600">
                No planner found with this code
              </div>
            )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                joinLoading || normalizedCode.length !== 6 || !previewPlanner
              }
            >
              {joinLoading ? "Joining..." : "Join Planner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinPlannerModal;
