"use client";

import React, { useState } from "react";
import Image from "next/image";

type SectionType =
  | "general-queries"
  | "franchise-applications"
  | "lead-submissions";

interface FormSubmissionTableProps {
  sectionType: SectionType;
  title: string;
  showHeader?: boolean;
}

interface GeneralQueryData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  date: string;
  status: "New" | "In review" | "Closed";
}

interface FranchiseApplicationData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  date: string;
  location: string;
  investment: string;
  status: "New" | "Reviewed" | "Pending" | "Closed";
}

interface LeadSubmissionData {
  name: string;
  phoneNumber: string;
  interestedIn: string;
  message: string;
  date: string;
  location: string;
  investment: string;
  status: "New" | "Reviewed" | "Pending" | "Closed";
}

const mockGeneralQueries: GeneralQueryData[] = [
  {
    name: "Sahil dua",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Need info about plans",
    date: "2/4/25",
    status: "New",
  },
  {
    name: "abcde dua",
    email: "acdheds@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "I want to know more about pricing plans.",
    date: "2/4/25",
    status: "Closed",
  },
  {
    name: "vmadkavd gefhg",
    email: "djnjvdnj@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "I am unable to log in to my account.",
    date: "2/4/25",
    status: "New",
  },
  {
    name: "ndajd snjn",
    email: "28bhcb@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Interested in collaboration opportunity.",
    date: "2/4/25",
    status: "New",
  },
  {
    name: "Sahil dua",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Need help in updating my profile.",
    date: "2/4/25",
    status: "New",
  },
  {
    name: "Sahil dua",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "I am unable to log in to my account.",
    date: "2/4/25",
    status: "In review",
  },
];

const mockFranchiseApplications: FranchiseApplicationData[] = [
  {
    name: "scnksa dua",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Interested in opening outlet in South Delhi.",
    date: "2/4/25",
    location: "Delhi",
    investment: "₹4-5 Cr",
    status: "New",
  },
  {
    name: "Sahil acsnasacs",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Looking for exclusive rights in Mumbai region.",
    date: "2/4/25",
    location: "Delhi",
    investment: "₹4-5 Cr",
    status: "New",
  },
  {
    name: "dahuiad skj",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Want to start in IT park area, quick setup.",
    date: "2/4/25",
    location: "Gurugram",
    investment: "₹4-5 Cr",
    status: "New",
  },
  {
    name: "csichjoi jnascjkn",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Planning to open 2 outlets together.",
    date: "2/4/25",
    location: "2/4/25",
    investment: "₹4-5 Cr",
    status: "Reviewed",
  },
  {
    name: "njdsn dnjckjd",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Looking for exclusive rights in Mumbai region.",
    date: "2/4/25",
    location: "2/4/25",
    investment: "₹4-5 Cr",
    status: "Pending",
  },
  {
    name: "d nskjv dmdkl",
    email: "sahildua@gmail.com",
    phoneNumber: "+91 989 989 9898",
    message: "Looking for exclusive rights in delhi",
    date: "2/4/25",
    location: "2/4/25",
    investment: "₹4-5 Cr",
    status: "Closed",
  },
];

