export type WizardStep = "welcome" | "income" | "breakdown" | "complete";

export type CpfData = {
  ordinaryAccount: number;
  specialAccount: number;
  medisaveAccount: number;
  takeHomePay: number;
  totalContribution: number;
};

export type WizardState = {
  step: WizardStep;
  displayName: string;
  age: string;
  monthlyIncome: string;
  cpfData: CpfData | null;
  isSubmitting: boolean;
};

export type WizardAction =
  | { type: "GO_TO"; step: WizardStep }
  | { type: "SET_FIELD"; field: "displayName" | "age" | "monthlyIncome"; value: string }
  | { type: "SET_CPF_DATA"; cpfData: CpfData }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean };

export const initialWizardState: WizardState = {
  step: "welcome",
  displayName: "",
  age: "",
  monthlyIncome: "",
  cpfData: null,
  isSubmitting: false,
};

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "GO_TO":
      return { ...state, step: action.step };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_CPF_DATA":
      return { ...state, cpfData: action.cpfData };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting };
  }
}
