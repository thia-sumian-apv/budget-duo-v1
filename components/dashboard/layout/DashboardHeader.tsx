"use client";

import { Menu, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
  userName?: string;
  onMenuClick?: () => void;
}

export const DashboardHeader = ({
  userName = "there",
  onMenuClick,
}: DashboardHeaderProps) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-navy" />
        </button>

        <h1 className="text-xl font-bold text-navy">
          Welcome back, <span className="text-highlight">{userName}</span>
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Notifications (placeholder) */}
        <button className="relative p-2 text-gray-400 hover:text-navy transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-highlight rounded-full border-2 border-white" />
        </button>

        {/* Sign out button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-navy border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};
