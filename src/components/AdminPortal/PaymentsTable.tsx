"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Pagination from "../common/Pagination";
import { formatDateTimeForDisplay } from "@/utils/dateFilters";

interface PaymentsTableProps {
  title: string;
}

interface Payment {
  id: number;
  user_name: string;
  razorpay_order_id: string;
  amount: number;
  status: string;
  created_at: string;
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid: "#00FF00",
  created: "#00DBDC",
  attempted: "#FFA500",
  failed: "#FF0000",
};

const PaymentsTable: React.FC<PaymentsTableProps> = ({ title }) => {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/payments?${params.toString()}`);
      const result = await response.json();

      if (result.status) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalItems(result.pagination.total);
      } else {
        setError(result.error || "Failed to fetch payments");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch payments";
      setError(errorMessage);
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, statusFilter]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".status-dropdown")) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    return PAYMENT_STATUS_COLORS[status] || "#808080";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between py-4 px-10 border border-[#333333] rounded-t-2xl">
        <h2 className="text-white text-2xl font-medium">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search User Name, Order ID"
              className="bg-[#0D0D0D] border border-[#333333] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#00DBDC] transition-colors duration-200"
              style={{ width: "300px", height: "40px" }}
            />
            <Image
              src="/images/careers/career-search.svg"
              alt="Search"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
          </div>

          {/* Status Filter */}
          <div className="relative status-dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#0D0D0D] border border-[#333333] rounded-lg px-4 py-2 text-[#BFBFBF] flex items-center gap-2 hover:bg-[#333333] transition-colors duration-200 h-[40px]"
            >
              <span className="text-sm">
                {statusFilter === "all"
                  ? "All Status"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                className={`transform transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1D1D1D] border border-[#333333] rounded-lg shadow-lg z-50 py-1">
                {["all", "created", "attempted", "paid", "failed"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-[#BFBFBF] hover:bg-[#333333] hover:text-white transition-colors"
                    >
                      {status === "all"
                        ? "All Status"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="border border-[#333333] border-t-0 rounded-b-2xl"
        style={{ width: "1100px", overflow: "visible" }}
      >
        {loading && (
          <div className="flex items-center justify-center py-20 bg-[#1D1D1D]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00DBDC]"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mx-10 my-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="py-20 text-center text-[#8A8A8A] bg-[#1D1D1D]">
            No data found
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div style={{ overflow: "visible" }}>
            <table
              style={{
                width: "1100px",
                borderCollapse: "separate",
                borderSpacing: 0,
                tableLayout: "auto",
                overflow: "visible",
              }}
            >
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr style={{ background: "#1D1D1D" }}>
                  <th style={headerCellStyle}>User Name</th>
                  <th style={headerCellStyle}>Order ID</th>
                  <th style={headerCellStyle}>Amount</th>
                  <th style={headerCellStyle}>Status</th>
                  <th style={headerCellStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} style={{ background: "#1D1D1D" }}>
                    <td style={cellStyle}>{item.user_name || "Unknown"}</td>
                    <td style={cellStyle}>{item.razorpay_order_id}</td>
                    <td style={cellStyle}>
                      {formatCurrency(Number(item.amount))}
                    </td>
                    <td style={cellStyle}>
                      <span style={{ color: getStatusColor(item.status) }}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      {formatDateTimeForDisplay(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div
          className="bg-[#333333] px-6 py-4 border-t border-[#333333]"
          style={{
            width: "100%",
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

const headerCellStyle: React.CSSProperties = {
  paddingTop: "16px",
  paddingBottom: "16px",
  paddingLeft: "24px",
  paddingRight: "24px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 500,
  color: "#BFBFBF",
  borderBottom: "1px solid #333333",
};

const cellStyle: React.CSSProperties = {
  paddingTop: "16px",
  paddingBottom: "16px",
  paddingLeft: "24px",
  paddingRight: "24px",
  fontSize: "14px",
  color: "#FFFFFF",
  borderBottom: "1px solid #333333",
  overflow: "visible",
};

export default PaymentsTable;
