"use client";

import { usePathname } from "next/navigation";
import { Wallet, LayoutDashboard, Calendar, User, Activity, X } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarUpgradeCard } from "./SidebarUpgradeCard";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Home",
  },
  {
    href: "/planner",
    icon: Calendar,
    label: "Budget Planner",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
];

const lockedItems = [
  {
    href: "#",
    icon: Activity,
    label: "Cashflow Monitoring",
    locked: true,
  },
];

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-highlight rounded-lg flex items-center justify-center shadow-lg shadow-highlight/30">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-navy uppercase">
            Budget Duo
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href)}
              onClick={onClose}
            />
          ))}

          {/* Locked items separator */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            {lockedItems.map((item) => (
              <SidebarItem
                key={item.label}
                href={item.href}
                icon={item.icon}
                label={item.label}
                locked={item.locked}
              />
            ))}
          </div>
        </nav>
      </div>

      {/* Upgrade card at bottom */}
      <div className="mt-auto p-8">
        <SidebarUpgradeCard />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar - always visible */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Mobile sidebar */}
          <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col z-50 lg:hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-navy" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};
