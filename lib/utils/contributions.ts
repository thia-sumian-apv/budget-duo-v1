/**
 * Contribution ratio and goal allocation utilities
 */

interface MemberWithCpf {
  cpfBreakdown?: {
    takeHomePay: number;
  } | null;
}

interface CustomRatio {
  userId: string;
  percentage: number;
}

interface ContributionRatios {
  currentRatio: number;
  partnerRatio: number;
}

/**
 * Calculate contribution ratios between two members based on ratio mode.
 */
export function calculateContributionRatios(
  currentMember: MemberWithCpf | undefined,
  partnerMember: MemberWithCpf | undefined,
  ratioMode: string,
  customRatios: CustomRatio[] | null | undefined,
  currentUserId: string | null,
): ContributionRatios {
  const currentTakeHome = currentMember?.cpfBreakdown?.takeHomePay ?? 0;
  const partnerTakeHome = partnerMember?.cpfBreakdown?.takeHomePay ?? 0;
  const combinedTakeHome = currentTakeHome + partnerTakeHome;

  let currentRatio = 0.5;
  let partnerRatio = 0.5;

  if (ratioMode === "INCOME_BASED" && combinedTakeHome > 0) {
    currentRatio = currentTakeHome / combinedTakeHome;
    partnerRatio = partnerTakeHome / combinedTakeHome;
  } else if (ratioMode === "CUSTOM" && customRatios) {
    const currentCustom = customRatios.find((r) => r.userId === currentUserId);
    const partnerCustom = customRatios.find((r) => r.userId !== currentUserId);
    currentRatio = (currentCustom?.percentage ?? 50) / 100;
    partnerRatio = (partnerCustom?.percentage ?? 50) / 100;
  }

  return { currentRatio, partnerRatio };
}

/**
 * Get the owner label for a goal.
 */
export function getGoalOwnerLabel(
  ownerType: string,
  ownerId: string | null | undefined,
  currentUserId: string | null,
  currentName: string,
  partnerName: string,
): string {
  if (ownerType === "SHARED") return "Shared";
  if (ownerId === currentUserId) return currentName;
  return partnerName;
}

interface GoalContributions {
  current: number;
  partner: number;
  isShared: boolean;
}

/**
 * Calculate per-person contributions for a goal.
 */
export function getGoalContributions(
  monthlyAmount: number,
  ownerType: string,
  ownerId: string | null | undefined,
  currentUserId: string | null,
  hasPartner: boolean,
  ratios: ContributionRatios,
): GoalContributions {
  if (ownerType === "SHARED" && hasPartner) {
    return {
      current: monthlyAmount * ratios.currentRatio,
      partner: monthlyAmount * ratios.partnerRatio,
      isShared: true,
    };
  }
  if (ownerType === "USER" && ownerId === currentUserId) {
    return { current: monthlyAmount, partner: 0, isShared: false };
  }
  return { current: 0, partner: monthlyAmount, isShared: false };
}
