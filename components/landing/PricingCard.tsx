"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
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
        "relative rounded-2xl p-6 lg:p-8 flex flex-col",
        tier.highlighted
          ? "bg-navy text-white border-2 border-highlight shadow-xl scale-105"
          : "bg-white/60 border border-navy/10"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-highlight text-white">
            {tier.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center pb-6 border-b border-current/10">
        <h3
          className={cn(
            "font-heading text-lg font-semibold",
            tier.highlighted ? "text-white" : "text-navy"
          )}
        >
          {tier.name}
        </h3>
        <div className="mt-3 flex items-baseline justify-center gap-1">
          <span
            className={cn(
              "font-heading text-4xl font-bold",
              tier.highlighted ? "text-white" : "text-navy"
            )}
          >
            {tier.price}
          </span>
          {tier.period && (
            <span
              className={cn(
                "text-sm",
                tier.highlighted ? "text-white/60" : "text-navy/60"
              )}
            >
              /{tier.period}
            </span>
          )}
        </div>
        <p
          className={cn(
            "mt-2 text-sm",
            tier.highlighted ? "text-white/70" : "text-navy/60"
          )}
        >
          {tier.description}
        </p>
      </div>

      {/* Features */}
      <ul className="flex-1 py-6 space-y-3">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                tier.highlighted ? "bg-highlight" : "bg-highlight/10"
              )}
            >
              <Check
                className={cn(
                  "w-3 h-3",
                  tier.highlighted ? "text-white" : "text-highlight"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm",
                tier.highlighted ? "text-white/90" : "text-navy/70"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        asChild
        className={cn(
          "w-full rounded-full",
          tier.highlighted
            ? "bg-highlight text-white hover:bg-highlight/90"
            : "bg-navy/10 text-navy hover:bg-navy/20"
        )}
      >
        <Link href={tier.ctaHref}>{tier.cta}</Link>
      </Button>
    </motion.div>
  );
};

const defaultTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "1 shared planner",
      "Up to 10 goals",
      "Basic CPF calculations",
      "Monthly budget view",
    ],
    cta: "Get started",
    ctaHref: "/login",
  },
  {
    name: "Pro",
    price: "$4.90",
    period: "month",
    description: "For serious planners",
    features: [
      "Unlimited planners",
      "Unlimited goals",
      "Advanced CPF insights",
      "Historical tracking",
      "Export to spreadsheet",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most Popular",
    cta: "Start free trial",
    ctaHref: "/login",
  },
  {
    name: "Family",
    price: "$9.90",
    period: "month",
    description: "For extended families",
    features: [
      "Everything in Pro",
      "Up to 5 shared planners",
      "Multi-generational planning",
      "Family dashboard",
      "Dedicated support",
    ],
    cta: "Contact us",
    ctaHref: "/login",
  },
];

interface PricingSectionProps {
  tiers?: PricingTier[];
}

export const PricingSection = ({ tiers: propTiers }: PricingSectionProps) => {
  const tiers = propTiers ?? defaultTiers;
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-base/50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-2xl font-bold md:text-3xl text-navy">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-navy/70 max-w-lg mx-auto">
            Start free and upgrade as your financial planning needs grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        <motion.p
          className="text-center mt-8 text-sm text-navy/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingCard;
