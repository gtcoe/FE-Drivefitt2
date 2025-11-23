export function formatDateForAPI(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatDateForDisplay(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTimeForDisplay(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDateRangePresets() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);

  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  return {
    today: { start: today, end: today, label: "Today" },
    yesterday: { start: yesterday, end: yesterday, label: "Yesterday" },
    last7Days: { start: last7Days, end: today, label: "Last 7 Days" },
    last30Days: { start: last30Days, end: today, label: "Last 30 Days" },
    thisMonth: { start: thisMonthStart, end: today, label: "This Month" },
    lastMonth: {
      start: lastMonthStart,
      end: lastMonthEnd,
      label: "Last Month",
    },
  };
}

export function isDateInRange(
  date: string | Date,
  startDate?: string,
  endDate?: string
): boolean {
  if (!startDate && !endDate) return true;

  const checkDate = new Date(date);

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (checkDate < start) return false;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (checkDate > end) return false;
  }

  return true;
}
