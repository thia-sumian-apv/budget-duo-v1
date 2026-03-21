"use client";

import { cn } from "@/lib/utils";

export type AvatarVariant = "highlight" | "cyan" | "teal" | "purple" | "navy";

const VARIANT_STYLES: Record<AvatarVariant, string> = {
  highlight: "bg-highlight/20 text-highlight",
  cyan: "bg-cyan-100 text-cyan-600",
  teal: "bg-teal-100 text-teal-600",
  purple: "bg-purple-100 text-purple-600",
  navy: "bg-navy/10 text-navy/70",
};

const BORDER_STYLES: Record<AvatarVariant, string> = {
  highlight: "border-2 border-highlight",
  cyan: "border-2 border-cyan-400",
  teal: "border-2 border-teal-400",
  purple: "border-2 border-purple-400",
  navy: "border-2 border-navy/30",
};

export type AvatarSize = "sm" | "md" | "lg" | "xl";

const SIZE_STYLES: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-sm",
  xl: "w-14 h-14 text-base",
};

interface AvatarCircleProps {
  initial: string;
  variant?: AvatarVariant;
  size?: AvatarSize;
  bordered?: boolean;
  className?: string;
}

export const AvatarCircle = ({
  initial,
  variant = "highlight",
  size = "md",
  bordered = false,
  className,
}: AvatarCircleProps) => {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shrink-0",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        bordered && BORDER_STYLES[variant],
        className,
      )}
    >
      {initial.toUpperCase()}
    </div>
  );
};
