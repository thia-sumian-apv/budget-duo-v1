"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Landmark,
  LayoutDashboard,
  Settings2,
  Lightbulb,
  PieChart,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  featureIcon: React.ElementType;
  featureLabel: string;
  featureName: string;
  featureDescription: string;
  tooltipIcon: React.ElementType;
  tooltipLabel: string;
  tooltipName: string;
  tooltipDescription: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Is it okay if one of us earns significantly more?",
    answer:
      "It's solved by math. Our Smart Split calculates fair contributions based on income ratios, so both partners contribute proportionally. Choose income-based splitting or set custom percentages that work for you.",
    featureIcon: Brain,
    featureLabel: "Equity Logic",
    featureName: "Smart Split Engine",
    featureDescription:
      "Automatically rebalances joint contributions as salaries fluctuate, maintaining lifestyle parity without the awkward conversations.",
    tooltipIcon: Settings2,
    tooltipLabel: "Feature Highlight",
    tooltipName: "Smart Split Engine",
    tooltipDescription:
      "Automatically rebalances joint contributions as salaries fluctuate, maintaining lifestyle parity without the awkward conversations.",
  },
  {
    question: "How do we plan around our CPF contributions?",
    answer:
      "Enter your gross income once. We calculate CPF automatically using current rates based on your age, including OW ceiling limits. See exactly what's left in your take-home pay for budgeting.",
    featureIcon: Landmark,
    featureLabel: "CPF Intelligence",
    featureName: "CPF Calculator",
    featureDescription:
      "Age-based contribution rates, OW ceiling compliance, and automatic take-home pay calculation built right in.",
    tooltipIcon: Lightbulb,
    tooltipLabel: "App Tooltip",
    tooltipName: "CPF Calculator",
    tooltipDescription:
      "Age-based contribution rates, OW ceiling compliance, and automatic take-home pay calculation built right in.",
  },
  {
    question: "How do we know who pays for what?",
    answer:
      "Every goal shows who's responsible - you, your partner, or shared. The dashboard breaks down expenses, savings, and investments for each person, so nothing falls through the cracks.",
    featureIcon: LayoutDashboard,
    featureLabel: "Clear Visibility",
    featureName: "Unified Dashboard",
    featureDescription:
      "See individual allocations, remaining balance tracking, and goal-by-goal breakdown at a glance.",
    tooltipIcon: PieChart,
    tooltipLabel: "Feature Highlight",
    tooltipName: "Unified Dashboard",
    tooltipDescription:
      "See individual allocations, remaining balance tracking, and goal-by-goal breakdown at a glance.",
  },
];

export const FAQFeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-8 relative overflow-hidden">
      {/* Pathway line background */}
      <div className="pathway-line h-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter text-navy">
            Your questions,
            <br />
            <span className="text-highlight">automated precision.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            No waiting, no meetings. Just powerful algorithms designed for the
            two of you.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="grid gap-12">
          {faqItems.map((item, index) => {
            const FeatureIcon = item.featureIcon;
            const TooltipIcon = item.tooltipIcon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.question}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 group`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Main content card */}
                <div className="w-full md:w-1/2 glass-card p-10 rounded-[2.5rem] relative overflow-hidden">
                  {/* Decorative circle */}
                  <div
                    className={`absolute ${isEven ? "top-0 right-0 -mr-10 -mt-10" : "bottom-0 left-0 -ml-10 -mb-10"} w-32 h-32 bg-highlight/5 rounded-full`}
                  />

                  {/* Feature label */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center">
                      <FeatureIcon className="h-6 w-6 text-highlight" />
                    </div>
                    <span className="font-bold text-highlight">
                      {item.featureLabel}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="text-3xl font-bold mb-4 leading-tight text-navy">
                    &ldquo;{item.question}&rdquo;
                  </h3>

                  {/* Answer */}
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {item.answer}
                  </p>
                </div>

                {/* Feature tooltip card */}
                <div className="w-full md:w-1/2">
                  <div
                    className={`ui-snippet ${isEven ? "border-l-4 border-l-highlight" : "border-r-4 border-r-highlight text-right"}`}
                  >
                    <div
                      className={`flex items-center gap-3 mb-4 ${isEven ? "" : "justify-end"}`}
                    >
                      {isEven ? (
                        <>
                          <TooltipIcon className="h-5 w-5 text-highlight" />
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                            {item.tooltipLabel}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                            {item.tooltipLabel}
                          </p>
                          <TooltipIcon className="h-5 w-5 text-highlight" />
                        </>
                      )}
                    </div>
                    <p className="font-bold text-lg mb-2 text-navy">
                      {item.tooltipName}
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      {item.tooltipDescription}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
