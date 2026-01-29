"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LandingNav = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highlight shadow-lg shadow-highlight/30">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-navy">
            Budget Duo
          </span>
        </div>
        <div className="hidden items-center gap-10 md:flex">
          <Link
            href="#features"
            className="text-sm font-bold uppercase tracking-wide text-navy hover:text-highlight transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-bold uppercase tracking-wide text-navy hover:text-highlight transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-bold uppercase tracking-wide text-navy hover:text-highlight transition-colors"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="px-4 py-2 text-sm font-bold text-navy hover:text-highlight"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-navy px-8 py-3 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-navy-light"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
