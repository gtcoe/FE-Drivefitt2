import {
  ContactUsRecord,
  FranchiseInquiryRecord,
  LeadGenerationRecord,
  PaginatedResponse,
  FormSubmissionFilters,
  StatusUpdateResponse,
  DeleteResponse,
} from "@/types/formSubmissions";

class FormSubmissionAPI {
  private async fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  private buildQueryString(
    page: number,
    limit: number,
    filters?: FormSubmissionFilters
  ): string {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.status) {
      params.append("status", filters.status.toString());
    }
    if (filters?.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("endDate", filters.endDate);
    }
    if (filters?.sortBy) {
      params.append("sortBy", filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append("sortOrder", filters.sortOrder);
    }

    return params.toString();
  }

  async getContactUsRecords(
    page: number = 1,
    limit: number = 10,
    filters?: FormSubmissionFilters
  ): Promise<PaginatedResponse<ContactUsRecord>> {
    const queryString = this.buildQueryString(page, limit, filters);
    return this.fetchAPI<PaginatedResponse<ContactUsRecord>>(
      `/api/admin/contact-us?${queryString}`
    );
  }

  async getContactUsById(
    id: number
  ): Promise<{ status: boolean; data: ContactUsRecord }> {
    return this.fetchAPI(`/api/admin/contact-us/${id}`);
  }

  async updateContactUsStatus(
    id: number,
    status: number,
    notes?: string
  ): Promise<StatusUpdateResponse> {
    return this.fetchAPI(`/api/admin/contact-us/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  async deleteContactUs(id: number): Promise<DeleteResponse> {
    return this.fetchAPI(`/api/admin/contact-us/${id}`, {
      method: "DELETE",
    });
  }

  exportContactUs(filters?: FormSubmissionFilters): void {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    window.open(`/api/admin/contact-us/export?${params.toString()}`, "_blank");
  }

  async getFranchiseInquiries(
    page: number = 1,
    limit: number = 10,
    filters?: FormSubmissionFilters
  ): Promise<PaginatedResponse<FranchiseInquiryRecord>> {
    const queryString = this.buildQueryString(page, limit, filters);
    return this.fetchAPI<PaginatedResponse<FranchiseInquiryRecord>>(
      `/api/admin/franchise-inquiries?${queryString}`
    );
  }

  async getFranchiseInquiryById(
    id: number
  ): Promise<{ status: boolean; data: FranchiseInquiryRecord }> {
    return this.fetchAPI(`/api/admin/franchise-inquiries/${id}`);
  }

  async updateFranchiseInquiryStatus(
    id: number,
    status: number,
    notes?: string
  ): Promise<StatusUpdateResponse> {
    return this.fetchAPI(`/api/admin/franchise-inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  async deleteFranchiseInquiry(id: number): Promise<DeleteResponse> {
    return this.fetchAPI(`/api/admin/franchise-inquiries/${id}`, {
      method: "DELETE",
    });
  }

  exportFranchiseInquiries(filters?: FormSubmissionFilters): void {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    window.open(
      `/api/admin/franchise-inquiries/export?${params.toString()}`,
      "_blank"
    );
  }

  async getLeadGeneration(
    page: number = 1,
    limit: number = 10,
    filters?: FormSubmissionFilters
  ): Promise<PaginatedResponse<LeadGenerationRecord>> {
    const queryString = this.buildQueryString(page, limit, filters);
    return this.fetchAPI<PaginatedResponse<LeadGenerationRecord>>(
      `/api/admin/lead-generation?${queryString}`
    );
  }

  async getLeadGenerationById(
    id: number
  ): Promise<{ status: boolean; data: LeadGenerationRecord }> {
    return this.fetchAPI(`/api/admin/lead-generation/${id}`);
  }

  async updateLeadGenerationStatus(
    id: number,
    status: number,
    notes?: string
  ): Promise<StatusUpdateResponse> {
    return this.fetchAPI(`/api/admin/lead-generation/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  async deleteLeadGeneration(id: number): Promise<DeleteResponse> {
    return this.fetchAPI(`/api/admin/lead-generation/${id}`, {
      method: "DELETE",
    });
  }

  exportLeadGeneration(filters?: FormSubmissionFilters): void {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    window.open(
      `/api/admin/lead-generation/export?${params.toString()}`,
      "_blank"
    );
  }
}

export const formSubmissionAPI = new FormSubmissionAPI();
