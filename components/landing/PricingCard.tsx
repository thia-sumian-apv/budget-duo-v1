"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  periodLabel?: string;
  description: string;
  features: PricingFeature[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  ctaHref: string;
}

interface PricingCardProps {
  tier: PricingTier;
  index: number;
}

export const PricingCard = ({ tier, index }: PricingCardProps) => {
  return (
    <motion.div
      className={cn(
        "relative flex flex-col transition-transform hover:-translate-y-2",
        tier.highlighted
          ? "bg-navy p-12 rounded-[3rem] glow-border z-10 scale-105 shadow-2xl"
          : "bg-white p-10 rounded-[2.5rem] border border-gray-200",
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <span className="px-8 py-2 text-xs font-black uppercase tracking-widest rounded-full bg-highlight text-white shadow-lg">
            {tier.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <h3
        className={cn(
          "text-2xl font-bold mb-2",
          tier.highlighted ? "text-white" : "text-navy",
        )}
      >
        {tier.name}
      </h3>
      <p
        className={cn(
          "mb-8",
          tier.highlighted ? "text-gray-400" : "text-gray-500",
        )}
      >
        {tier.description}
      </p>

      {/* Price */}
      <div className="mb-8">
        <span
          className={cn(
            "font-bold",
            tier.highlighted ? "text-6xl text-white" : "text-5xl text-navy",
          )}
        >
          {tier.price}
        </span>
        {tier.period && (
          <span
            className={cn(
              "text-sm ml-2 uppercase tracking-widest",
              tier.highlighted ? "text-gray-500" : "text-gray-400",
            )}
          >
            /{tier.period}
          </span>
        )}
        {tier.periodLabel && (
          <span
            className={cn(
              "text-sm ml-2 uppercase tracking-widest",
              tier.highlighted ? "text-gray-500" : "text-gray-400",
            )}
          >
            {tier.periodLabel}
          </span>
        )}
      </div>

      {/* Features */}
      <ul
        className={cn(
          "flex-1 mb-10",
          tier.highlighted ? "space-y-5" : "space-y-4",
        )}
      >
        {tier.features.map((feature, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-3",
              tier.highlighted ? "text-sm font-bold" : "text-sm font-medium",
              feature.included
                ? tier.highlighted
                  ? "text-white"
                  : "text-navy"
                : "text-gray-400",
            )}
          >
            {feature.included ? (
              <Check
                className={cn(
                  tier.highlighted
                    ? "h-6 w-6 text-highlight"
                    : "h-5 w-5 text-highlight",
                )}
              />
            ) : (
              <X className="h-5 w-5" />
            )}
            {feature.text}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        asChild
        className={cn(
          "w-full rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
          tier.highlighted
            ? "py-5 bg-gradient-to-r from-highlight to-primary-dark text-white shadow-xl shadow-highlight/20 hover:brightness-110 scale-105"
            : "py-4 border-2 border-navy text-navy hover:bg-navy hover:text-white",
        )}
      >
        <Link href={tier.ctaHref}>{tier.cta}</Link>
      </Button>
    </motion.div>
  );
};

const defaultTiers: PricingTier[] = [
  {
    name: "The Starter Duo",
    price: "$0",
    periodLabel: "Free forever",
    description: "Basic automation for new couples.",
    features: [
      { text: "1 Shared Dashboard", included: true },
      { text: "Basic Expense Automations", included: true },
      { text: "Smart CPF Projections", included: false },
    ],
    cta: "Launch App",
    ctaHref: "/login",
  },
  {
    name: "The Goal Chasers",
    price: "$4.90",
    period: "mo",
    description: "For couples serious about property and future wealth.",
    features: [
      { text: "Unlimited Shared Goals", included: true },
      { text: "Advanced CPF & HDB Simulators", included: true },
      { text: "Income Gap Optimization", included: true },
      { text: "Advanced Analytical Tools", included: true },
    ],
    highlighted: true,
    badge: "Most Popular",
    cta: "Start 14-Day Free Trial",
    ctaHref: "/login",
  },
  {
    name: "The Family Legacy",
    price: "$9.90",
    period: "mo",
    description: "Complex assets and multi-gen planning.",
    features: [
      { text: "Multi-gen Accounts", included: true },
      { text: "Estate Planning Algorithms", included: true },
      { text: "Premium Tracking", included: true },
    ],
    cta: "Get Full Suite",
    ctaHref: "/login",
  },
];

interface PricingSectionProps {
  tiers?: PricingTier[];
}

export const PricingSection = ({ tiers: propTiers }: PricingSectionProps) => {
  const tiers = propTiers ?? defaultTiers;
  return (
    <section id="pricing" className="py-32 px-8 relative">
      {/* Background organic shape */}
      <div className="organic-shape w-[800px] h-[800px] bg-highlight/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter text-navy">
            Choose your <span className="text-highlight">toolkit level</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Powerful software tools for every stage of your relationship
            journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCard;
