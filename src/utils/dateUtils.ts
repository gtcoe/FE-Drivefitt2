/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a date string from "YYYY-MM-DD" to "DD-MM-YYYY"
 * @param dateString - Date string in "YYYY-MM-DD" format
 * @returns Formatted date string in "DD-MM-YYYY" format
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original if formatting fails
  }
};

/**
 * Formats a date string from "DD-MM-YYYY" to "YYYY-MM-DD" for HTML date input
 * @param dateString - Date string in "DD-MM-YYYY" format
 * @returns Formatted date string in "YYYY-MM-DD" format
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Parse DD-MM-YYYY format
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];

      // Validate parts
      if (
        day &&
        month &&
        year &&
        day.length === 2 &&
        month.length === 2 &&
        year.length === 4
      ) {
        return `${year}-${month}-${day}`;
      }
    }

    return dateString; // Return original if parsing fails
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return dateString; // Return original if formatting fails
  }
};

/**
 * Validates if a date string is in valid DD-MM-YYYY format
 * @param dateString - Date string to validate
 * @returns True if valid DD-MM-YYYY format
 */
export const isValidDateFormat = (dateString: string): boolean => {
  if (!dateString) return false;

  try {
    const parts = dateString.split("-");
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > 2100) return false;

    // Basic month day validation
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const maxDays = daysInMonth[month - 1];

    // Handle leap year for February
    if (
      month === 2 &&
      year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0)
    ) {
      if (day > 29) return false;
    } else {
      if (day > maxDays) return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Converts a date string to a Date object, handling both formats
 * @param dateString - Date string in either "YYYY-MM-DD" or "DD-MM-YYYY" format
 * @returns Date object or null if invalid
 */
export const parseDateString = (dateString: string): Date | null => {
  if (!dateString) return null;

  try {
    // Try parsing as YYYY-MM-DD first (standard format)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) return date;
    }

    // Try parsing as DD-MM-YYYY
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date constructor
      const year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) return date;
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing date string:", error);
    return null;
  }
};
