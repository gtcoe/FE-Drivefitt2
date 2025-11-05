"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { jobAPI } from "@/services/jobAPI";

interface AddJobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobPost: JobPostFormData) => void;
  editData?: JobPostFormData | null;
  isEdit?: boolean;
}

interface JobPostFormData {
  id?: number;
  jobTitle: string;
  departmentId: number | "";
  locationId: number | "";
  jobType: string;
  applicationDeadline: string;
  jobDescription: string;
  skillsRequired: string;
  roleItems: string[];
  qualifications: string[];
  yearsOfExperience: string;
  isVisible?: boolean;
}

const AddJobPostModal: React.FC<AddJobPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<JobPostFormData>({
    id: undefined,
    jobTitle: "",
    departmentId: "",
    locationId: "",
    jobType: "",
    applicationDeadline: "",
    jobDescription: "",
    skillsRequired: "",
    roleItems: [],
    qualifications: [],
    yearsOfExperience: "",
    isVisible: true,
  });

  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [locations, setLocations] = useState<
    { id: number; full_location: string }[]
  >([]);

  // Update form data when editData changes
  useEffect(() => {
    if (editData && isEdit) {
      setFormData({
        id: editData.id,
        jobTitle: editData.jobTitle || "",
        departmentId: editData.departmentId || "",
        locationId: editData.locationId || "",
        jobType: editData.jobType || "",
        applicationDeadline: editData.applicationDeadline || "",
        jobDescription: editData.jobDescription || "",
        skillsRequired: editData.skillsRequired || "",
        roleItems: editData.roleItems || [],
        qualifications: editData.qualifications || [],
        yearsOfExperience: editData.yearsOfExperience || "",
        isVisible: editData.isVisible !== undefined ? editData.isVisible : true,
      });
    } else if (!isEdit) {
      setFormData({
        id: undefined,
        jobTitle: "",
        departmentId: "",
        locationId: "",
        jobType: "",
        applicationDeadline: "",
        jobDescription: "",
        skillsRequired: "",
        roleItems: [],
        qualifications: [],
        yearsOfExperience: "",
        isVisible: true,
      });
    }
  }, [editData, isEdit, isOpen]);

  useEffect(() => {
    (async () => {
      try {
        const meta = await jobAPI.getDepartmentsLocations();
        setDepartments(meta.departments || []);
        setLocations(meta.locations || []);
      } catch (e) {
        console.error("Error fetching departments and locations:", e);
        setDepartments([]);
        setLocations([]);
      }
    })();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    if (!isEdit) {
      setFormData({
        jobTitle: "",
        departmentId: "",
        locationId: "",
        jobType: "",
        applicationDeadline: "",
        jobDescription: "",
        skillsRequired: "",
        roleItems: [],
        qualifications: [],
        yearsOfExperience: "",
      });
    }
  };

  const [roleInput, setRoleInput] = useState("");
  const [qualificationInput, setQualificationInput] = useState("");

  const addRole = () => {
    const v = roleInput.trim();
    if (!v) return;
    setFormData((p) => ({ ...p, roleItems: [...p.roleItems, v] }));
    setRoleInput("");
  };
  const removeRole = (idx: number) => {
    setFormData((p) => ({
      ...p,
      roleItems: p.roleItems.filter((_, i) => i !== idx),
    }));
  };
  const moveRole = (idx: number, dir: -1 | 1) => {
    setFormData((p) => {
      const next = [...p.roleItems];
      const ni = idx + dir;
      if (ni < 0 || ni >= next.length) return p;
      const [it] = next.splice(idx, 1);
      next.splice(ni, 0, it);
      return { ...p, roleItems: next };
    });
  };

  const addQualification = () => {
    const v = qualificationInput.trim();
    if (!v) return;
    setFormData((p) => ({ ...p, qualifications: [...p.qualifications, v] }));
    setQualificationInput("");
  };
  const removeQualification = (idx: number) => {
    setFormData((p) => ({
      ...p,
      qualifications: p.qualifications.filter((_, i) => i !== idx),
    }));
  };
  const moveQualification = (idx: number, dir: -1 | 1) => {
    setFormData((p) => {
      const next = [...p.qualifications];
      const ni = idx + dir;
      if (ni < 0 || ni >= next.length) return p;
      const [it] = next.splice(idx, 1);
      next.splice(ni, 0, it);
      return { ...p, qualifications: next };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "#0D0D0D4D",
          backdropFilter: "blur(24px)",
        }}
        onClick={onClose}
      />

      {/* Side Modal */}
      <div
        className="relative bg-[#1D1D1D] h-full flex flex-col"
        style={{ width: "720px" }}
      >
        {/* Header */}
        <div className="flex items-center pb-2 px-10 pt-10 gap-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-lg hover:bg-[#333333] transition-colors duration-200"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              padding: "4px",
              background: "#282828",
            }}
          >
            <Image
              src="/images/close-cross.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </button>
          <h2
            className="text-white"
            style={{
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0%",
            }}
          >
            {isEdit ? "Edit job post" : "Create new post"}
          </h2>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col py-6 px-10 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* Form Fields Container */}
            <div className="space-y-5">
              {/* Job Title */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label
                  className="text-[#BFBFBF]"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16px",
                    letterSpacing: "0%",
                  }}
                >
                  Job title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                  className="bg-[#282828] text-white border-0 rounded-lg w-full outline-none"
                  style={{
                    height: "44px",
                    paddingTop: "12px",
                    paddingRight: "20px",
                    paddingBottom: "12px",
                    paddingLeft: "20px",
                    fontSize: "14px",
                    lineHeight: "20px",

                    fontWeight: 400,
                  }}
                  placeholder="Boxing Workouts vs. Other Cardio Exercises"
                />
              </div>

              {/* Department/Category and Location */}
              <div className="flex gap-4">
                <div className="flex flex-col flex-1" style={{ gap: "8px" }}>
                  <label
                    className="text-[#BFBFBF]"
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    Department/Category
                  </label>
                  <select
                    name="departmentId"
                    value={String(formData.departmentId)}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        departmentId: e.target.value
                          ? Number(e.target.value)
                          : "",
                      }))
                    }
                    required
                    className="bg-[#282828] border-0 rounded-lg outline-none appearance-none"
                    style={{
                      width: "100%",
                      height: "44px",
                      paddingTop: "12px",
                      paddingRight: "20px",
                      paddingBottom: "12px",
                      paddingLeft: "20px",
                      fontSize: "14px",
                      lineHeight: "20px",

                      fontWeight: 400,
                      color: formData.departmentId ? "#FFFFFF" : "#BFBFBF",
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BFBFBF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 20px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="" style={{ color: "#BFBFBF" }}>
                      Select department
                    </option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#282828]">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col flex-1" style={{ gap: "8px" }}>
                  <label
                    className="text-[#BFBFBF]"
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    Location
                  </label>
                  <select
                    name="locationId"
                    value={String(formData.locationId)}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        locationId: e.target.value
                          ? Number(e.target.value)
                          : "",
                      }))
                    }
                    required
                    className="bg-[#282828] border-0 rounded-lg outline-none appearance-none"
                    style={{
                      width: "100%",
                      height: "44px",
                      paddingTop: "12px",
                      paddingRight: "20px",
                      paddingBottom: "12px",
                      paddingLeft: "20px",
                      fontSize: "14px",
                      lineHeight: "20px",

                      fontWeight: 400,
                      color: formData.locationId ? "#FFFFFF" : "#BFBFBF",
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BFBFBF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 20px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="" style={{ color: "#BFBFBF" }}>
                      Select location
                    </option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id} className="bg-[#282828]">
                        {l.full_location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Type and Application Deadline */}
              <div className="flex gap-4">
                <div className="flex flex-col flex-1" style={{ gap: "8px" }}>
                  <label
                    className="text-[#BFBFBF]"
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    Job type
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    required
                    className="bg-[#282828] border-0 rounded-lg outline-none appearance-none"
                    style={{
                      width: "100%",
                      height: "44px",
                      paddingTop: "12px",
                      paddingRight: "20px",
                      paddingBottom: "12px",
                      paddingLeft: "20px",
                      fontSize: "14px",
                      lineHeight: "20px",

                      fontWeight: 400,
                      color: formData.jobType ? "#FFFFFF" : "#BFBFBF",
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23BFBFBF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 20px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="" style={{ color: "#BFBFBF" }}>
                      Select job type
                    </option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="flex flex-col flex-1" style={{ gap: "8px" }}>
                  <label
                    className="text-[#BFBFBF]"
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      letterSpacing: "0%",
                    }}
                  >
                    Application deadline
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      required
                      className="bg-[#282828] border-0 rounded-lg outline-none w-full"
                      style={{
                        height: "44px",
                        paddingTop: "12px",
                        paddingRight: "48px",
                        paddingBottom: "12px",
                        paddingLeft: "52px",
                        fontSize: "14px",
                        lineHeight: "20px",

                        fontWeight: 400,
                        colorScheme: "dark",
                        color: "#FFFFFF",
                      }}
                      placeholder="YYYY-MM-DD"
                    />
                    <Image
                      src="/images/careers/calendar-01.svg"
                      alt="Calendar"
                      width={16}
                      height={16}
                      className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none z-10"
                    />
                  </div>
                </div>
              </div>

              {/* Job Description - Takes remaining height */}
              <div className="flex flex-col flex-1 mt-5" style={{ gap: "8px" }}>
                <label
                  className="text-[#BFBFBF]"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16px",
                    letterSpacing: "0%",
                  }}
                >
                  Job description
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  required
                  className="bg-[#282828] text-white w-full border-0 rounded-lg outline-none resize-none flex-1"
                  style={{
                    paddingTop: "12px",
                    paddingRight: "20px",
                    paddingBottom: "12px",
                    paddingLeft: "20px",
                    fontSize: "14px",
                    lineHeight: "20px",

                    fontWeight: 400,
                  }}
                  placeholder="In recent years, boxing workouts have become increasingly popular among people who are looking for an effective way to get in shape."
                />
              </div>

              {/* Skills Required */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label
                  className="text-[#BFBFBF]"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  Skills required
                </label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleInputChange}
                  className="bg-[#282828] text-white border-0 rounded-lg w-full outline-none"
                  style={{
                    height: "44px",
                    padding: "12px 20px",
                    fontSize: "14px",
                    lineHeight: "20px",

                    fontWeight: 400,
                  }}
                  placeholder="e.g. React, TypeScript, CSS"
                />
              </div>

              {/* Role - multi items */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label
                  className="text-[#BFBFBF]"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  Role
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="bg-[#282828] text-white border-0 rounded-lg flex-1 outline-none"
                    style={{
                      height: "44px",
                      padding: "12px 20px",
                      fontSize: "14px",
                    }}
                    placeholder="Add role item"
                  />
                  <button
                    type="button"
                    onClick={addRole}
                    className="bg-[#00DBDC] text-[#0D0D0D] rounded px-3"
                    style={{ height: "44px" }}
                  >
                    Add
                  </button>
                </div>
                {formData.roleItems.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {formData.roleItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-[#282828] rounded px-3"
                        style={{ height: "40px" }}
                      >
                        <span className="text-white text-sm">{item}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveRole(idx, -1)}
                            className="text-[#BFBFBF] text-sm"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveRole(idx, 1)}
                            className="text-[#BFBFBF] text-sm"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeRole(idx)}
                            className="text-red-400 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills and Qualifications - multi items */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label
                  className="text-[#BFBFBF]"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  Skills and Qualifications
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qualificationInput}
                    onChange={(e) => setQualificationInput(e.target.value)}
                    className="bg-[#282828] text-white border-0 rounded-lg flex-1 outline-none"
                    style={{
                      height: "44px",
                      padding: "12px 20px",
                      fontSize: "14px",
                    }}
                    placeholder="Add skill/qualification"
                  />
                  <button
                    type="button"
                    onClick={addQualification}
                    className="bg-[#00DBDC] text-[#0D0D0D] rounded px-3"
                    style={{ height: "44px" }}
                  >
                    Add
                  </button>
                </div>
                {formData.qualifications.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {formData.qualifications.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-[#282828] rounded px-3"
                        style={{ height: "40px" }}
                      >
                        <span className="text-white text-sm">{item}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveQualification(idx, -1)}
                            className="text-[#BFBFBF] text-sm"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQualification(idx, 1)}
                            className="text-[#BFBFBF] text-sm"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeQualification(idx)}
                            className="text-red-400 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Years of experience */}
              <div className="flex flex-col" style={{ gap: "8px" }}>
                <label
                  className="text-[#BFBFBF]"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  Years of experience
                </label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className="bg-[#282828] text-white border-0 rounded-lg w-full outline-none"
                  style={{
                    height: "44px",
                    padding: "12px 20px",
                    fontSize: "14px",
                  }}
                  placeholder="e.g. 2-4"
                />
              </div>
            </div>

            {/* Submit Button - Bottom Right */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="bg-[#00DBDC] text-[#0D0D0D] rounded hover:bg-[#00C5C8] transition-colors duration-200"
                style={{
                  width: "135px",
                  height: "36px",
                  paddingTop: "8px",
                  paddingRight: "16px",
                  paddingBottom: "8px",
                  paddingLeft: "16px",

                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0%",
                }}
              >
                Create job post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobPostModal;
