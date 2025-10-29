"use client";

import Link from "next/link";
import {
  ArrowRight,
  Rocket,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Modern, dark marketing scaffold tailored to Budget Duo
// Uses Tailwind only (no external layout libs) so it's lightweight and easy to evolve

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm font-semibold tracking-tight">
              Budget Duo
            </Link>
            <div className="hidden gap-5 text-sm text-white/70 md:flex">
              <Link href="#learn-more" className="hover:text-white">
                Features
              </Link>
              <Link href="#" className="hover:text-white">
                How it works
              </Link>
              <Link href="#" className="hover:text-white">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="h-8 px-3 text-sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="h-8 rounded-full bg-[#00ED64] px-3 text-sm text-[#001E2B] hover:bg-[#06c777]"
            >
              <Link href="/login">Try for free</Link>
            </Button>
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(0,237,100,0.15)_0%,rgba(0,0,0,0.0)_60%)]" />
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-16 md:pt-36 md:pb-24 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Heart className="h-3.5 w-3.5 text-[#00ED64]" />
              <span>Built for couples</span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Plan your finances together, simply.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              Budget Duo helps couples plan CPF‑aware budgets and goals. See
              per‑person allocations, CPF coverage vs take‑home excess, and
              what’s left each month.
            </p>
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            >
              <Button
                asChild
                className="rounded-full bg-[#00ED64] text-[#001E2B] hover:bg-[#06c777]"
              >
                <Link href="/login">Start planning</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="group rounded-full text-white"
              >
                <Link href="#learn-more">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logos (placeholder) */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
          <p className="mb-6 text-center text-xs uppercase tracking-wider text-white/50">
            Designed for couples who want clarity
          </p>
          <div className="grid grid-cols-2 items-center gap-6 opacity-60 sm:grid-cols-3 md:grid-cols-6">
            <div className="h-6 rounded bg-white/[0.06]" />
            <div className="h-6 rounded bg-white/[0.06]" />
            <div className="h-6 rounded bg-white/[0.06]" />
            <div className="h-6 rounded bg-white/[0.06]" />
            <div className="h-6 rounded bg-white/[0.06]" />
            <div className="h-6 rounded bg-white/[0.06]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="learn-more" className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_10%_50%,rgba(0,237,100,0.08)_0%,rgba(0,0,0,0.0)_60%)]" />
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              CPF‑aware planning that feels effortless.
            </h2>
            <p className="mt-3 text-white/70">
              Focus on what matters: your goals, your salaries, and how CPF
              affects real take‑home.
            </p>
          </div>
          <motion.div
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <Feature
              icon={<Rocket className="h-5 w-5" />}
              title="Plan goals your way"
              desc="Set monthly expenses or time‑bound goals; we compute monthly contributions."
            />
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Smart splits"
              desc="Split by take‑home income automatically or choose custom percentages."
            />
            <Feature
              icon={<Layers className="h-5 w-5" />}
              title="CPF‑aware by design"
              desc="Age‑based CPF rates and OW ceiling built‑in; compare OA coverage vs excess."
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Per‑person clarity"
              desc="See each person’s CPF‑eligible excess and total take‑home allocations."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="Track accounts over time"
              desc="Bank, CPF, and investments with monthly balances and trend charts."
            />
            <Feature
              icon={<ArrowRight className="h-5 w-5" />}
              title="A shared picture"
              desc="Combine figures across both people for a clear household view."
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_30%,rgba(0,237,100,0.12)_0%,rgba(0,0,0,0.0)_60%)]" />
        <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">
                  Ready to plan smarter?
                </h3>
                <p className="mt-2 text-white/70">It’s free to get started.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  asChild
                  className="rounded-full bg-[#00ED64] text-[#001E2B] hover:bg-[#06c777]"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full">
                  <Link href="#learn-more">Explore features</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>© {new Date().getFullYear()} Budget Duo</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white">
                Terms
              </Link>
              <Link href="#" className="hover:text-white">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <motion.div
    className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
    transition={{ duration: 0.45, ease: "easeOut" }}
  >
    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-[#00ED64]">
      {icon}
    </div>
    <h3 className="text-base font-medium">{title}</h3>
    <p className="mt-1 text-sm text-white/70">{desc}</p>
  </motion.div>
);

export default LandingPage;
