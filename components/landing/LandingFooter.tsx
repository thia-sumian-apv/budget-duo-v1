"use client";

import Link from "next/link";
import { Wallet, Globe } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="py-20 px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        {/* Logo and tagline */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-highlight rounded-lg flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-navy">
              Budget Duo
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs text-center md:text-left">
            The #1 financial planning platform designed specifically for the
            Singaporean couple dynamic.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex gap-12 text-sm font-bold tracking-widest text-gray-400 uppercase">
          <Link href="#" className="hover:text-highlight transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-highlight transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-highlight transition-colors">
            Support
          </Link>
        </div>

        {/* Social link */}
        <div className="flex gap-4">
          <Link
            href="#"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-highlight hover:border-highlight hover:text-white transition-all text-gray-400"
          >
            <Globe className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
