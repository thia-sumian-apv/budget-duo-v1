"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthYearPickerProps {
  value: string | null; // YYYY-MM format
  onChange: (value: string | null) => void;
  placeholder?: string;
  minDate?: string; // YYYY-MM format
  maxDate?: string; // YYYY-MM format
  className?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MonthYearPicker = ({
  value,
  onChange,
  placeholder = "Select month",
  minDate,
  maxDate,
  className = "",
}: MonthYearPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      return parseInt(value.split("-")[0]);
    }
    return new Date().getFullYear();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const parseYearMonth = (str: string | undefined): { year: number; month: number } | null => {
    if (!str) return null;
    const [year, month] = str.split("-").map(Number);
    return { year, month };
  };

  const isMonthDisabled = (year: number, month: number): boolean => {
    const min = parseYearMonth(minDate ?? undefined);
    const max = parseYearMonth(maxDate ?? undefined);

    if (min && (year < min.year || (year === min.year && month < min.month))) {
      return true;
    }
    if (max && (year > max.year || (year === max.year && month > max.month))) {
      return true;
    }
    return false;
  };

  const handleMonthClick = (month: number) => {
    if (isMonthDisabled(viewYear, month)) return;
    onChange(`${viewYear}-${String(month).padStart(2, "0")}`);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const displayValue = value
    ? `${MONTHS[parseInt(value.split("-")[1]) - 1]} ${value.split("-")[0]}`
    : null;

  const selectedMonth = value ? parseInt(value.split("-")[1]) : null;
  const selectedYear = value ? parseInt(value.split("-")[0]) : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="w-full flex items-center justify-between rounded-lg border border-navy/10 bg-white/70 px-3 py-2 text-sm">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 text-left focus:outline-none"
        >
          <span className={displayValue ? "text-navy" : "text-navy/50"}>
            {displayValue || placeholder}
          </span>
        </button>
        <div className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-navy/40 hover:text-navy/70 p-0.5"
            >
              ×
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-navy/40 hover:text-navy/60"
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-64 rounded-lg border border-navy/10 bg-white p-3 shadow-xl">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="p-1 hover:bg-navy/10 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="p-1 hover:bg-navy/10 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((monthName, index) => {
              const month = index + 1;
              const isSelected = selectedYear === viewYear && selectedMonth === month;
              const isDisabled = isMonthDisabled(viewYear, month);

              return (
                <button
                  key={monthName}
                  type="button"
                  onClick={() => handleMonthClick(month)}
                  disabled={isDisabled}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition ${
                    isSelected
                      ? "bg-highlight text-white"
                      : isDisabled
                      ? "text-navy/20 cursor-not-allowed"
                      : "text-navy/70 hover:bg-navy/10"
                  }`}
                >
                  {monthName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
