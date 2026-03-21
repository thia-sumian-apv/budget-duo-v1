"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  children,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 mb-6", className)}
    >
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-navy tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-navy/60 text-sm mt-1">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">{children}</div>
      )}
    </div>
  );
};
