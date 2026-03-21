"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { AvatarCircle } from "@/components/ui/avatar-circle";
import { getMemberName, getInitial } from "@/lib/utils/member";
import { MemberEditForm } from "./MemberEditForm";
import { MemberIncomeSummary } from "./MemberIncomeSummary";
import { CpfBreakdown } from "./CpfBreakdown";
import type { PlannerMember, EditFormData, SaveData } from "./types";

interface MemberIncomeCardProps {
  member: PlannerMember;
  isCurrentUser: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSaveEdit: (data: SaveData) => Promise<void>;
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
  const [editForm, setEditForm] = useState<EditFormData>({
    displayName: "",
    age: "",
    monthlyIncome: "",
  });

  const cpf = member.cpfBreakdown;
  const name = getMemberName(member, "Unknown");
  const initial = getInitial(name);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditForm({
      displayName: member.displayName || "",
      age: member.age?.toString() || "",
      monthlyIncome: member.monthlyIncome?.toString() || "",
    });
  };

  const handleSave = async () => {
    if (!editForm.age || !editForm.monthlyIncome) return;
    await onSaveEdit({
      displayName: editForm.displayName || undefined,
      age: parseInt(editForm.age, 10),
      monthlyIncome: parseFloat(editForm.monthlyIncome),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ displayName: "", age: "", monthlyIncome: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-navy/10 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <AvatarCircle
              initial={initial}
              variant={isCurrentUser ? "highlight" : "cyan"}
              size="xl"
              bordered={isCurrentUser}
            />
            <div>
              <p className="font-bold text-xl text-navy">{name}</p>
              <p className="text-xs text-navy/50 font-medium">
                {isCurrentUser ? "Member (You)" : "Partner"}
                {member.age ? ` • ${member.age} Years Old` : ""}
              </p>
            </div>
          </div>

          {isCurrentUser && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/60 hover:bg-highlight/20 hover:text-highlight transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>

        {isEditing ? (
          <MemberEditForm
            form={editForm}
            onChange={setEditForm}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <MemberIncomeSummary takeHomePay={cpf?.takeHomePay ?? null} />
        )}
      </div>

      {!isEditing && cpf && (
        <CpfBreakdown
          cpf={cpf}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
        />
      )}
    </motion.div>
  );
};
