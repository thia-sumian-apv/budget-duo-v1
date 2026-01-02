"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16 md:pt-36 md:pb-20 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/60 px-3 py-1 text-xs text-navy/70">
            <Heart className="h-3.5 w-3.5 text-highlight" />
            <span>Built for couples in Singapore</span>
          </div>
          <h1
            className="mt-6 font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.1 }}
          >
            Plan your finances{" "}
            <span className="text-highlight">together</span>, simply.
          </h1>
          <p className="mt-5 mx-auto max-w-xl text-base leading-relaxed text-navy/70 md:text-lg">
            Budget Duo helps couples create CPF-aware budgets and shared goals.
            See what each person contributes and what&apos;s left each month.
          </p>
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <Button
              asChild
              className="rounded-full bg-highlight text-white hover:bg-highlight/90 px-6"
            >
              <Link href="/login">Start planning</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="group rounded-full text-navy hover:bg-navy/5"
            >
              <Link href="#features">
                See how it works
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
