import { useReducer, useMemo } from "react";
import type { PillOption } from "../PillSelect";
import type { ViewMode, ViewDataMap, FlowTypeBreakdownProps } from "./types";

// --- Reducer ---

type ViewAction = { type: "SET_VIEW"; mode: ViewMode };

function viewReducer(_state: ViewMode, action: ViewAction): ViewMode {
  return action.mode;
}

// --- Hook ---

export function useFlowTypeView({
  flowTypeTotals,
  currentFlowTypeTotals,
  partnerFlowTypeTotals,
  combinedTakeHome,
  currentTakeHome,
  partnerTakeHome,
  currentName = "You",
  partnerName,
  hasPartner = false,
}: Pick<
  FlowTypeBreakdownProps,
  | "flowTypeTotals"
  | "currentFlowTypeTotals"
  | "partnerFlowTypeTotals"
  | "combinedTakeHome"
  | "currentTakeHome"
  | "partnerTakeHome"
  | "currentName"
  | "partnerName"
  | "hasPartner"
>) {
  const [viewMode, dispatch] = useReducer(viewReducer, "overall");

  const viewData = useMemo<ViewDataMap>(() => {
    const map: ViewDataMap = {
      overall: { totals: flowTypeTotals, income: combinedTakeHome },
    };

    if (currentFlowTypeTotals && currentTakeHome != null) {
      map.you = { totals: currentFlowTypeTotals, income: currentTakeHome };
    }

    if (partnerFlowTypeTotals && partnerTakeHome != null) {
      map.partner = {
        totals: partnerFlowTypeTotals,
        income: partnerTakeHome,
      };
    }

    return map;
  }, [
    flowTypeTotals,
    combinedTakeHome,
    currentFlowTypeTotals,
    currentTakeHome,
    partnerFlowTypeTotals,
    partnerTakeHome,
  ]);

  const active = viewData[viewMode] ?? viewData.overall;
  const canToggle = !!viewData.you;

  const viewOptions = useMemo<PillOption<ViewMode>[]>(() => {
    const opts: PillOption<ViewMode>[] = [
      { value: "overall", label: "Overall" },
    ];
    if (viewData.you) {
      opts.push({ value: "you", label: currentName });
    }
    if (viewData.partner && hasPartner) {
      opts.push({ value: "partner", label: partnerName });
    }
    return opts;
  }, [viewData, currentName, partnerName, hasPartner]);

  const setViewMode = (mode: ViewMode) =>
    dispatch({ type: "SET_VIEW", mode });

  return { viewMode, setViewMode, active, canToggle, viewOptions };
}
