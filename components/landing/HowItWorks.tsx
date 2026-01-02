"use client";

import { motion } from "framer-motion";
import {
  LucideIcon,
  UserPlus,
  Settings,
  Target,
  BarChart3,
} from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Create a planner",
    description: "Sign up and create your first shared planner in seconds.",
    icon: UserPlus,
  },
  {
    number: 2,
    title: "Add your income",
    description:
      "Enter your gross income. We'll calculate CPF and take-home pay.",
    icon: Settings,
  },
  {
    number: 3,
    title: "Set your goals",
    description:
      "Add expenses, savings goals, and investments. Choose who pays.",
    icon: Target,
  },
  {
    number: 4,
    title: "Track together",
    description: "See how your budget looks and adjust as needed.",
    icon: BarChart3,
  },
];

interface HowItWorksProps {
  steps?: Step[];
}

export const HowItWorksStep = ({
  step,
  index,
  isLast,
}: {
  step: Step;
  index: number;
  isLast: boolean;
}) => {
  const Icon = step.icon;

  return (
    <motion.div
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.15 }}
    >
      {/* Connection line to next step */}
      {!isLast && (
        <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-highlight/30 to-transparent" />
      )}

      {/* Step circle */}
      <motion.div
        className="relative z-10 w-24 h-24 rounded-full bg-white/40 border-2 border-navy/10 flex items-center justify-center"
        whileHover={{ scale: 1.05, borderColor: "rgb(237, 152, 95)" }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-10 h-10 text-highlight" strokeWidth={1.5} />
        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-highlight text-white text-sm font-bold flex items-center justify-center">
          {step.number}
        </span>
      </motion.div>

      {/* Content */}
      <h4 className="mt-5 font-heading text-lg font-semibold text-navy">
        {step.title}
      </h4>
      <p className="mt-2 text-sm text-navy/60 max-w-xs leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  );
};

export const HowItWorks = ({ steps: propSteps }: HowItWorksProps) => {
  const steps = propSteps ?? defaultSteps;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-2xl font-bold md:text-3xl text-navy">
            How it works
          </h2>
          <p className="mt-3 text-navy/70 max-w-lg mx-auto">
            Get started in minutes. No complicated setup required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <HowItWorksStep
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
