"use client";

const SummaryPlaceholder = () => {
  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-5">
      <h3 className="text-base font-heading font-semibold text-navy">Summary</h3>
      <p className="mt-2 text-sm text-navy/70">
        Select a feature to see a quick summary here.
      </p>
      <div className="mt-4 h-24 rounded-lg border border-highlight/20 bg-highlight/5" />
    </div>
  );
};

export default SummaryPlaceholder;
