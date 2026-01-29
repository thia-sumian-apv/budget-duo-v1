"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <header className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background organic shapes */}
      <div className="organic-shape w-[600px] h-[600px] bg-highlight/10 -top-20 -left-20" />
      <div className="organic-shape w-[400px] h-[400px] bg-blue-400/10 bottom-0 right-0" />

      <div className="mx-auto max-w-7xl px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div
            className="lg:col-span-7 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-bold text-navy mb-8 leading-[0.9] tracking-tighter">
              Take control of your{" "}
              <span className="text-highlight italic">dreams</span> as a couple
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-xl leading-relaxed">
              Redefining how Singaporean couples build wealth. Use our
              intelligent tools to automate your goals and gain financial
              harmony.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/login"
                className="group p-6 glass-card rounded-2xl text-left border-l-4 border-l-highlight transition-all hover:translate-x-2"
              >
                <BarChart3 className="h-10 w-10 text-highlight mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-xl mb-1 text-navy">
                  Smart Budget Planner
                </h4>
                <p className="text-sm text-gray-500">
                  Automated CPF &amp; income-based calculations.
                </p>
              </Link>
              <Link
                href="/login"
                className="group p-6 glass-card rounded-2xl text-left border-l-4 border-l-transparent hover:border-l-highlight transition-all hover:translate-x-2"
              >
                <TrendingUp className="h-10 w-10 text-highlight mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-xl mb-1 text-navy">
                  Goal Tracker
                </h4>
                <p className="text-sm text-gray-500">
                  Track expenses, savings, and investments together.
                </p>
              </Link>
            </div>
          </motion.div>

          {/* Right column - Image */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white">
              {/* Hero image */}
              <div className="relative w-full h-[600px]">
                <Image
                  src="/images/landing/hero-couple.png"
                  alt="Couple planning finances together"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-highlight/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
