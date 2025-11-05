"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BlogsTableProps, BlogEntry } from "@/types/adminPortal";
import { BlogStatus } from "@/constants/enums";
import ColumnFilter from "./ColumnFilter";

// Utility function to format timestamp to DD/MM/YY HH:MM
const formatDateTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return timestamp; // Return original if parsing fails
  }
};

// Utility function to get status label
const getStatusLabel = (status: number): string => {
  switch (status) {
    case BlogStatus.DRAFT:
      return "Draft";
    case BlogStatus.PUBLISHED:
      return "Published";
    case BlogStatus.DELETED:
      return "Deleted";
    default:
      return "Unknown";
  }
};

const BlogsTable = ({
  blogs,
  categories,
  onEdit,
  onDelete,
  onMarkAsFeatured,
  selectedCategories = [],
  onCategoryFilter,
  selectedStatuses = [],
  onStatusFilter,
}: BlogsTableProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (blogId: string) => {
    setActiveDropdown(activeDropdown === blogId ? null : blogId);
  };

  const handleEdit = (blog: BlogEntry) => {
    setActiveDropdown(null);
    onEdit(blog);
  };

  const handleDelete = (blogId: string) => {
    setActiveDropdown(null);
    onDelete(blogId);
  };

  const handleMarkAsFeatured = (blogId: string) => {
    setActiveDropdown(null);
    onMarkAsFeatured?.(blogId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-menu-root]")) setActiveDropdown(null);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="h-full px-10">
      <div className="bg-[#1D1D1D] rounded-2xl overflow-hidden border border-[#333333] h-full flex flex-col">
        {/* Table Header */}
        <div className="bg-[#333333] border border-[#333333] rounded-t-2xl px-10 py-4 flex items-center gap-6">
          <div className="flex-[2] min-w-0">
            <span className="font-medium text-xs leading-4 tracking-[0%] text-[#8A8A8A]">
              Title
            </span>
          </div>
          <div className="w-32 flex items-center gap-2">
            <span className="font-medium text-xs leading-4 tracking-[0%] text-[#8A8A8A]">
              Category
            </span>
            {onCategoryFilter && (
              <ColumnFilter
                options={categories.map((cat) => ({
                  id: cat.id,
                  label: cat.heading,
                  value: cat.id,
                }))}
                selectedValues={selectedCategories}
                onFilterChange={(values) =>
                  onCategoryFilter(values as number[])
                }
                placeholder="Filter categories"
              />
            )}
          </div>
          <div className="w-24">
            <span className="font-medium text-xs leading-4 tracking-[0%] text-[#8A8A8A]">
              Date
            </span>
          </div>
          <div className="w-20">
            <span className="font-medium text-xs leading-4 tracking-[0%] text-[#8A8A8A]">
              Image
            </span>
          </div>
          <div className="w-24 flex items-center gap-2">
            <span className="font-medium text-xs leading-4 tracking-[0%] text-[#8A8A8A]">
              Status
            </span>
            {onStatusFilter && (
              <ColumnFilter
                options={[
                  {
                    id: BlogStatus.DRAFT,
                    label: "Draft",
                    value: BlogStatus.DRAFT,
                  },
                  {
                    id: BlogStatus.PUBLISHED,
                    label: "Published",
                    value: BlogStatus.PUBLISHED,
                  },
                  {
                    id: BlogStatus.DELETED,
                    label: "Deleted",
                    value: BlogStatus.DELETED,
                  },
                ]}
                selectedValues={selectedStatuses}
                onFilterChange={(values) => onStatusFilter(values as number[])}
                placeholder="Filter status"
              />
            )}
          </div>
          <div className="w-24">
            <span className="font-medium text-xs leading-4 tracking-[0%] text-[#8A8A8A]">
              Last Edited
            </span>
          </div>
          <div className="w-12">
            <span className="font-medium text-xs leading-4 tracking-[0%] text-[#8A8A8A]">
              Actions
            </span>
          </div>
        </div>

        {/* Table Body - Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#333333]">
          {blogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`px-10 py-2 flex items-center gap-6 hover:bg-[#262626] transition-colors duration-200 ${
                index === blogs.length - 1 ? "rounded-b-2xl" : ""
              }`}
            >
              {/* Title */}
              <div className="flex-[2] min-w-0">
                <p className="font-light text-sm leading-5 tracking-[0%] text-white truncate">
                  {blog.title}
                </p>
              </div>

              {/* Category */}
              <div className="w-32">
                <p className="font-light text-sm leading-5 tracking-[0%] text-white truncate">
                  {blog.categoryHeading || "Unassigned"}
                </p>
              </div>

              {/* Date */}
              <div className="w-24">
                <p className="font-light text-sm leading-5 tracking-[0%] text-white">
                  {blog.date}
                </p>
              </div>

              {/* Image */}
              <div className="w-20">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#333333]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="w-24">
                <p className="font-light text-sm leading-5 tracking-[0%] text-white">
                  {getStatusLabel(blog.status || BlogStatus.DRAFT)}
                </p>
              </div>

              {/* Edited */}
              <div className="w-24">
                <p className="font-light text-sm leading-5 tracking-[0%] text-white">
                  {formatDateTime(blog.edited)}
                </p>
              </div>

              {/* Actions */}
              <div className="w-12 flex justify-center">
                <div className="relative" data-menu-root>
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      toggleDropdown(blog.id);
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
                  {activeDropdown === blog.id && (
                    <div
                      className="absolute right-0 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-50"
                      data-menu-root
                      style={{
                        // Position above for last 2 items, below for others
                        ...(index >= blogs.length - 2
                          ? { bottom: "100%", marginBottom: "4px" }
                          : { top: "100%", marginTop: "4px" }),
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleMarkAsFeatured(blog.id)}
                        className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                      >
                        {blog.isFeatured
                          ? "Remove from featured"
                          : "Mark as featured"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleEdit(blog);
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleDelete(blog.id);
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#333333]"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="px-10 py-12 text-center">
              <p className="text-[#8A8A8A] text-sm">No blogs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsTable;
