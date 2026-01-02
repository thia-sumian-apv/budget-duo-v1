"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import type { GetPlannerQuery } from "../Planner.api";
import { useDeleteGoalMutation } from "../Planner.api";
import { GoalOwnerType, GoalFlowType, GoalCategory } from "@/app/apolloClient.types";
import GoalForm from "../components/GoalForm";
import { formatCurrency } from "@/lib/utils/budget";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Goal = Planner["goals"][number];
type Member = Planner["members"][number];

interface GoalsCardProps {
  plannerId: string;
  goals: Goal[];
  members: Member[];
  currentUserId: string | null;
  onUpdate: () => void;
}

const flowTypeColors: Record<GoalFlowType, string> = {
  [GoalFlowType.Expense]: "border-red-300 bg-red-50 text-red-700",
  [GoalFlowType.Savings]: "border-green-300 bg-green-50 text-green-700",
  [GoalFlowType.Investment]: "border-blue-300 bg-blue-50 text-blue-700",
};

const flowTypeLabels: Record<GoalFlowType, string> = {
  [GoalFlowType.Expense]: "Expense",
  [GoalFlowType.Savings]: "Savings",
  [GoalFlowType.Investment]: "Investment",
};

const formatDateRange = (startDate: string | null | undefined, endDate: string | null | undefined): string | null => {
  if (!startDate) return null;
  const formatMonth = (d: string) => {
    const [year, month] = d.split("-");
    return `${month}/${year}`;
  };
  if (endDate) {
    return `${formatMonth(startDate)} - ${formatMonth(endDate)}`;
  }
  return `from ${formatMonth(startDate)}`;
};

const GoalItem = ({
  goal,
  onEdit,
  onDelete,
  deleting,
}: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) => {
  const colorClass = flowTypeColors[goal.flowType] ?? "border-navy/20 bg-white/50";
  const dateRange = formatDateRange(goal.startDate, goal.endDate);

  return (
    <div className={`rounded-lg border p-3 ${colorClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{goal.name}</div>
          <div className="text-xs opacity-70 mt-0.5">
            {formatCurrency(goal.monthlyAmount)}/mo
            {goal.category === GoalCategory.Goal && goal.duration && (
              <span className="ml-1">
                ({goal.duration} months)
              </span>
            )}
          </div>
          {dateRange && (
            <div className="text-[10px] opacity-50 mt-0.5">{dateRange}</div>
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="opacity-50 hover:opacity-100 transition p-1"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="opacity-50 hover:opacity-100 transition p-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex gap-1 mt-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy/10 text-navy/70">
          {flowTypeLabels[goal.flowType]}
        </span>
        {goal.isCpfEligible && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
            CPF
          </span>
        )}
      </div>
    </div>
  );
};

const GoalColumn = ({
  title,
  goals,
  ownerType,
  plannerId,
  currentUserId,
  members,
  onUpdate,
}: {
  title: string;
  goals: Goal[];
  ownerType: GoalOwnerType;
  plannerId: string;
  currentUserId: string | null;
  members: Member[];
  onUpdate: () => void;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteGoal] = useDeleteGoalMutation();

  const handleDelete = async (goalId: string) => {
    setDeletingId(goalId);
    await deleteGoal({ variables: { id: goalId } });
    setDeletingId(null);
    onUpdate();
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingGoal(null);
    onUpdate();
  };

  // Determine if user can add goals to this column
  const canAdd =
    ownerType === GoalOwnerType.Shared ||
    ownerType === GoalOwnerType.User ||
    (ownerType === GoalOwnerType.Partner && members.length > 1);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-navy/60">{title}</h4>
        {canAdd && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-navy/40 hover:text-navy/70 p-0.5"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="space-y-2">
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onEdit={() => handleEdit(goal)}
            onDelete={() => handleDelete(goal.id)}
            deleting={deletingId === goal.id}
          />
        ))}
        {goals.length === 0 && (
          <div className="text-xs text-navy/30 italic py-4 text-center">
            No goals yet
          </div>
        )}
      </div>

      {(showForm || editingGoal) && (
        <GoalForm
          plannerId={plannerId}
          defaultOwnerType={ownerType}
          currentUserId={currentUserId}
          members={members}
          existingGoal={editingGoal}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

const GoalsCard = ({
  plannerId,
  goals,
  members,
  currentUserId,
  onUpdate,
}: GoalsCardProps) => {
  // Categorize goals by actual ownership (owner.id), not the relative ownerType
  // This ensures goals show correctly regardless of who created them
  const userGoals = goals.filter(
    (g) =>
      g.ownerType !== GoalOwnerType.Shared &&
      g.owner?.id === currentUserId
  );

  const partnerGoals = goals.filter(
    (g) =>
      g.ownerType !== GoalOwnerType.Shared &&
      g.owner?.id !== currentUserId
  );

  const sharedGoals = goals.filter((g) => g.ownerType === GoalOwnerType.Shared);

  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-4">
      <h3 className="font-heading text-sm font-semibold mb-3 text-navy/80">
        Financial Goals & Expenses
      </h3>

      <div className="flex gap-4">
        <GoalColumn
          title="Your Goals"
          goals={userGoals}
          ownerType={GoalOwnerType.User}
          plannerId={plannerId}
          currentUserId={currentUserId}
          members={members}
          onUpdate={onUpdate}
        />
        {members.length > 1 && (
          <GoalColumn
            title="Partner Goals"
            goals={partnerGoals}
            ownerType={GoalOwnerType.Partner}
            plannerId={plannerId}
            currentUserId={currentUserId}
            members={members}
            onUpdate={onUpdate}
          />
        )}
        <GoalColumn
          title="Shared Goals"
          goals={sharedGoals}
          ownerType={GoalOwnerType.Shared}
          plannerId={plannerId}
          currentUserId={currentUserId}
          members={members}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};

export default GoalsCard;