const mockLeadSubmissions: LeadSubmissionData[] = [
  {
    name: "danjndj dua",
    phoneNumber: "+91 989 989 9898",
    interestedIn: "+91 989 989 9898",
    message: "Wants details on monthly subscription.",
    date: "2/4/25",
    location: "Delhi",
    investment: "₹4-5 Cr",
    status: "New",
  },
  {
    name: "Sahil dua",
    phoneNumber: "+91 989 989 9898",
    interestedIn: "+91 989 989 9898",
    message: "Interested in corporate package.",
    date: "2/4/25",
    location: "Delhi",
    investment: "₹4-5 Cr",
    status: "New",
  },
  {
    name: "Sahil dua",
    phoneNumber: "+91 989 989 9898",
    interestedIn: "+91 989 989 9898",
    message: "Confused between franchise & direct plan.",
    date: "2/4/25",
    location: "Gurugram",
    investment: "₹4-5 Cr",
    status: "New",
  },
  {
    name: "Sahil dandnadna",
    phoneNumber: "+91 989 989 9898",
    interestedIn: "+91 989 989 9898",
    message: "Wants quick callback, high urgency.",
    date: "2/4/25",
    location: "2/4/25",
    investment: "₹4-5 Cr",
    status: "Reviewed",
  },
  {
    name: "adnjnj dua",
    phoneNumber: "+91 989 989 9898",
    interestedIn: "+91 989 989 9898",
    message: "Interested in corporate package.",
    date: "2/4/25",
    location: "2/4/25",
    investment: "₹4-5 Cr",
    status: "Pending",
  },
  {
    name: "Sahil adnjkdan",
    phoneNumber: "+91 989 989 9898",
    interestedIn: "+91 989 989 9898",
    message: "Wants quick callback, high urgency.",
    date: "2/4/25",
    location: "2/4/25",
    investment: "₹4-5 Cr",
    status: "Closed",
  },
];

