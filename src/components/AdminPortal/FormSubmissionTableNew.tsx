"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Pagination from "../common/Pagination";
import DateRangeFilter from "./DateRangeFilter";
import { formSubmissionAPI } from "@/lib/formSubmissionApi";
import {
  ContactUsRecord,
  FranchiseInquiryRecord,
  LeadGenerationRecord,
} from "@/types/formSubmissions";
import {
  CONTACT_STATUS,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS,
  FRANCHISE_STATUS,
  FRANCHISE_STATUS_LABELS,
  FRANCHISE_STATUS_COLORS,
  LEAD_STATUS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
} from "@/constants/formSubmissionStatus";
import { formatDateTimeForDisplay } from "@/utils/dateFilters";

type SectionType =
  | "general-queries"
  | "franchise-applications"
  | "lead-submissions";

interface FormSubmissionTableProps {
  sectionType: SectionType;
  title: string;
  showHeader?: boolean;
}

type DataRecord =
  | ContactUsRecord
  | FranchiseInquiryRecord
  | LeadGenerationRecord;

const FormSubmissionTable: React.FC<FormSubmissionTableProps> = ({
  sectionType,
  title,
  showHeader = true,
}) => {
  const [data, setData] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        search: searchQuery,
        status: statusFilter || undefined,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
      };

      let response;
      if (sectionType === "general-queries") {
        response = await formSubmissionAPI.getContactUsRecords(
          currentPage,
          itemsPerPage,
          filters
        );
      } else if (sectionType === "franchise-applications") {
        response = await formSubmissionAPI.getFranchiseInquiries(
          currentPage,
          itemsPerPage,
          filters
        );
      } else if (sectionType === "lead-submissions") {
        response = await formSubmissionAPI.getLeadGeneration(
          currentPage,
          itemsPerPage,
          filters
        );
      }

      if (response) {
        setData(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    sectionType,
    currentPage,
    itemsPerPage,
    searchQuery,
    statusFilter,
    dateRange,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id: number, newStatus: number) => {
    try {
      if (sectionType === "general-queries") {
        await formSubmissionAPI.updateContactUsStatus(id, newStatus);
      } else if (sectionType === "franchise-applications") {
        await formSubmissionAPI.updateFranchiseInquiryStatus(id, newStatus);
      } else {
        await formSubmissionAPI.updateLeadGenerationStatus(id, newStatus);
      }
      await fetchData();
      setDropdownOpen(null);
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this record? This action will mark it as deleted."
      )
    ) {
      return;
    }

    try {
      if (sectionType === "general-queries") {
        await formSubmissionAPI.deleteContactUs(id);
      } else if (sectionType === "franchise-applications") {
        await formSubmissionAPI.deleteFranchiseInquiry(id);
      } else {
        await formSubmissionAPI.deleteLeadGeneration(id);
      }
      await fetchData();
      setDropdownOpen(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete record");
    }
  };

  const handleExport = () => {
    const filters = {
      search: searchQuery,
      status: statusFilter || undefined,
      startDate: dateRange?.start,
      endDate: dateRange?.end,
    };

    if (sectionType === "general-queries") {
      formSubmissionAPI.exportContactUs(filters);
    } else if (sectionType === "franchise-applications") {
      formSubmissionAPI.exportFranchiseInquiries(filters);
    } else {
      formSubmissionAPI.exportLeadGeneration(filters);
    }
  };

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusOptions = () => {
    if (sectionType === "general-queries") {
      return Object.entries(CONTACT_STATUS)
        .filter(([_key]) => _key !== "DELETED")
        .map(([_key, value]) => ({
          value,
          label:
            CONTACT_STATUS_LABELS[value as keyof typeof CONTACT_STATUS_LABELS],
        }));
    } else if (sectionType === "franchise-applications") {
      return Object.entries(FRANCHISE_STATUS)
        .filter(([_key]) => _key !== "DELETED")
        .map(([_key, value]) => ({
          value,
          label:
            FRANCHISE_STATUS_LABELS[
              value as keyof typeof FRANCHISE_STATUS_LABELS
            ],
        }));
    } else {
      return Object.entries(LEAD_STATUS)
        .filter(([_key]) => _key !== "DELETED")
        .map(([_key, value]) => ({
          value,
          label: LEAD_STATUS_LABELS[value as keyof typeof LEAD_STATUS_LABELS],
        }));
    }
  };

  const getStatusLabel = (status: number) => {
    if (sectionType === "general-queries") {
      return (
        CONTACT_STATUS_LABELS[status as keyof typeof CONTACT_STATUS_LABELS] ||
        "Unknown"
      );
    } else if (sectionType === "franchise-applications") {
      return (
        FRANCHISE_STATUS_LABELS[
          status as keyof typeof FRANCHISE_STATUS_LABELS
        ] || "Unknown"
      );
    } else {
      return (
        LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] ||
        "Unknown"
      );
    }
  };

  const getStatusColor = (status: number) => {
    if (sectionType === "general-queries") {
      return (
        CONTACT_STATUS_COLORS[status as keyof typeof CONTACT_STATUS_COLORS] ||
        "#808080"
      );
    } else if (sectionType === "franchise-applications") {
      return (
        FRANCHISE_STATUS_COLORS[
          status as keyof typeof FRANCHISE_STATUS_COLORS
        ] || "#808080"
      );
    } else {
      return (
        LEAD_STATUS_COLORS[status as keyof typeof LEAD_STATUS_COLORS] ||
        "#808080"
      );
    }
  };

  const renderTable = () => {
    if (sectionType === "general-queries") {
      return renderGeneralQueriesTable();
    } else if (sectionType === "franchise-applications") {
      return renderFranchiseApplicationsTable();
    } else {
      return renderLeadSubmissionsTable();
    }
  };

  const renderGeneralQueriesTable = () => {
    return (
      <table
        style={{
          width: "1100px",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr style={{ background: "#1D1D1D" }}>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>Email Address</th>
            <th style={headerCellStyle}>Phone Number</th>
            <th style={headerCellStyle}>Message</th>
            <th style={headerCellStyle}>Date</th>
            <th style={headerCellStyle}>Status</th>
            <th style={{ ...headerCellStyle, textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index) => (
            <tr key={item.id} style={{ background: "#1D1D1D" }}>
              <td style={cellStyle}>
                {item.first_name} {item.last_name}
              </td>
              <td style={cellStyle}>{item.email}</td>
              <td style={cellStyle}>{item.phone || "-"}</td>
              <td
                style={{
                  ...cellStyle,
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.message}
              </td>
              <td style={cellStyle}>
                {formatDateTimeForDisplay(item.created_at)}
              </td>
              <td style={cellStyle}>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    style={{
                      ...statusButtonStyle,
                      borderColor: getStatusColor(item.status),
                    }}
                  >
                    <span style={{ color: getStatusColor(item.status) }}>
                      {getStatusLabel(item.status)}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1L6 6L11 1"
                        stroke={getStatusColor(item.status)}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {dropdownOpen === index && (
                    <div style={dropdownStyle}>
                      {getStatusOptions().map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleStatusChange(item.id, option.value)
                          }
                          style={dropdownItemStyle}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td style={{ ...cellStyle, textAlign: "center" }}>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={deleteButtonStyle}
                >
                  <Image
                    src="/images/careers/delete.svg"
                    alt="Delete"
                    width={16}
                    height={16}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderFranchiseApplicationsTable = () => {
    return (
      <table
        style={{
          width: "1100px",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr style={{ background: "#1D1D1D" }}>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>Email Address</th>
            <th style={headerCellStyle}>Phone Number</th>
            <th style={headerCellStyle}>City</th>
            <th style={headerCellStyle}>Investment</th>
            <th style={headerCellStyle}>Date</th>
            <th style={headerCellStyle}>Status</th>
            <th style={{ ...headerCellStyle, textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index) => (
            <tr key={item.id} style={{ background: "#1D1D1D" }}>
              <td style={cellStyle}>
                {item.contact_person || item.business_name}
              </td>
              <td style={cellStyle}>{item.email}</td>
              <td style={cellStyle}>{item.phone || "-"}</td>
              <td style={cellStyle}>{item.city || "-"}</td>
              <td style={cellStyle}>₹{item.investment_capacity || "0"}</td>
              <td style={cellStyle}>
                {formatDateTimeForDisplay(item.created_at)}
              </td>
              <td style={cellStyle}>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    style={{
                      ...statusButtonStyle,
                      borderColor: getStatusColor(item.status),
                    }}
                  >
                    <span style={{ color: getStatusColor(item.status) }}>
                      {getStatusLabel(item.status)}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1L6 6L11 1"
                        stroke={getStatusColor(item.status)}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {dropdownOpen === index && (
                    <div style={dropdownStyle}>
                      {getStatusOptions().map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleStatusChange(item.id, option.value)
                          }
                          style={dropdownItemStyle}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td style={{ ...cellStyle, textAlign: "center" }}>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={deleteButtonStyle}
                >
                  <Image
                    src="/images/careers/delete.svg"
                    alt="Delete"
                    width={16}
                    height={16}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderLeadSubmissionsTable = () => {
    return (
      <table
        style={{
          width: "1100px",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr style={{ background: "#1D1D1D" }}>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>Phone Number</th>
            <th style={headerCellStyle}>Interested In</th>
            <th style={headerCellStyle}>Message</th>
            <th style={headerCellStyle}>Location</th>
            <th style={headerCellStyle}>Date</th>
            <th style={headerCellStyle}>Status</th>
            <th style={{ ...headerCellStyle, textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index) => {
            const interests = [];
            if (item.fitness) interests.push("Fitness");
            if (item.cricket) interests.push("Cricket");
            if (item.recovery) interests.push("Recovery");
            if (item.running) interests.push("Running");
            if (item.pilates) interests.push("Pilates");
            if (item.personal_training) interests.push("Personal Training");
            if (item.physiotherapy) interests.push("Physiotherapy");
            if (item.group_classes) interests.push("Group Classes");

            return (
              <tr key={item.id} style={{ background: "#1D1D1D" }}>
                <td style={cellStyle}>{item.name}</td>
                <td style={cellStyle}>{item.phone}</td>
                <td style={cellStyle}>{interests.join(", ") || "-"}</td>
                <td
                  style={{
                    ...cellStyle,
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.message || "-"}
                </td>
                <td style={cellStyle}>{item.preferred_location || "-"}</td>
                <td style={cellStyle}>
                  {formatDateTimeForDisplay(item.created_at)}
                </td>
                <td style={cellStyle}>
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      style={{
                        ...statusButtonStyle,
                        borderColor: getStatusColor(item.status),
                      }}
                    >
                      <span style={{ color: getStatusColor(item.status) }}>
                        {getStatusLabel(item.status)}
                      </span>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path
                          d="M1 1L6 6L11 1"
                          stroke={getStatusColor(item.status)}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {dropdownOpen === index && (
                      <div style={dropdownStyle}>
                        {getStatusOptions().map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleStatusChange(item.id, option.value)
                            }
                            style={dropdownItemStyle}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ ...cellStyle, textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={deleteButtonStyle}
                  >
                    <Image
                      src="/images/careers/delete.svg"
                      alt="Delete"
                      width={16}
                      height={16}
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="mb-6">
      {showHeader && (
        <div className="flex items-center justify-between py-4 px-10 border border-[#333333] rounded-t-2xl">
          <h2 className="text-white text-2xl font-medium">{title}</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="bg-[#0D0D0D] border border-[#333333] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#00DBDC] transition-colors duration-200"
                style={{ width: "240px", height: "40px" }}
              />
              <Image
                src="/images/careers/career-search.svg"
                alt="Search"
                width={16}
                height={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
            </div>

            <DateRangeFilter
              onApply={(start, end) => setDateRange({ start, end })}
              onClear={() => setDateRange(null)}
            />

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
      )}

      <div style={{ width: "1100px", overflow: "hidden" }}>
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

        {!loading && !error && data.length > 0 && <div>{renderTable()}</div>}

        <div
          className="bg-[#333333] px-6 py-4"
          style={{
            width: "1100px",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
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
  padding: "16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 500,
  color: "#BFBFBF",
  borderBottom: "1px solid #333333",
};

const cellStyle: React.CSSProperties = {
  padding: "16px",
  fontSize: "14px",
  color: "#FFFFFF",
  borderBottom: "1px solid #333333",
};

const statusButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 12px",
  background: "transparent",
  border: "1px solid",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  marginTop: "4px",
  background: "#1D1D1D",
  border: "1px solid #333333",
  borderRadius: "8px",
  minWidth: "150px",
  zIndex: 10,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 12px",
  textAlign: "left",
  background: "transparent",
  border: "none",
  color: "#FFFFFF",
  fontSize: "14px",
  cursor: "pointer",
  transition: "background 0.2s",
};

const deleteButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export default FormSubmissionTable;
