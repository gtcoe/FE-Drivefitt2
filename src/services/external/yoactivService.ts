/**
 * YoActiv API Service
 * Handles integration with YoActiv billing and member management system
 */

import { ExternalApiType } from "@/constants/externalApiTypes";
import { externalApiLogger } from "./externalApiLogger";

interface YoActivConfig {
  apiKey: string;
  billingApiKey: string;
  branchId: string;
  baseURL: string;
}

interface AddMemberRequest {
  Name: string;
  Mail: string;
  Ccode: string;
  Mobile: string;
}

interface ServiceDetail {
  serviceVariationid: number;
  StartDate: string; // Format: DD-MM-YYYY
  EndDate: string; // Format: DD-MM-YYYY
  amount: number;
  discountAmount: number;
}

interface SaveBillRequest {
  ServiceDetails: ServiceDetail[];
  Paid: number;
  TransactionID: string;
  Purchagedate: string; // Format: DD-MM-YYYY (keeping typo as per API)
  SalesStfid: number;
  PtStfid: number;
  CountryCode: string;
  Mobile: string;
}

interface YoActivResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

class YoActivService {
  private config: YoActivConfig;

  constructor() {
    this.config = {
      apiKey: process.env.YOACTIV_API_KEY || "",
      billingApiKey: process.env.YOACTIV_BILLING_API_KEY || "",
      branchId: process.env.YOACTIV_BRANCH_ID || "1",
      baseURL: "https://api.yoactiv.com",
    };
  }

