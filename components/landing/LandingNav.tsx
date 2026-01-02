"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LandingNav = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-navy/10 bg-base/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="#"
            className="text-sm font-heading font-bold tracking-tight"
          >
            Budget Duo
          </Link>
          <div className="hidden gap-5 text-sm text-navy/70 md:flex">
            <Link
              href="#features"
              className="hover:text-navy transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-navy transition-colors"
            >
              How it works
            </Link>
            <Link href="#pricing" className="hover:text-navy transition-colors">
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="h-8 px-3 text-sm text-navy hover:bg-navy/5"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="h-8 rounded-full bg-highlight px-3 text-sm text-white hover:bg-highlight/90"
          >
            <Link href="/login">Try for free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
