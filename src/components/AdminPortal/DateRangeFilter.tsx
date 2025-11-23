"use client";

import React, { useState, useRef } from "react";
import { formatDateForAPI } from "@/utils/dateFilters";

interface DateRangeFilterProps {
  onApply: (startDate: string, endDate: string) => void;
  onClear: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onApply,
  onClear,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    onClear();
    setIsOpen(false);
  };

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setStartDate(formatDateForAPI(start));
    setEndDate(formatDateForAPI(end));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0D0D0D] border border-[#333333] rounded-lg flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors duration-200 px-4 h-[40px]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z"
            stroke="#BFBFBF"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6667 1.33325V3.99992"
            stroke="#BFBFBF"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.33333 1.33325V3.99992"
            stroke="#BFBFBF"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 6.66675H14"
            stroke="#BFBFBF"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[#BFBFBF] text-sm font-normal">Date Range</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1D1D1D] border border-[#333333] rounded-lg shadow-lg z-50 p-4">
          <div className="mb-4">
            <h3 className="text-white text-sm font-medium mb-3">
              Select Date Range
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[#BFBFBF] text-xs mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    ref={startDateInputRef}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-[#0D0D0D] border border-[#333333] rounded text-white text-sm focus:outline-none focus:border-[#00DBDC]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      startDateInputRef.current?.showPicker?.() ||
                      startDateInputRef.current?.click()
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#BFBFBF] hover:text-white transition-colors cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.6667 1.33325V3.99992"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.33333 1.33325V3.99992"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 6.66675H14"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#BFBFBF] text-xs mb-1">
                  End Date
                </label>
                <div className="relative">
                  <input
                    ref={endDateInputRef}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-[#0D0D0D] border border-[#333333] rounded text-white text-sm focus:outline-none focus:border-[#00DBDC]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      endDateInputRef.current?.showPicker?.() ||
                      endDateInputRef.current?.click()
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#BFBFBF] hover:text-white transition-colors cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.6667 1.33325V3.99992"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.33333 1.33325V3.99992"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 6.66675H14"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[#BFBFBF] text-xs mb-2">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePreset(7)}
                className="px-3 py-1 bg-[#0D0D0D] border border-[#333333] rounded text-[#BFBFBF] text-xs hover:bg-[#333333] transition-colors"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => handlePreset(30)}
                className="px-3 py-1 bg-[#0D0D0D] border border-[#333333] rounded text-[#BFBFBF] text-xs hover:bg-[#333333] transition-colors"
              >
                Last 30 Days
              </button>
              <button
                onClick={() => handlePreset(90)}
                className="px-3 py-1 bg-[#0D0D0D] border border-[#333333] rounded text-[#BFBFBF] text-xs hover:bg-[#333333] transition-colors"
              >
                Last 90 Days
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 bg-[#0D0D0D] border border-[#333333] rounded text-[#BFBFBF] text-sm hover:bg-[#333333] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className="flex-1 px-4 py-2 bg-[#00DBDC] text-[#0D0D0D] rounded text-sm font-medium hover:bg-[#00C5C8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
