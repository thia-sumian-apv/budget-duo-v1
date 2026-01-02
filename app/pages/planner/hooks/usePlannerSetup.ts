"use client";

import { useMemo } from "react";
import type { GetPlannerQuery } from "../Planner.api";

type PlannerMember = NonNullable<GetPlannerQuery["getPlanner"]>["members"][0];

interface SetupStatus {
  // Whether the current user needs to complete setup
  needsSetup: boolean;
  // Which step to start on (based on what's missing)
  startStep: "income" | "education" | "ratio" | "complete";
  // Detailed checks
  hasIncome: boolean;
  hasAge: boolean;
  hasPartner: boolean;
  partnerHasIncome: boolean;
}

export const usePlannerSetup = (
  members: PlannerMember[],
  currentUserId: string | null
): SetupStatus => {
  return useMemo(() => {
    const currentMember = members.find((m) => m.user.id === currentUserId);
    const partnerMember = members.find((m) => m.user.id !== currentUserId);

    const hasIncome = currentMember?.monthlyIncome != null && currentMember.monthlyIncome > 0;
    const hasAge = currentMember?.age != null && currentMember.age > 0;
    const hasPartner = members.length > 1;
    const partnerHasIncome = partnerMember?.monthlyIncome != null && partnerMember.monthlyIncome > 0;

    // Determine what setup step to start on
    let startStep: SetupStatus["startStep"] = "complete";
    let needsSetup = false;

    if (!hasIncome || !hasAge) {
      needsSetup = true;
      startStep = "income";
    } else if (hasIncome && hasAge) {
      // User has completed their info, show education only on first visit
      // For now, we'll skip to ratio if partner exists
      if (hasPartner && !partnerHasIncome) {
        // Partner hasn't set up yet - skip wizard, show waiting state
        startStep = "complete";
      } else if (hasPartner && partnerHasIncome) {
        // Both have income, setup complete
        startStep = "complete";
      } else {
        // Solo - setup complete
        startStep = "complete";
      }
    }

    return {
      needsSetup,
      startStep,
      hasIncome,
      hasAge,
      hasPartner,
      partnerHasIncome,
    };
  }, [members, currentUserId]);
};

export default usePlannerSetup;
