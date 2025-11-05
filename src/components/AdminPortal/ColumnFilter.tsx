"use client";

import React, { useState, useRef, useEffect } from "react";

interface FilterOption {
  id: string | number;
  label: string;
  value: string | number;
}

interface ColumnFilterProps {
  options: FilterOption[];
  selectedValues: (string | number)[];
  onFilterChange: (selectedValues: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
  // Optional search mode: show an input and only display options when user types
  searchable?: boolean;
  searchPlaceholder?: string;
  searchMinChars?: number;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  options,
  selectedValues,
  onFilterChange,
  placeholder = "Filter",
  className = "",
  searchable = false,
  searchPlaceholder = "Search...",
  searchMinChars = 2,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionToggle = (value: string | number) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onFilterChange(newSelectedValues);
  };

  const handleClearAll = () => {
    onFilterChange([]);
  };

  const selectedCount = selectedValues.length;

  return (
    <div className={`relative ${className}`} ref={filterRef}>
      {/* Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded border border-[#333333] bg-[#333333] hover:bg-[#1D1D1D] transition-colors"
        title={
          selectedCount > 0 ? `${selectedCount} filter(s) applied` : placeholder
        }
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={selectedCount > 0 ? "text-[#00DBDC]" : "text-[#BFBFBF]"}
        >
          <path
            d="M1 3H11M3 6H9M5 9H7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {selectedCount > 0 && (
          <span className="text-[#00DBDC] text-xs font-medium">
            {selectedCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#1D1D1D] border border-[#333333] rounded-lg shadow-lg z-50 min-w-[220px] max-h-[320px] overflow-hidden">
          {/* Header / Search */}
          <div className="px-3 py-2 border-b border-[#333333] flex items-center justify-between">
            {searchable ? (
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-[#0D0D0D] border border-[#333333] rounded px-2 py-1 text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#00DBDC]"
                autoFocus
              />
            ) : (
              <span className="text-xs font-normal text-white">
                {placeholder}
              </span>
            )}
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="ml-2 text-[11px] text-[#00DBDC] hover:text-[#00DBDC]/80"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Options */}
          <div className="max-h-[260px] overflow-y-auto py-1">
            {(() => {
              const trimmed = query.trim();
              const shouldFilter =
                searchable && trimmed.length >= searchMinChars;
              const displayOptions = shouldFilter
                ? options.filter((o) =>
                    o.label.toLowerCase().includes(trimmed.toLowerCase())
                  )
                : searchable
                ? []
                : options;

              if (searchable && trimmed.length < searchMinChars) {
                return (
                  <div className="px-3 py-2 text-[11px] text-[#BFBFBF]">
                    Type at least {searchMinChars} characters to search
                  </div>
                );
              }

              if (displayOptions.length === 0) {
                return (
                  <div className="px-3 py-2 text-[11px] text-[#BFBFBF]">
                    No options found
                  </div>
                );
              }

              return displayOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#333333] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionToggle(option.value)}
                      className="w-4 h-4 rounded border border-[#333333] bg-[#1D1D1D] text-[#00DBDC] focus:ring-[#00DBDC] focus:ring-1"
                    />
                    <span className="text-xs font-normal text-white">
                      {option.label}
                    </span>
                  </label>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnFilter;
