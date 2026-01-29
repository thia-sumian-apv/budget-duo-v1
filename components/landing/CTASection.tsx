"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-32 px-8">
      <div className="max-w-4xl mx-auto glass-card p-16 rounded-[4rem] text-center relative overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-highlight via-navy to-highlight" />

        <div className="relative z-10">
          {/* Planning image */}
          <div className="flex justify-center mb-10">
            <div className="relative w-72 h-48 rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <Image
                src="/images/landing/hero-planning.png"
                alt="Couple planning together"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-[0.9] tracking-tighter text-navy">
            Ready to master your
            <br />
            finances together?
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto">
            Join the thousands of Singaporean couples who use Budget Duo to
            automate their financial harmony.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              asChild
              className="bg-highlight hover:bg-primary-dark text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl shadow-highlight/40 transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Link href="/login">Start Your Free Trial</Link>
            </Button>
            <Link
              href="#features"
              className="text-navy font-bold hover:text-highlight transition-colors flex items-center gap-2 group"
            >
              See features
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
