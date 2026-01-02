"use client";

import { CalendarRange, Calculator, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: "Flexible Planning",
    description:
      "Set monthly expenses or time-bound savings goals. Split contributions by income ratio or choose custom percentages.",
    icon: CalendarRange,
  },
  {
    title: "CPF-Smart Calculations",
    description:
      "Age-based CPF rates and OW ceiling built-in. See how much can come from CPF OA vs cash.",
    icon: Calculator,
  },
  {
    title: "Unified Dashboard",
    description:
      "See each person's allocations and what's left. A clear household view of expenses, savings, and investments.",
    icon: LayoutDashboard,
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative border-t border-navy/5">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Planning that feels effortless
          </h2>
          <p className="mt-3 text-navy/70">
            Built around how couples actually manage money in Singapore.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl border border-navy/10 bg-white/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Icon
                  className="h-8 w-8 text-highlight mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="font-heading font-semibold text-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-navy/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
