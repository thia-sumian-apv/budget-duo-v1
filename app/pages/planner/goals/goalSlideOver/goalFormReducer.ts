import {
  GoalCategory,
  GoalOwnerType,
  GoalFlowType,
  type GoalFormState,
  type FormStep,
  type Goal,
} from "./types";

// --- Actions ---

type GoalFormAction =
  | { type: "SET_STEP"; step: FormStep }
  | { type: "SET_FIELD"; field: keyof GoalFormState; value: string | boolean }
  | { type: "SET_FLOW_TYPE"; flowType: GoalFlowType }
  | { type: "SET_CATEGORY"; category: GoalCategory }
  | { type: "SET_OWNER_TYPE"; ownerType: GoalOwnerType }
  | { type: "RESET"; goal: Goal | null };

// --- Initial state ---

export const initialFormState: GoalFormState = {
  step: 1,
  name: "",
  amount: "",
  flowType: GoalFlowType.Expense,
  category: GoalCategory.Monthly,
  ownerType: GoalOwnerType.User,
  duration: "",
  startDate: "",
  isCpfEligible: false,
  remarks: "",
};

// --- Reducer ---

export function goalFormReducer(
  state: GoalFormState,
  action: GoalFormAction,
): GoalFormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };

    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_FLOW_TYPE":
      return { ...state, flowType: action.flowType };

    case "SET_CATEGORY":
      return { ...state, category: action.category };

    case "SET_OWNER_TYPE":
      return { ...state, ownerType: action.ownerType };

    case "RESET": {
      const goal = action.goal;
      if (!goal) return { ...initialFormState };
      return {
        step: 1,
        name: goal.name,
        amount: goal.amount.toString(),
        flowType: goal.flowType,
        category: goal.category,
        ownerType: goal.ownerType,
        duration: goal.duration?.toString() || "",
        startDate: goal.startDate?.slice(0, 7) || "",
        isCpfEligible: goal.isCpfEligible,
        remarks: goal.remarks || "",
      };
    }

    default:
      return state;
  }
}

// --- Selectors ---

export function canProceedToStep2(state: GoalFormState): boolean {
  return !!(state.name && state.flowType);
}

export function canSubmit(state: GoalFormState): boolean {
  return !!(
    canProceedToStep2(state) &&
    state.amount &&
    (state.category === GoalCategory.Monthly ||
      (state.duration && state.startDate))
  );
}
