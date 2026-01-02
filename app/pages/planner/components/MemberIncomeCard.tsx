"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoTooltip, IconTooltip } from "./InfoTooltip";
import { formatCurrency } from "@/lib/utils/budget";
import type { GetPlannerQuery } from "../Planner.api";

type PlannerMember = NonNullable<
  GetPlannerQuery["getPlanner"]
>["members"][0];

interface MemberIncomeCardProps {
  member: PlannerMember;
  isCurrentUser: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSaveEdit: (data: {
    displayName?: string;
    age: number;
    monthlyIncome: number;
  }) => Promise<void>;
  isSaving: boolean;
}

export const MemberIncomeCard = ({
  member,
  isCurrentUser,
  isExpanded,
  onToggleExpand,
  onSaveEdit,
  isSaving,
}: MemberIncomeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    age: "",
    monthlyIncome: "",
  });

  const cpf = member.cpfBreakdown;

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditForm({
      displayName: member.displayName || "",
      age: member.age?.toString() || "",
      monthlyIncome: member.monthlyIncome?.toString() || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ displayName: "", age: "", monthlyIncome: "" });
  };

  const handleSaveEdit = async () => {
    if (!editForm.age || !editForm.monthlyIncome) return;

    await onSaveEdit({
      displayName: editForm.displayName || undefined,
      age: parseInt(editForm.age, 10),
      monthlyIncome: parseFloat(editForm.monthlyIncome),
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-navy/10 bg-white/60 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCurrentUser ? "bg-highlight/20" : "bg-navy/10"
              }`}
            >
              <span
                className={`text-sm font-bold ${
                  isCurrentUser ? "text-highlight" : "text-navy/70"
                }`}
              >
                {member.displayName?.[0] || member.user.name?.[0] || "?"}
              </span>
            </div>
            <div>
              <p className="font-medium text-navy">
                {member.displayName || member.user.name || "Unknown"}
              </p>
              <p className="text-xs text-navy/50">
                {isCurrentUser ? "You" : "Partner"}
                {member.age && ` • ${member.age} years old`}
              </p>
            </div>
          </div>

          {isCurrentUser && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartEdit}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-4 space-y-3 pt-4 border-t border-navy/10">
            <div>
              <Label className="text-xs text-navy/60">Display Name</Label>
              <Input
                value={editForm.displayName}
                onChange={(e) =>
                  setEditForm({ ...editForm, displayName: e.target.value })
                }
                className="mt-1 h-9"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-navy/60">Age</Label>
                <Input
                  type="number"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm({ ...editForm, age: e.target.value })
                  }
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-navy/60">Gross Income</Label>
                <Input
                  type="number"
                  value={editForm.monthlyIncome}
                  onChange={(e) =>
                    setEditForm({ ...editForm, monthlyIncome: e.target.value })
                  }
                  className="mt-1 h-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="h-8 rounded-full bg-highlight hover:bg-highlight/90"
              >
                <Check className="mr-1 h-3 w-3" />
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-8 rounded-full"
              >
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Summary */}
        {!isEditing && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-navy/60">
              <InfoTooltip term="takeHome">Take-home</InfoTooltip>
            </span>
            <span className="text-lg font-bold text-navy">
              {cpf ? formatCurrency(cpf.takeHomePay) : "Not set"}
            </span>
          </div>
        )}
      </div>

      {/* Expandable CPF Breakdown */}
      {!isEditing && cpf && (
        <>
          <button
            onClick={onToggleExpand}
            className="w-full px-4 py-2 flex items-center justify-between text-xs text-navy/50 hover:bg-navy/5 transition-colors border-t border-navy/10"
          >
            <span>View CPF breakdown</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 space-y-2 bg-navy/5"
            >
              <div className="flex justify-between text-sm pt-3">
                <span className="text-navy/60">Gross Income</span>
                <span className="text-navy">
                  {formatCurrency(member.monthlyIncome || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60 flex items-center gap-1">
                  <InfoTooltip term="oa" showIcon={false}>
                    OA
                  </InfoTooltip>
                  <IconTooltip term="oa" className="ml-0.5" />
                </span>
                <span className="text-navy">
                  {formatCurrency(cpf.ordinaryAccount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60 flex items-center gap-1">
                  <InfoTooltip term="sa" showIcon={false}>
                    SA
                  </InfoTooltip>
                  <IconTooltip term="sa" className="ml-0.5" />
                </span>
                <span className="text-navy">
                  {formatCurrency(cpf.specialAccount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60 flex items-center gap-1">
                  <InfoTooltip term="ma" showIcon={false}>
                    MA
                  </InfoTooltip>
                  <IconTooltip term="ma" className="ml-0.5" />
                </span>
                <span className="text-navy">
                  {formatCurrency(cpf.medisaveAccount)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-navy/10">
                <span className="text-navy/60">Total CPF</span>
                <span className="text-navy font-medium">
                  {formatCurrency(cpf.totalContribution)}
                </span>
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};
