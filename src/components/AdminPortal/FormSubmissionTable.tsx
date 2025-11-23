"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const itemsPerPage = sectionType === "lead-submissions" ? 3 : 4;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, _setStatusFilter] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<number | null>(
    null
  );
  const [actionDropdownOpen, setActionDropdownOpen] = useState<number | null>(
    null
  );
  const statusButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>(
    {}
  );
  const actionButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>(
    {}
  );

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".relative") &&
        !target.closest("[id^='status-dropdown-']") &&
        !target.closest("[id^='action-dropdown-']")
      ) {
        setStatusDropdownOpen(null);
        setActionDropdownOpen(null);
      }
    };

    if (statusDropdownOpen !== null || actionDropdownOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [statusDropdownOpen, actionDropdownOpen]);

  useEffect(() => {
    if (statusDropdownOpen !== null) {
      const button = statusButtonRefs.current[statusDropdownOpen];
      const dropdown = document.getElementById(
        `status-dropdown-${statusDropdownOpen}`
      );
      if (button && dropdown) {
        const rect = button.getBoundingClientRect();
        const shouldOpenAbove =
          statusDropdownOpen >= data.length - 3 || data.length <= 4;
        if (shouldOpenAbove) {
          dropdown.style.top = `${rect.top - dropdown.offsetHeight - 4}px`;
        } else {
          dropdown.style.top = `${rect.bottom + 4}px`;
        }
        dropdown.style.left = `${rect.left}px`;
      }
    }
  }, [statusDropdownOpen, data.length]);

  useEffect(() => {
    if (actionDropdownOpen !== null) {
      const button = actionButtonRefs.current[actionDropdownOpen];
      const dropdown = document.getElementById(
        `action-dropdown-${actionDropdownOpen}`
      );
      if (button && dropdown) {
        const rect = button.getBoundingClientRect();
        const shouldOpenAbove = actionDropdownOpen >= data.length - 1;
        if (shouldOpenAbove) {
          dropdown.style.top = `${rect.top - dropdown.offsetHeight - 4}px`;
        } else {
          dropdown.style.top = `${rect.bottom + 4}px`;
        }
        dropdown.style.right = `${window.innerWidth - rect.right}px`;
      }
    }
  }, [actionDropdownOpen, data.length]);

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
      setStatusDropdownOpen(null);
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
      setActionDropdownOpen(null);
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

  const toggleStatusDropdown = (index: number) => {
    setStatusDropdownOpen(statusDropdownOpen === index ? null : index);
    setActionDropdownOpen(null);
  };

  const toggleActionDropdown = (index: number) => {
    setActionDropdownOpen(actionDropdownOpen === index ? null : index);
    setStatusDropdownOpen(null);
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
          tableLayout: "auto",
        }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#333333",
          }}
        >
          <tr style={{ background: "#333333" }}>
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
          {data.map((item: any, index) => {
            const isLastRow = index === data.length - 1;
            const lastRowCellStyle = isLastRow
              ? {
                  ...cellStyle,
                  borderBottom: "none",
                }
              : cellStyle;
            const firstCellStyle = isLastRow
              ? {
                  ...lastRowCellStyle,
                  borderBottomLeftRadius: "16px",
                }
              : lastRowCellStyle;
            const lastCellStyle = isLastRow
              ? {
                  ...lastRowCellStyle,
                  borderBottomRightRadius: "16px",
                }
              : lastRowCellStyle;

            return (
              <tr key={item.id} style={{ background: "#1D1D1D" }}>
                <td style={firstCellStyle}>
                  {item.first_name} {item.last_name}
                </td>
                <td style={lastRowCellStyle}>{item.email}</td>
                <td style={lastRowCellStyle}>{item.phone || "-"}</td>
                <td
                  style={{
                    ...lastRowCellStyle,
                    minWidth: "200px",
                    maxWidth: "400px",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    lineHeight: "1.5",
                  }}
                >
                  {item.message}
                </td>
                <td style={lastRowCellStyle}>
                  {formatDateTimeForDisplay(item.created_at)}
                </td>
                <td style={lastRowCellStyle}>
                  <div className="relative flex justify-center">
                    <button
                      type="button"
                      ref={(el) => {
                        statusButtonRefs.current[index] = el;
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatusDropdown(index);
                      }}
                      className="bg-[#333333] border border-[#333333] rounded flex items-center justify-between transition-colors"
                      style={{
                        width: "85px",
                        height: "24px",
                        paddingTop: "4px",
                        paddingRight: "10px",
                        paddingBottom: "4px",
                        paddingLeft: "10px",
                        gap: "4px",
                      }}
                    >
                      <span
                        className="text-center"
                        style={{
                          color: getStatusColor(item.status),
                          fontWeight: 300,
                          fontSize: "12px",
                          lineHeight: "16px",
                          letterSpacing: "0%",
                        }}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                      <svg
                        width="8"
                        height="6"
                        viewBox="0 0 8 6"
                        fill="none"
                        className={`transform transition-transform duration-200 ${
                          statusDropdownOpen === index ? "rotate-180" : ""
                        }`}
                        style={{ color: getStatusColor(item.status) }}
                      >
                        <path
                          d="M1 1L4 4L7 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {statusDropdownOpen === index && (
                      <div
                        id={`status-dropdown-${index}`}
                        className="fixed bg-[#1D1D1D] border border-[#333333] rounded shadow-lg"
                        style={{
                          width: "85px",
                          zIndex: 99999,
                        }}
                      >
                        {getStatusOptions().map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              handleStatusChange(item.id, option.value);
                              setStatusDropdownOpen(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ ...lastCellStyle, textAlign: "center" }}>
                  <div className="relative">
                    <button
                      type="button"
                      ref={(el) => {
                        actionButtonRefs.current[index] = el;
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionDropdown(index);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] rounded"
                    >
                      <Image
                        src="/images/careers/dots-vertical.svg"
                        alt="Actions"
                        width={16}
                        height={16}
                      />
                    </button>
                    {actionDropdownOpen === index && (
                      <div
                        id={`action-dropdown-${index}`}
                        className="fixed bg-[#1D1D1D] border border-[#333333] rounded shadow-lg"
                        style={{
                          minWidth: "120px",
                          zIndex: 99999,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(item.id);
                            setActionDropdownOpen(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#333333]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
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
          tableLayout: "auto",
        }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#333333",
          }}
        >
          <tr style={{ background: "#333333" }}>
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
          {data.map((item: any, index) => {
            const isLastRow = index === data.length - 1;
            const lastRowCellStyle = isLastRow
              ? {
                  ...cellStyle,
                  borderBottom: "none",
                }
              : cellStyle;
            const firstCellStyle = isLastRow
              ? {
                  ...lastRowCellStyle,
                  borderBottomLeftRadius: "16px",
                }
              : lastRowCellStyle;
            const lastCellStyle = isLastRow
              ? {
                  ...lastRowCellStyle,
                  borderBottomRightRadius: "16px",
                }
              : lastRowCellStyle;

            return (
              <tr key={item.id} style={{ background: "#1D1D1D" }}>
                <td style={firstCellStyle}>
                  {item.contact_person || item.business_name}
                </td>
                <td style={lastRowCellStyle}>{item.email}</td>
                <td style={lastRowCellStyle}>{item.phone || "-"}</td>
                <td style={lastRowCellStyle}>{item.city || "-"}</td>
                <td style={lastRowCellStyle}>
                  ₹{item.investment_capacity || "0"}
                </td>
                <td style={lastRowCellStyle}>
                  {formatDateTimeForDisplay(item.created_at)}
                </td>
                <td style={lastRowCellStyle}>
                  <div className="relative flex justify-center">
                    <button
                      type="button"
                      ref={(el) => {
                        statusButtonRefs.current[index] = el;
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatusDropdown(index);
                      }}
                      className="bg-[#333333] border border-[#333333] rounded flex items-center justify-between transition-colors"
                      style={{
                        width: "85px",
                        height: "24px",
                        paddingTop: "4px",
                        paddingRight: "10px",
                        paddingBottom: "4px",
                        paddingLeft: "10px",
                        gap: "4px",
                      }}
                    >
                      <span
                        className="text-center"
                        style={{
                          color: getStatusColor(item.status),
                          fontWeight: 300,
                          fontSize: "12px",
                          lineHeight: "16px",
                          letterSpacing: "0%",
                        }}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                      <svg
                        width="8"
                        height="6"
                        viewBox="0 0 8 6"
                        fill="none"
                        className={`transform transition-transform duration-200 ${
                          statusDropdownOpen === index ? "rotate-180" : ""
                        }`}
                        style={{ color: getStatusColor(item.status) }}
                      >
                        <path
                          d="M1 1L4 4L7 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {statusDropdownOpen === index && (
                      <div
                        id={`status-dropdown-${index}`}
                        className="fixed bg-[#1D1D1D] border border-[#333333] rounded shadow-lg"
                        style={{
                          width: "85px",
                          zIndex: 99999,
                        }}
                      >
                        {getStatusOptions().map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              handleStatusChange(item.id, option.value);
                              setStatusDropdownOpen(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ ...lastCellStyle, textAlign: "center" }}>
                  <div className="relative">
                    <button
                      type="button"
                      ref={(el) => {
                        actionButtonRefs.current[index] = el;
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionDropdown(index);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] rounded"
                    >
                      <Image
                        src="/images/careers/dots-vertical.svg"
                        alt="Actions"
                        width={16}
                        height={16}
                      />
                    </button>
                    {actionDropdownOpen === index && (
                      <div
                        id={`action-dropdown-${index}`}
                        className="fixed bg-[#1D1D1D] border border-[#333333] rounded shadow-lg"
                        style={{
                          minWidth: "120px",
                          zIndex: 99999,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(item.id);
                            setActionDropdownOpen(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#333333]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
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
          tableLayout: "auto",
        }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#333333",
          }}
        >
          <tr style={{ background: "#333333" }}>
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

            const isLastRow = index === data.length - 1;
            const lastRowCellStyle = isLastRow
              ? {
                  ...cellStyle,
                  borderBottom: "none",
                }
              : cellStyle;
            const firstCellStyle = isLastRow
              ? {
                  ...lastRowCellStyle,
                  borderBottomLeftRadius: "16px",
                }
              : lastRowCellStyle;
            const lastCellStyle = isLastRow
              ? {
                  ...lastRowCellStyle,
                  borderBottomRightRadius: "16px",
                }
              : lastRowCellStyle;

            return (
              <tr key={item.id} style={{ background: "#1D1D1D" }}>
                <td style={firstCellStyle}>{item.name}</td>
                <td style={lastRowCellStyle}>{item.phone}</td>
                <td style={lastRowCellStyle}>{interests.join(", ") || "-"}</td>
                <td
                  style={{
                    ...lastRowCellStyle,
                    minWidth: "150px",
                    maxWidth: "350px",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    lineHeight: "1.5",
                  }}
                >
                  {item.message || "-"}
                </td>
                <td style={lastRowCellStyle}>
                  {item.preferred_location || "-"}
                </td>
                <td style={lastRowCellStyle}>
                  {formatDateTimeForDisplay(item.created_at)}
                </td>
                <td style={cellStyle}>
                  <div className="relative flex justify-center">
                    <button
                      type="button"
                      ref={(el) => {
                        statusButtonRefs.current[index] = el;
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatusDropdown(index);
                      }}
                      className="bg-[#333333] border border-[#333333] rounded flex items-center justify-between transition-colors"
                      style={{
                        width: "85px",
                        height: "24px",
                        paddingTop: "4px",
                        paddingRight: "10px",
                        paddingBottom: "4px",
                        paddingLeft: "10px",
                        gap: "4px",
                      }}
                    >
                      <span
                        className="text-center"
                        style={{
                          color: getStatusColor(item.status),
                          fontWeight: 300,
                          fontSize: "12px",
                          lineHeight: "16px",
                          letterSpacing: "0%",
                        }}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                      <svg
                        width="8"
                        height="6"
                        viewBox="0 0 8 6"
                        fill="none"
                        className={`transform transition-transform duration-200 ${
                          statusDropdownOpen === index ? "rotate-180" : ""
                        }`}
                        style={{ color: getStatusColor(item.status) }}
                      >
                        <path
                          d="M1 1L4 4L7 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {statusDropdownOpen === index && (
                      <div
                        id={`status-dropdown-${index}`}
                        className="fixed bg-[#1D1D1D] border border-[#333333] rounded shadow-lg"
                        style={{
                          width: "85px",
                          zIndex: 99999,
                        }}
                      >
                        {getStatusOptions().map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              handleStatusChange(item.id, option.value);
                              setStatusDropdownOpen(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ ...lastCellStyle, textAlign: "center" }}>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionDropdown(index);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] rounded"
                    >
                      <Image
                        src="/images/careers/dots-vertical.svg"
                        alt="Actions"
                        width={16}
                        height={16}
                      />
                    </button>
                    {actionDropdownOpen === index && (
                      <div
                        id={`action-dropdown-${index}`}
                        className="fixed bg-[#1D1D1D] border border-[#333333] rounded shadow-lg"
                        style={{
                          minWidth: "120px",
                          zIndex: 99999,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(item.id);
                            setActionDropdownOpen(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#333333]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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

      <div
        className={`border border-[#333333] ${
          showHeader ? "border-t-0 rounded-b-2xl" : "rounded-2xl"
        } flex flex-col`}
        style={{ width: "1100px", maxHeight: "calc(103vh - 250px)" }}
      >
        <div
          className="overflow-y-auto flex-1"
          style={{ maxHeight: "calc(103vh - 350px)" }}
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

          {!loading && !error && data.length > 0 && <div>{renderTable()}</div>}
        </div>

        <div
          className="bg-[#333333] px-6 py-4 border-t border-[#333333] rounded-b-2xl flex-shrink-0"
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

export default FormSubmissionTable;
