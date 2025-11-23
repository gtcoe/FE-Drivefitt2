"use client";

import React, { useState } from "react";
import { uploadAPI } from "@/services/uploadAPI";
import { applicationAPI } from "@/services/applicationAPI";

interface ApplyNowFormProps {
  jobId: string;
  isMobile?: boolean;
}

const ApplyNowForm: React.FC<ApplyNowFormProps> = ({ jobId, isMobile }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    salary: "",
    resume: null as File | null,
    resumeUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log("isMobile: ", isMobile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, resume: file }));
      try {
        setUploading(true);
        const presign = await uploadAPI.getPresignURL(
          "resume",
          file.name,
          file.type || "application/octet-stream"
        );
        await uploadAPI.putFileToS3(presign.uploadUrl, file);
        setFormData((prev) => ({ ...prev, resumeUrl: presign.cdnUrl }));
      } catch {
        setFormData((prev) => ({ ...prev, resume: null, resumeUrl: "" }));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resumeUrl) return;
    setSubmitting(true);
    try {
      await applicationAPI.create({
        candidate_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        job_id: Number(jobId),
        current_location: formData.location,
        work_exprience: formData.experience,
        expected_salary: formData.salary,
        resume: formData.resumeUrl,
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        salary: "",
        resume: null,
        resumeUrl: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full h-fit rounded-[20px] mx-6 md:mx-0 px-6 py-8 md:w-[924px] md:rounded-[40px] md:p-12 bg-gradient-to-b from-[#1E1E1E] to-[#141414] border-2 border-[#333333] mt-[-160px] md:mt-[-340px]"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[#8A8A8A] text-sm font-light">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="bg-white rounded-lg px-4 py-3 text-black placeholder-[#8A8A8A] font-light"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="text-[#8A8A8A] text-sm font-light">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-white rounded-lg px-4 py-3 text-black placeholder-[#8A8A8A] font-light"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-[#8A8A8A] text-sm font-light">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="bg-white rounded-lg px-4 py-3 text-black placeholder-[#8A8A8A] font-light"
              placeholder="Enter phone number"
            />
          </div>

          {/* Current Location */}
          <div className="flex flex-col gap-2">
            <label className="text-[#8A8A8A] text-sm font-light">
              Current Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="bg-white rounded-lg px-4 py-3 text-black placeholder-[#8A8A8A] font-light"
              placeholder="Enter your city"
            />
          </div>

          {/* Work Experience */}
          <div className="flex flex-col gap-2">
            <label className="text-[#8A8A8A] text-sm font-light">
              Work Experience *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              className="bg-white rounded-lg px-4 py-3 text-black placeholder-[#8A8A8A] font-light"
              placeholder="Enter experience level"
            />
          </div>

          {/* Expected Salary */}
          <div className="flex flex-col gap-2">
            <label className="text-[#8A8A8A] text-sm font-light">
              Expected Salary *
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              required
              className="bg-white rounded-lg px-4 py-3 text-black placeholder-[#8A8A8A] font-light"
              placeholder="e.g. 5 LPA"
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div className="mt-6">
          <label className="text-[#8A8A8A] text-sm font-light">Resume *</label>
          <div className="mt-2">
            <label
              htmlFor="resume"
              className="w-fit px-6 py-2.5 border border-[#00DBDC] text-[#00DBDC] rounded-lg cursor-pointer"
            >
              Upload Your Resume
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className={`${isMobile ? "mt-6" : "mt-8"} flex justify-end`}>
          <button
            type="submit"
            className="bg-[#00DBDC] text-black px-8 py-2.5 rounded-lg border border-transparent"
            disabled={submitting || uploading || !formData.resumeUrl}
          >
            {submitting
              ? "Submitting..."
              : uploading
              ? "Uploading..."
              : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyNowForm;
