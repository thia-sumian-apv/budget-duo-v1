"use client";

import { useReducer, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  useCreateGoalMutation,
  useUpdateGoalMutation,
} from "../../Planner.api";
import {
  goalFormReducer,
  initialFormState,
  canProceedToStep2,
  canSubmit,
} from "./goalFormReducer";
import { StepProgress } from "./StepProgress";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { GoalCategory, type GoalSlideOverProps } from "./types";

export const GoalSlideOver = ({
  isOpen,
  onClose,
  plannerId,
  goal,
  members,
  onSuccess,
}: GoalSlideOverProps) => {
  const isEditing = !!goal;
  const [form, dispatch] = useReducer(goalFormReducer, initialFormState);

  const [createGoal, { loading: creating }] = useCreateGoalMutation();
  const [updateGoal, { loading: updating }] = useUpdateGoalMutation();

  const hasPartner = members.length > 1;
  const loading = creating || updating;

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      dispatch({ type: "RESET", goal });
    }
  }, [isOpen, goal]);

  const handleSubmit = async () => {
    if (!canSubmit(form)) return;

    const input = {
      name: form.name,
      amount: parseFloat(form.amount),
      category: form.category,
      flowType: form.flowType,
      ownerType: form.ownerType,
      isCpfEligible: form.isCpfEligible,
      remarks: form.remarks || undefined,
      ...(form.category === GoalCategory.Goal && {
        duration: parseInt(form.duration, 10) || undefined,
        startDate: form.startDate ? `${form.startDate}-01` : undefined,
      }),
    };

    try {
      if (isEditing && goal) {
        await updateGoal({ variables: { id: goal.id, input } });
        toast.success("Goal updated successfully");
      } else {
        await createGoal({
          variables: { input: { plannerId, ...input } },
        });
        toast.success("Goal created successfully");
      }
      onSuccess();
    } catch {
      toast.error(
        isEditing
          ? "Failed to update goal. Please try again."
          : "Failed to create goal. Please try again.",
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-navy/10 bg-gray-50 space-y-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-highlight flex items-center justify-center text-white">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl font-extrabold text-navy">
                {isEditing ? "Edit Goal" : "New Goal"}
              </SheetTitle>
              <SheetDescription className="text-xs text-navy/60 font-medium mt-0">
                {form.step === 1
                  ? "Step 1 of 2: Basic Info"
                  : "Step 2 of 2: Details"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <StepProgress step={form.step} />

          {form.step === 1 && (
            <StepOne
              form={form}
              hasPartner={hasPartner}
              onNameChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "name", value: v })
              }
              onFlowTypeChange={(v) =>
                dispatch({ type: "SET_FLOW_TYPE", flowType: v })
              }
              onOwnerTypeChange={(v) =>
                dispatch({ type: "SET_OWNER_TYPE", ownerType: v })
              }
              onCpfEligibleChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "isCpfEligible", value: v })
              }
            />
          )}

          {form.step === 2 && (
            <StepTwo
              form={form}
              onCategoryChange={(v) =>
                dispatch({ type: "SET_CATEGORY", category: v })
              }
              onAmountChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "amount", value: v })
              }
              onStartDateChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "startDate", value: v })
              }
              onDurationChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "duration", value: v })
              }
              onRemarksChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "remarks", value: v })
              }
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-navy/10 bg-white flex items-center gap-3">
          {form.step === 1 ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onClose}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
                disabled={!canProceedToStep2(form)}
                className="flex-[2] rounded-xl bg-highlight hover:bg-highlight/90 shadow-lg shadow-highlight/20"
              >
                Next Step
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
                className="flex-1 rounded-xl"
              >
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit(form) || loading}
                className="flex-[2] rounded-xl bg-highlight hover:bg-highlight/90 shadow-lg shadow-highlight/20"
              >
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Add Goal"}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
