/**
 * External API Logger Service
 * Handles logging of external API calls to database
 */

import { executeQuery } from "@/lib/database";
import {
  ExternalApiType,
  ExternalApiStatus,
  ExternalApiLog,
} from "@/constants/externalApiTypes";

class ExternalApiLogger {
  /**
   * Log an external API call to database (async)
   * This is a fire-and-forget operation that doesn't block the main flow
   */
  async logApiCall(data: {
    type: ExternalApiType;
    payload: Record<string, unknown>;
    response?: Record<string, unknown> | null;
    status: ExternalApiStatus;
    errorMessage?: string | null;
    durationMs?: number;
  }): Promise<void> {
    try {
      const query = `
        INSERT INTO external_api_logs 
        (type, payload, response, status, error_message, duration_ms)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const params = [
        data.type,
        JSON.stringify(data.payload),
        data.response ? JSON.stringify(data.response) : null,
        data.status,
        data.errorMessage || null,
        data.durationMs || null,
      ];

      await executeQuery(query, params);
      console.log(`✅ [ExternalApiLogger] Logged API call: Type ${data.type}`);
    } catch (error) {
      console.error("❌ [ExternalApiLogger] Failed to log API call:", error);
      // Swallow the error - logging failure should not affect main flow
    }
  }

  /**
   * Async wrapper - fire and forget
   * Use this to log without waiting for completion
   */
  logApiCallAsync(
    data: Parameters<typeof this.logApiCall>[0]
  ): void {
    this.logApiCall(data).catch((error) => {
      console.error("❌ [ExternalApiLogger] Async logging failed:", error);
    });
  }

  /**
   * Update an existing log entry (for retry scenarios)
   */
  async updateApiLog(
    id: number,
    data: {
      response?: Record<string, unknown>;
      status?: ExternalApiStatus;
      errorMessage?: string | null;
      durationMs?: number;
    }
  ): Promise<void> {
    try {
      const updates: string[] = [];
      const params: unknown[] = [];

      if (data.response !== undefined) {
        updates.push("response = ?");
        params.push(JSON.stringify(data.response));
      }

      if (data.status) {
        updates.push("status = ?");
        params.push(data.status);
      }

      if (data.errorMessage !== undefined) {
        updates.push("error_message = ?");
        params.push(data.errorMessage);
      }

      if (data.durationMs !== undefined) {
        updates.push("duration_ms = ?");
        params.push(data.durationMs);
      }

      if (updates.length === 0) {
        return;
      }

      params.push(id);

      const query = `
        UPDATE external_api_logs 
        SET ${updates.join(", ")}
        WHERE id = ?
      `;

      await executeQuery(query, params);
      console.log(`✅ [ExternalApiLogger] Updated log ID: ${id}`);
    } catch (error) {
      console.error("❌ [ExternalApiLogger] Failed to update log:", error);
    }
  }

  /**
   * Get recent logs for a specific API type
   */
  async getRecentLogs(
    type: ExternalApiType,
    limit: number = 10
  ): Promise<ExternalApiLog[]> {
    try {
      const query = `
        SELECT id, type, payload, response, status, error_message, duration_ms, created_at, updated_at
        FROM external_api_logs
        WHERE type = ?
        ORDER BY created_at DESC
        LIMIT ?
      `;

      const results = await executeQuery<ExternalApiLog[]>(query, [
        type,
        limit,
      ]);
      return results || [];
    } catch (error) {
      console.error("❌ [ExternalApiLogger] Failed to fetch logs:", error);
      return [];
    }
  }

  /**
   * Get statistics for API calls
   */
  async getApiStats(type?: ExternalApiType): Promise<{
    total: number;
    success: number;
    failed: number;
    pending: number;
    avgDurationMs: number;
  }> {
    try {
      const whereClause = type ? "WHERE type = ?" : "";
      const params = type ? [type] : [];

      const query = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          AVG(duration_ms) as avgDurationMs
        FROM external_api_logs
        ${whereClause}
      `;

      const results = await executeQuery<
        Array<{
          total: number;
          success: number;
          failed: number;
          pending: number;
          avgDurationMs: number;
        }>
      >(query, params);

      return (
        results?.[0] || {
          total: 0,
          success: 0,
          failed: 0,
          pending: 0,
          avgDurationMs: 0,
        }
      );
    } catch (error) {
      console.error("❌ [ExternalApiLogger] Failed to fetch stats:", error);
      return {
        total: 0,
        success: 0,
        failed: 0,
        pending: 0,
        avgDurationMs: 0,
      };
    }
  }
}

// Export singleton instance
export const externalApiLogger = new ExternalApiLogger();
