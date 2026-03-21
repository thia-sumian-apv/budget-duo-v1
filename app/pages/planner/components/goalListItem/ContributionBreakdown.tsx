"use client";

import { AvatarCircle, type AvatarVariant } from "@/components/ui/avatar-circle";
import { formatCurrency } from "@/lib/utils/budget";
import { getInitial } from "@/lib/utils/member";
import type { Contributions, Ratios } from "./types";

const AVATAR_VARIANTS: AvatarVariant[] = ["highlight", "teal", "purple", "navy"];

interface ContributorCardProps {
  name: string;
  amount: number;
  variantIndex: number;
}

const ContributorCard = ({ name, amount, variantIndex }: ContributorCardProps) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy/10">
    <div className="flex items-center gap-2">
      <AvatarCircle
        initial={getInitial(name)}
        variant={AVATAR_VARIANTS[variantIndex % AVATAR_VARIANTS.length]}
        size="sm"
      />
      <span className="text-sm font-medium text-navy">{name}</span>
    </div>
    <span className="text-sm font-bold text-navy">
      {formatCurrency(amount)}/mo
    </span>
  </div>
);

interface ContributionBreakdownProps {
  contributions: Contributions;
  ratios: Ratios;
  currentName: string;
  partnerName: string;
  hasPartner: boolean;
}

export const ContributionBreakdown = ({
  contributions,
  ratios,
  currentName,
  partnerName,
  hasPartner,
}: ContributionBreakdownProps) => {
  const showPartner =
    (contributions.isShared && hasPartner) ||
    (!contributions.isShared && contributions.partner > 0);

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-navy/60 uppercase tracking-widest">
        Per-Person Breakdown
      </p>

      <div className="grid grid-cols-1 gap-3">
        {contributions.current > 0 && (
          <ContributorCard
            name={currentName}
            amount={contributions.current}
            variantIndex={0}
          />
        )}
        {showPartner && (
          <ContributorCard
            name={partnerName}
            amount={contributions.partner}
            variantIndex={1}
          />
        )}
      </div>

      {contributions.isShared && hasPartner && (
        <p className="text-xs text-navy/50">
          Split {Math.round(ratios.currentRatio * 100)}% /{" "}
          {Math.round(ratios.partnerRatio * 100)}%
        </p>
      )}
    </div>
  );
};
