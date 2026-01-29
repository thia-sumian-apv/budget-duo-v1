"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  locked?: boolean;
  onClick?: () => void;
}

export const SidebarItem = ({
  href,
  icon: Icon,
  label,
  active = false,
  locked = false,
  onClick,
}: SidebarItemProps) => {
  if (locked) {
    return (
      <div className="sidebar-item sidebar-item-locked">
        <Icon className="h-5 w-5 text-gray-400" />
        <span className="flex-1">{label}</span>
        <Lock className="h-4 w-4" />
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "sidebar-item",
        active ? "sidebar-item-active" : "sidebar-item-inactive"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};
