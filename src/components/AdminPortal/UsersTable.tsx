"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Pagination from "../common/Pagination";
import { formatDateTimeForDisplay } from "@/utils/dateFilters";

interface UsersTableProps {
  title: string;
}

interface User {
  id: number;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  created_at: string;
}

const UsersTable: React.FC<UsersTableProps> = ({ title }) => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const result = await response.json();

      if (result.status) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalItems(result.pagination.total);
      } else {
        setError(result.error || "Failed to fetch users");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/admin/users/export?${queryString}`
      : "/api/admin/users/export";

    window.open(url, "_blank");
  };

  return (
    <div className="mb-6" style={{ width: "1100px" }}>
      <div className="flex items-center justify-between py-4 px-10 border border-[#333333] rounded-t-2xl">
        <h2 className="text-white text-2xl font-medium">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name, Phone, Email"
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

          <button
            onClick={handleExport}
            className="bg-[#0D0D0D] border border-[#333333] rounded-lg flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors duration-200 px-4"
            style={{ height: "40px" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                stroke="#BFBFBF"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.6665 6.66675L7.99984 10.0001L11.3332 6.66675"
                stroke="#BFBFBF"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10V2"
                stroke="#BFBFBF"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#BFBFBF] text-sm font-normal">
              Download CSV
            </span>
          </button>
        </div>
      </div>

      <div
        className="border border-[#333333] border-t-0 rounded-b-2xl"
        style={{ width: "100%", overflow: "visible" }}
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
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                tableLayout: "auto",
                overflow: "visible",
              }}
            >
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr style={{ background: "#333333" }}>
                  <th style={headerCellStyle}>Name</th>
                  <th style={headerCellStyle}>Phone</th>
                  <th style={headerCellStyle}>Email</th>
                  <th style={headerCellStyle}>DOB</th>
                  <th style={headerCellStyle}>Gender</th>
                  <th style={headerCellStyle}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} style={{ background: "#1D1D1D" }}>
                    <td style={cellStyle}>
                      {`${item.first_name || ""} ${
                        item.last_name || ""
                      }`.trim() || "-"}
                    </td>
                    <td style={cellStyle}>{item.phone || "-"}</td>
                    <td style={cellStyle}>{item.email || "-"}</td>
                    <td style={cellStyle}>{item.date_of_birth || "-"}</td>
                    <td style={cellStyle}>{item.gender || "-"}</td>
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
          className="bg-[#333333] px-6 py-4 border-t border-[#333333] rounded-b-2xl"
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

export default UsersTable;
