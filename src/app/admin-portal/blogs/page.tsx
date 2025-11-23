"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminPortal/AdminHeader";
import BlogsTable from "@/components/AdminPortal/BlogsTable";
import BlogModal from "@/components/AdminPortal/BlogModal";
import { BlogEntry, BlogFormData, BlogCategory } from "@/types/adminPortal";
import { blogAPI } from "@/services/blogAPI";
import { blogCategoryAPI } from "@/services/blogCategoryAPI";
import { BlogStatus } from "@/constants/enums";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const mockBlogs: BlogEntry[] = [];

export default function BlogsPage() {
  const [allBlogs, setAllBlogs] = useState<BlogEntry[]>(mockBlogs);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogEntry[]>(mockBlogs);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBlog, setSelectedBlog] = useState<BlogEntry | undefined>(
    undefined
  );
  const [_loading, setLoading] = useState<boolean>(false);
  const { adminUser } = useAdminAuth();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [blogsList, categoriesList] = await Promise.all([
          blogAPI.list(),
          blogCategoryAPI.list(),
        ]);
        setAllBlogs(blogsList);
        setFilteredBlogs(blogsList);
        setCategories(categoriesList);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    applyFilters(query, selectedCategories, selectedStatuses);
  };

  const handleCategoryFilter = (categoryIds: number[]) => {
    setSelectedCategories(categoryIds);
    applyFilters("", categoryIds, selectedStatuses);
  };

  const handleStatusFilter = (statusIds: number[]) => {
    setSelectedStatuses(statusIds);
    applyFilters("", selectedCategories, statusIds);
  };

  const applyFilters = (
    searchQuery: string,
    categoryIds: number[],
    statusIds: number[]
  ) => {
    let filtered = allBlogs;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryIds.length > 0) {
      filtered = filtered.filter((blog) => {
        if (!blog.categoryId || blog.categoryId === 0) {
          return false; // Exclude unassigned blogs when filtering by categories
        }
        return categoryIds.includes(blog.categoryId);
      });
    }

    // Apply status filter
    if (statusIds.length > 0) {
      filtered = filtered.filter((blog) => {
        return statusIds.includes(blog.status || BlogStatus.DRAFT);
      });
    }

    setFilteredBlogs(filtered);
  };

  const handleAddBlog = () => {
    setModalMode("create");
    setSelectedBlog(undefined);
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog: BlogEntry) => {
    setModalMode("edit");
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    await blogAPI.remove(blogId);
    const updated = allBlogs.filter((b) => String(b.id) !== String(blogId));
    setAllBlogs(updated);
    setFilteredBlogs(updated);
  };

  const handleMarkAsFeatured = async (blogId: string) => {
    try {
      const updatedBlog = await blogAPI.toggleFeatured(blogId);

      // Update the blog in both allBlogs and filteredBlogs
      const updateBlogInList = (blogList: BlogEntry[]) =>
        blogList.map((b) =>
          String(b.id) === String(blogId) ? updatedBlog : b
        );

      setAllBlogs(updateBlogInList);
      setFilteredBlogs(updateBlogInList);
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
      alert("Failed to update featured status. Please try again.");
    }
  };

  const handleSaveBlog = async (blogData: BlogFormData) => {
    // Check if this is a delete action
    if ((blogData as any)._action === "delete") {
      await handleDeleteBlog((blogData as any).id);
      return;
    }

    if (modalMode === "create") {
      const created = await blogAPI.create(blogData);
      const updated = [created, ...allBlogs];
      setAllBlogs(updated);
      setFilteredBlogs(updated);
    } else if (modalMode === "edit" && selectedBlog) {
      const updatedItem = await blogAPI.update(selectedBlog.id, blogData);
      const updated = allBlogs.map((b) =>
        String(b.id) === String(selectedBlog.id) ? updatedItem : b
      );
      setAllBlogs(updated);
      setFilteredBlogs(updated);
    }
  };

  return (
    <div className="h-full bg-[#0D0D0D] flex flex-col">
      <AdminHeader
        title="Blogs"
        user={adminUser}
        onSearch={handleSearch}
        onAdd={handleAddBlog}
        showSearchButton={true}
        showAddButton={true}
      />

      <div className="flex-1 overflow-hidden">
        <BlogsTable
          blogs={filteredBlogs}
          categories={categories}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          onMarkAsFeatured={handleMarkAsFeatured}
          selectedCategories={selectedCategories}
          onCategoryFilter={handleCategoryFilter}
          selectedStatuses={selectedStatuses}
          onStatusFilter={handleStatusFilter}
        />
      </div>

      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBlog}
        blog={selectedBlog}
        mode={modalMode}
      />
    </div>
  );
}