const FormSubmissionTable: React.FC<FormSubmissionTableProps> = ({
  sectionType,
  title,
  showHeader = true,
}) => {
  // State for managing table data
  const [generalQueriesData, setGeneralQueriesData] =
    useState(mockGeneralQueries);
  const [franchiseApplicationsData, setFranchiseApplicationsData] = useState(
    mockFranchiseApplications
  );
  const [leadSubmissionsData, setLeadSubmissionsData] =
    useState(mockLeadSubmissions);

  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    console.log(`Changing status for item ${index} to ${newStatus}`);

    if (sectionType === "general-queries") {
      const updatedData = [...generalQueriesData];
      updatedData[index] = {
        ...updatedData[index],
        status: newStatus,
      };
      setGeneralQueriesData(updatedData);
    } else if (sectionType === "franchise-applications") {
      const updatedData = [...franchiseApplicationsData];
      updatedData[index] = {
        ...updatedData[index],
        status: newStatus,
      };
      setFranchiseApplicationsData(updatedData);
    } else if (sectionType === "lead-submissions") {
      const updatedData = [...leadSubmissionsData];
      updatedData[index] = {
        ...updatedData[index],
        status: newStatus,
      };
      setLeadSubmissionsData(updatedData);
    }

    setDropdownOpen(null);
  };

  const handleDelete = (index: number) => {
    console.log(`Deleting item ${index}`);
    setDropdownOpen(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "text-[#00DBDC]";
      case "In review":
        return "text-[#BFBFBF]";
      case "Reviewed":
        return "text-[#0BFFB6]";
      case "Pending":
        return "text-[#FFA500]";
      case "Closed":
        return "text-[#BFBFBF]";
      default:
        return "text-[#BFBFBF]";
    }
  };

  const renderGeneralQueriesTable = () => {
    const headers = [
      "Name",
      "Email",
      "Phone number",
      "Message",
      "Date",
      "Status",
      "Action",
    ];

    return (
      <div className="border-b border-[#333333]">
        {/* Headers */}
        <div
          className="flex items-center text-[#8A8A8A] gap-1 text-center"
          style={{
            width: "1100px",
            height: "48px",
            paddingTop: "16px",
            paddingRight: "40px",
            paddingBottom: "16px",
            paddingLeft: "40px",
            background: "#333333",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            letterSpacing: "0%",
          }}
        >
          <div className="w-24">Name</div>
          <div className="flex-[2]">Email</div>
          <div className="w-32">Phone number</div>
          <div className="flex-[3]">Message</div>
          <div className="w-20">Date</div>
          <div className="w-28">Status</div>
          <div className="w-20">Action</div>
        </div>

        {/* Rows */}
        {generalQueriesData.map((item, index) => (
          <div
            key={index}
            className="bg-[#1D1D1D] flex items-center text-white relative gap-1 text-center"
            style={{
              width: "1100px",
              height: "68px",
              paddingTop: "16px",
              paddingRight: "40px",
              paddingBottom: "16px",
              paddingLeft: "40px",
              border: "1px solid #333333",
              borderTop: "none",
              fontSize: "14px",
            }}
          >
            <div className="w-24">{item.name}</div>
            <div className="flex-[2]">{item.email}</div>
            <div className="w-36">{item.phoneNumber}</div>
            <div className="flex-[3]">{item.message}</div>
            <div className="w-20">{item.date}</div>
            <div className="w-28 flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown(index)}
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
                    className={`text-center ${getStatusColor(item.status)}`}
                    style={{
                      fontWeight: 300,
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    {item.status}
                  </span>
                  <svg
                    width="8"
                    height="6"
                    viewBox="0 0 8 6"
                    fill="none"
                    className={`${getStatusColor(
                      item.status
                    )} transform transition-transform duration-200 ${
                      dropdownOpen === index ? "rotate-180" : ""
                    }`}
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
                {dropdownOpen === index && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "New")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      New
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "In review")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      In review
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "Closed")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      Closed
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-20 flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown(index + 1000)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] rounded"
                >
                  <Image
                    src="/images/careers/dots-vertical.svg"
                    alt="Actions"
                    width={16}
                    height={16}
                  />
                </button>
                {dropdownOpen === index + 1000 && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#333333]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFranchiseApplicationsTable = () => {
    const headers = [
      "Name",
      "Email",
      "Phone number",
      "Message",
      "Date",
      "Location",
      "Investment",
      "Status",
    ];

    return (
      <div>
        {/* Headers */}
        <div
          className="flex items-center text-[#8A8A8A] gap-1 text-center"
          style={{
            width: "1100px",
            height: "48px",
            paddingTop: "16px",
            paddingRight: "40px",
            paddingBottom: "16px",
            paddingLeft: "40px",
            background: "#333333",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            letterSpacing: "0%",
          }}
        >
          <div className="w-24">Name</div>
          <div className="flex-[2]">Email</div>
          <div className="w-32">Phone number</div>
          <div className="flex-[3]">Message</div>
          <div className="w-20">Date</div>
          <div className="w-24">Location</div>
          <div className="w-24">Investment</div>
          <div className="w-28">Status</div>
        </div>

        {/* Rows */}
        {franchiseApplicationsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#1D1D1D] flex items-center text-white relative gap-1 text-center"
            style={{
              width: "1100px",
              height: "68px",
              paddingTop: "16px",
              paddingRight: "40px",
              paddingBottom: "16px",
              paddingLeft: "40px",
              border: "1px solid #333333",
              borderTop: "none",
              fontSize: "14px",
            }}
          >
            <div className="w-24">{item.name}</div>
            <div className="flex-[2]">{item.email}</div>
            <div className="w-32">{item.phoneNumber}</div>
            <div className="flex-[3]">{item.message}</div>
            <div className="w-20">{item.date}</div>
            <div className="w-24">{item.location}</div>
            <div className="w-24">{item.investment}</div>
            <div className="w-28 flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown(originalIndex + 2000)}
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
                    className={`text-center ${getStatusColor(item.status)}`}
                    style={{
                      fontWeight: 300,
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    {item.status}
                  </span>
                  <svg
                    width="8"
                    height="6"
                    viewBox="0 0 8 6"
                    fill="none"
                    className={`${getStatusColor(
                      item.status
                    )} transform transition-transform duration-200 ${
                      dropdownOpen === index + 2000 ? "rotate-180" : ""
                    }`}
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
                {dropdownOpen === index + 2000 && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "New")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      New
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "Reviewed")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      Reviewed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "Pending")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "Closed")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      Closed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeadSubmissionsTable = () => {
    const headers = [
      "Name",
      "Phone number",
      "Interested in",
      "Message",
      "Date",
      "Location",
      "Investment",
      "Status",
    ];

    return (
      <div>
        {/* Headers */}
        <div
          className="flex items-center text-[#8A8A8A] gap-1 text-center"
          style={{
            width: "1100px",
            height: "48px",
            paddingTop: "16px",
            paddingRight: "40px",
            paddingBottom: "16px",
            paddingLeft: "40px",
            background: "#333333",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "16px",
            letterSpacing: "0%",
          }}
        >
          <div className="w-24">Name</div>
          <div className="w-32">Phone number</div>
          <div className="flex-[2]">Interested in</div>
          <div className="flex-[3]">Message</div>
          <div className="w-20">Date</div>
          <div className="w-24">Location</div>
          <div className="w-24">Investment</div>
          <div className="w-28">Status</div>
        </div>

        {/* Rows */}
        {leadSubmissionsData.map((item, index) => (
          <div
            key={index}
            className="bg-[#1D1D1D] flex items-center text-white relative gap-1 text-center"
            style={{
              width: "1100px",
              height: "68px",
              paddingTop: "16px",
              paddingRight: "40px",
              paddingBottom: "16px",
              paddingLeft: "40px",
              border: "1px solid #333333",
              borderTop: "none",
              fontSize: "14px",
            }}
          >
            <div className="w-24">{item.name}</div>
            <div className="w-32">{item.phoneNumber}</div>
            <div className="flex-[2]">{item.interestedIn}</div>
            <div className="flex-[3]">{item.message}</div>
            <div className="w-20">{item.date}</div>
            <div className="w-24">{item.location}</div>
            <div className="w-24">{item.investment}</div>
            <div className="w-28 flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown(originalIndex + 4000)}
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
                    className={`text-center ${getStatusColor(item.status)}`}
                    style={{
                      fontWeight: 300,
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    {item.status}
                  </span>
                  <svg
                    width="8"
                    height="6"
                    viewBox="0 0 8 6"
                    fill="none"
                    className={`${getStatusColor(
                      item.status
                    )} transform transition-transform duration-200 ${
                      dropdownOpen === index + 4000 ? "rotate-180" : ""
                    }`}
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
                {dropdownOpen === index + 4000 && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "New")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      New
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "Reviewed")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      Reviewed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "Pending")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(index, "Closed")}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-[#333333]"
                    >
                      Closed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    switch (sectionType) {
      case "general-queries":
        return renderGeneralQueriesTable();
      case "franchise-applications":
        return renderFranchiseApplicationsTable();
      case "lead-submissions":
        return renderLeadSubmissionsTable();
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Section Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-medium">{title}</h2>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-[#0D0D0D] border border-[#333333] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#00DBDC] transition-colors duration-200"
                style={{ width: "240px", height: "40px" }}
              />
              <Image
                src="/images/careers/career-search.svg"
                alt="Search"
                width={16}
                height={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8A8A]"
              />
            </div>

            {/* Filter Button */}
            <button
              className="bg-[#0D0D0D] border border-[#333333] rounded-lg flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors duration-200 px-4"
              style={{ height: "40px" }}
            >
              <Image
                src="/images/careers/filter.svg"
                alt="Filter"
                width={16}
                height={16}
              />
              <span className="text-[#BFBFBF] text-sm font-normal">Filter</span>
            </button>

            {/* Download CSV Button */}
            <button
              className="bg-[#0D0D0D] border border-[#333333] rounded-lg flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors duration-200 px-4"
              style={{ height: "40px" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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

      {/* Table Container with Figma Specifications */}
      <div
        style={{
          width: "1100px",
          overflow: "hidden",
        }}
      >
        {/* Table */}
        <div>{renderTable()}</div>

        {/* View More Section */}
        <div
          className="bg-[#333333] flex items-center justify-center"
          style={{
            width: "1100px",
            height: "40px",
            padding: "10px",
            gap: "10px",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        >
          <button className="text-[#8A8A8A] text-sm hover:text-white transition-colors duration-200">
            View more
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionTable;
