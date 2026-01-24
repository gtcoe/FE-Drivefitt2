/**
 * External API Types Constants
 * Defines types for external_api_logs table
 */

export enum ExternalApiType {
  YOACTIV_ADD_MEMBER = 1,
  YOACTIV_SAVE_BILL = 2,
  YOACTIV_SAVE_ENQUIRY = 3,
}

export const ExternalApiTypeLabels: Record<ExternalApiType, string> = {
  [ExternalApiType.YOACTIV_ADD_MEMBER]: "YoActiv AddMember",
  [ExternalApiType.YOACTIV_SAVE_BILL]: "YoActiv SaveBill",
  [ExternalApiType.YOACTIV_SAVE_ENQUIRY]: "YoActiv SaveEnquiry",
};

export type ExternalApiStatus = "pending" | "success" | "failed";

export interface ExternalApiLog {
  id?: number;
  type: ExternalApiType;
  payload: Record<string, unknown>;
  response: Record<string, unknown> | null;
  status: ExternalApiStatus;
  error_message?: string | null;
  duration_ms?: number | null;
  created_at?: Date;
  updated_at?: Date;
}
