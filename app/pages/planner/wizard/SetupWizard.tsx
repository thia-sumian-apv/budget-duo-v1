"use client";

import { useReducer } from "react";
import { AnimatePresence } from "framer-motion";
import { useUpdateMemberDataMutation } from "../Planner.api";
import type { GetPlannerQuery } from "../Planner.api";
import { wizardReducer, initialWizardState } from "./wizardReducer";
import { WelcomeStep } from "./steps/WelcomeStep";
import { IncomeStep } from "./steps/IncomeStep";
import { BreakdownStep } from "./steps/BreakdownStep";
import { CompleteStep } from "./steps/CompleteStep";

type PlannerMember = NonNullable<GetPlannerQuery["getPlanner"]>["members"][0];

interface SetupWizardProps {
  plannerId: string;
  plannerCode: string;
  members: PlannerMember[];
  currentUserId: string | null;
  onComplete: () => void;
}

export const SetupWizard = ({
  plannerId,
  plannerCode,
  members,
  currentUserId,
  onComplete,
}: SetupWizardProps) => {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [updateMemberData] = useUpdateMemberDataMutation();

  const currentMember = members.find((m) => m.user.id === currentUserId);

  const handleSubmitIncome = async () => {
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      const result = await updateMemberData({
        variables: {
          plannerId,
          input: {
            displayName: state.displayName || undefined,
            age: parseInt(state.age, 10),
            monthlyIncome: parseFloat(state.monthlyIncome),
          },
        },
      });

      if (
        result.data?.updateMemberData.__typename ===
        "UpdateMemberDataSuccessfulResponse"
      ) {
        const updatedMember = result.data.updateMemberData.planner.members.find(
          (m) => m.user.id === currentUserId
        );
        if (updatedMember?.cpfBreakdown) {
          dispatch({ type: "SET_CPF_DATA", cpfData: updatedMember.cpfBreakdown });
        }
        dispatch({ type: "GO_TO", step: "breakdown" });
      }
    } catch (err) {
      console.error("Failed to update member data:", err);
    } finally {
      dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
    }
  };

  return (
    <div className="py-8 px-4">
      <AnimatePresence mode="wait">
        {state.step === "welcome" && (
          <WelcomeStep
            userName={currentMember?.user.name ?? undefined}
            onNext={() => dispatch({ type: "GO_TO", step: "income" })}
            onStepClick={(step) => dispatch({ type: "GO_TO", step })}
          />
        )}

        {state.step === "income" && (
          <IncomeStep
            displayName={state.displayName}
            age={state.age}
            monthlyIncome={state.monthlyIncome}
            defaultName={currentMember?.user.name ?? undefined}
            isSubmitting={state.isSubmitting}
            onDisplayNameChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "displayName", value: v })
            }
            onAgeChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "age", value: v })
            }
            onMonthlyIncomeChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "monthlyIncome", value: v })
            }
            onNext={handleSubmitIncome}
            onBack={() => dispatch({ type: "GO_TO", step: "welcome" })}
            onStepClick={(step) => dispatch({ type: "GO_TO", step })}
          />
        )}

        {state.step === "breakdown" && (
          <BreakdownStep
            age={state.age}
            monthlyIncome={state.monthlyIncome}
            cpfData={state.cpfData}
            onNext={() => dispatch({ type: "GO_TO", step: "complete" })}
            onBack={() => dispatch({ type: "GO_TO", step: "income" })}
            onStepClick={(step) => dispatch({ type: "GO_TO", step })}
          />
        )}

        {state.step === "complete" && (
          <CompleteStep
            displayName={state.displayName}
            monthlyIncome={state.monthlyIncome}
            cpfData={state.cpfData}
            userName={currentMember?.user.name ?? undefined}
            plannerCode={plannerCode}
            onComplete={onComplete}
            onStepClick={(step) => dispatch({ type: "GO_TO", step })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SetupWizard;
