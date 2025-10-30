"use client";

const SummaryPlaceholder = () => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-base font-semibold">Summary</h3>
      <p className="mt-2 text-sm text-white/70">
        Select a feature to see a quick summary here.
      </p>
      <div className="mt-4 h-24 rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/5" />
    </div>
  );
};

export default SummaryPlaceholder;
