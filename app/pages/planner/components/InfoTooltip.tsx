"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Terminology definitions for CPF and financial terms
const TERMINOLOGY = {
  cpf: "Central Provident Fund - Singapore's mandatory savings scheme for working citizens and PRs",
  oa: "Ordinary Account - Use for housing, education, and approved investments",
  sa: "Special Account - Locked for retirement, grows at 4% p.a.",
  ma: "Medisave Account - For medical expenses and insurance premiums",
  takeHome: "Your salary after CPF deductions - what you actually receive each month",
  expense: "Money spent that doesn't come back (bills, groceries, rent)",
  savings: "Money set aside for future use (emergency fund, vacations)",
  investment: "Money put to work to grow over time (stocks, bonds)",
  incomeBased: "Split shared expenses proportionally based on each person's take-home income",
  shared: "Costs split between both partners based on your contribution ratio",
  owCeiling: "Ordinary Wage ceiling - maximum monthly salary for CPF calculation ($6,800)",
  flowType: "Category of money flow: Expense (spending), Savings (storing), or Investment (growing)",
} as const;

export type TerminologyKey = keyof typeof TERMINOLOGY;

interface InfoTooltipProps {
  term: TerminologyKey;
  children: React.ReactNode;
  showIcon?: boolean;
}

export const InfoTooltip = ({
  term,
  children,
  showIcon = true,
}: InfoTooltipProps) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 border-b border-dotted border-navy/30 cursor-help">
          {children}
          {showIcon && <HelpCircle className="h-3 w-3 text-navy/40" />}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm">{TERMINOLOGY[term]}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Standalone icon tooltip for use without wrapping text
interface IconTooltipProps {
  term: TerminologyKey;
  className?: string;
}

export const IconTooltip = ({ term, className }: IconTooltipProps) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center text-navy/40 hover:text-navy/60 transition-colors ${className}`}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm">{TERMINOLOGY[term]}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default InfoTooltip;
