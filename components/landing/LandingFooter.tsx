"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LandingFooter = () => {
  return (
    <footer className="border-t border-navy/10">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        {/* CTA Row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-navy/10">
          <div>
            <h3 className="font-heading text-xl font-bold text-navy">
              Ready to plan smarter?
            </h3>
            <p className="mt-1 text-sm text-navy/60">
              Free to get started. No credit card required.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              className="rounded-full bg-highlight text-white hover:bg-highlight/90"
            >
              <Link href="/login">Get started</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-full hover:bg-navy/5"
            >
              <Link href="#features">Learn more</Link>
            </Button>
          </div>
        </div>

        {/* Footer links */}
        <div className="pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-sm text-navy/60">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-navy">Budget Duo</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-navy transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-navy transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-navy transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