  /**
   * Add a new member to YoActiv system
   * Used for: User signups, Contact form submissions, Lead generation
   */
  async addMember(data: {
    name: string;
    email: string;
    phone: string;
    countryCode?: string;
  }): Promise<YoActivResponse> {
    const startTime = Date.now();
    const endpoint = `${this.config.baseURL}/Billing/AddMember`;

    const payload: AddMemberRequest = {
      Name: data.name,
      Mail: data.email,
      Ccode: data.countryCode || "+91",
      Mobile: data.phone,
    };

    try {
      console.log("🔄 [YoActiv] AddMember Request:", {
        endpoint,
        timestamp: new Date().toISOString(),
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          countryCode: data.countryCode || "+91",
        },
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          API_Key: this.config.apiKey,
          Branch_Id: this.config.branchId,
        },
        body: JSON.stringify(payload),
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();
      let responseData: unknown;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      if (!response.ok) {
        console.error("❌ [YoActiv] AddMember Failed:", {
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          response: responseData,
        });

        // Log failure to database
        externalApiLogger.logApiCallAsync({
          type: ExternalApiType.YOACTIV_ADD_MEMBER,
          payload: payload as unknown as Record<string, unknown>,
          response: responseData as Record<string, unknown>,
          status: "failed",
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          durationMs: duration,
        });

        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          data: responseData,
        };
      }

      // Check for YoActiv success response format
      const isSuccess =
        typeof responseData === "object" &&
        responseData !== null &&
        "Data" in responseData &&
        typeof (responseData as { Data?: unknown }).Data === "object" &&
        (responseData as { Data?: { Member_Id?: unknown } }).Data?.Member_Id !==
          undefined;

      console.log("✅ [YoActiv] AddMember Success:", {
        duration: `${duration}ms`,
        response: responseData,
        memberId: isSuccess
          ? (responseData as { Data: { Member_Id: unknown } }).Data.Member_Id
          : "N/A",
      });

      // Log success to database
      externalApiLogger.logApiCallAsync({
        type: ExternalApiType.YOACTIV_ADD_MEMBER,
        payload: payload as unknown as Record<string, unknown>,
        response: responseData as unknown as Record<string, unknown>,
        status: isSuccess ? "success" : "failed",
        errorMessage: isSuccess ? null : "Invalid response format",
        durationMs: duration,
      });

      return {
        success: isSuccess,
        data: responseData,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("❌ [YoActiv] AddMember Error:", {
        duration: `${duration}ms`,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Log error to database
      externalApiLogger.logApiCallAsync({
        type: ExternalApiType.YOACTIV_ADD_MEMBER,
        payload: payload as unknown as Record<string, unknown>,
        response: null,
        status: "failed",
        errorMessage: errorMessage,
        durationMs: duration,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Save a bill/purchase to YoActiv system
   * Used for: Membership purchases, payment completions
   */
  async saveBill(data: {
    mobile: string;
    countryCode?: string;
    transactionId: string;
    purchaseDate: Date;
    startDate: Date;
    endDate: Date;
    amount: number;
    discountAmount: number;
    paidAmount: number;
    salesStaffId?: number;
    serviceVariationId?: number;
  }): Promise<YoActivResponse> {
    const startTime = Date.now();
    const endpoint = `${this.config.baseURL}/Billing/SaveBill`;

    // Format dates to DD-MM-YYYY
    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const payload: SaveBillRequest = {
      ServiceDetails: [
        {
          serviceVariationid:
            data.serviceVariationId ||
            Number(process.env.YOACTIV_SERVICE_VARIATION_ID) ||
            1217281,
          StartDate: formatDate(data.startDate),
          EndDate: formatDate(data.endDate),
          amount: data.amount,
          discountAmount: data.discountAmount,
        },
      ],
      Paid: data.paidAmount,
      TransactionID: data.transactionId,
      Purchagedate: formatDate(data.purchaseDate),
      SalesStfid:
        data.salesStaffId || Number(process.env.YOACTIV_SALES_STAFF_ID) || 136,
      PtStfid: 0,
      CountryCode: data.countryCode || "+91",
      Mobile: data.mobile,
    };

    try {
      console.log("🔄 [YoActiv] SaveBill Request:", {
        endpoint,
        timestamp: new Date().toISOString(),
        data: payload,
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          API_Key: this.config.billingApiKey,
          Branch_Id: this.config.branchId,
        },
        body: JSON.stringify(payload),
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();
      let responseData: unknown;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      if (!response.ok) {
        console.error("❌ [YoActiv] SaveBill Failed:", {
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          response: responseData,
        });

        // Log failure to database
        externalApiLogger.logApiCallAsync({
          type: ExternalApiType.YOACTIV_SAVE_BILL,
          payload: payload as unknown as Record<string, unknown>,
          response: responseData as unknown as Record<string, unknown>,
          status: "failed",
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          durationMs: duration,
        });

        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          data: responseData,
        };
      }

      // Check for YoActiv success response format
      const isSuccess =
        typeof responseData === "object" &&
        responseData !== null &&
        "Data" in responseData &&
        typeof (responseData as { Data?: unknown }).Data === "object" &&
        (responseData as { Data?: { billsid?: unknown } }).Data?.billsid !==
          undefined;

      console.log("✅ [YoActiv] SaveBill Success:", {
        duration: `${duration}ms`,
        response: responseData,
        billId: isSuccess
          ? (responseData as { Data: { billsid: unknown } }).Data.billsid
          : "N/A",
      });

      // Log success to database
      externalApiLogger.logApiCallAsync({
        type: ExternalApiType.YOACTIV_SAVE_BILL,
        payload: payload as unknown as Record<string, unknown>,
        response: responseData as unknown as Record<string, unknown>,
        status: isSuccess ? "success" : "failed",
        errorMessage: isSuccess ? null : "Invalid response format",
        durationMs: duration,
      });

      return {
        success: isSuccess,
        data: responseData,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("❌ [YoActiv] SaveBill Error:", {
        duration: `${duration}ms`,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Log error to database
      externalApiLogger.logApiCallAsync({
        type: ExternalApiType.YOACTIV_SAVE_BILL,
        payload: payload as unknown as Record<string, unknown>,
        response: null,
        status: "failed",
        errorMessage: errorMessage,
        durationMs: duration,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Async wrapper for addMember - fire and forget
   * Logs errors but doesn't throw them
   */
  async addMemberAsync(
    data: Parameters<typeof this.addMember>[0],
  ): Promise<void> {
    this.addMember(data).catch((error) => {
      console.error("❌ [YoActiv] Async AddMember failed:", error);
    });
  }

  /**
   * Async wrapper for saveBill - fire and forget
   * Logs errors but doesn't throw them
   */
  async saveBillAsync(
    data: Parameters<typeof this.saveBill>[0],
  ): Promise<void> {
    this.saveBill(data).catch((error) => {
      console.error("❌ [YoActiv] Async SaveBill failed:", error);
    });
  }
}

// Export singleton instance
export const yoActivService = new YoActivService();

// Export types for use in other files
export type {
  AddMemberRequest,
  SaveBillRequest,
  ServiceDetail,
  YoActivResponse,
};
