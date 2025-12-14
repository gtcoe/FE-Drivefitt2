"use client";

import { useState, useEffect, useCallback } from "react";
import AdminHeader from "@/components/AdminPortal/AdminHeader";
import StatsCard from "@/components/AdminPortal/StatsCard";
import DashboardGraph from "@/components/AdminPortal/DashboardGraph";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import DateRangeFilter from "@/components/AdminPortal/DateRangeFilter";
import { formatDateForAPI, formatDateForDisplay } from "@/utils/dateFilters";

interface DashboardStats {
  sales: number;
  subscriptionCount: number;
  newUserLogin: number;
  formSubmitted: number;
  contactUsCount: number;
  franchiseCount: number;
  leadsCount: number;
}

interface GraphData {
  date: string;
  value: number;
}

export default function DashboardPage() {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<GraphData[]>([]);
  const [formsData, setFormsData] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionTotal, setSubscriptionTotal] = useState(0);
  const [formsTotal, setFormsTotal] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchDashboardData = useCallback(async () => {
    if (!startDate || !endDate) {
      return;
    }

    setLoading(true);
    try {
      const statsResponse = await fetch(
        `/api/admin/dashboard/stats?startDate=${startDate}&endDate=${endDate}`
      );
      const statsData = await statsResponse.json();
      if (statsData.status) {
        setStats(statsData.data);
      }

      const subscriptionResponse = await fetch(
        `/api/admin/dashboard/graph?type=subscription&startDate=${startDate}&endDate=${endDate}`
      );
      const subscriptionGraphData = await subscriptionResponse.json();
      if (subscriptionGraphData.status) {
        setSubscriptionData(subscriptionGraphData.data.data);
        setSubscriptionTotal(subscriptionGraphData.data.total);
      }

      const formsResponse = await fetch(
        `/api/admin/dashboard/graph?type=forms&startDate=${startDate}&endDate=${endDate}`
      );
      const formsGraphData = await formsResponse.json();
      if (formsGraphData.status) {
        setFormsData(formsGraphData.data.data);
        setFormsTotal(formsGraphData.data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!startDate || !endDate) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      setStartDate(formatDateForAPI(start));
      setEndDate(formatDateForAPI(end));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (adminUser && startDate && endDate) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, adminUser, startDate, endDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDateRangeLabel = () => {
    if (!startDate || !endDate) {
      return "";
    }
    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(
      endDate
    )}`;
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <AdminHeader
          title="Dashboard"
          showSearchButton={false}
          showAddButton={false}
        />
        <div className="p-10">
          <div className="flex justify-end mb-8">
            <DateRangeFilter
              onApply={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onClear={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 29);
                setStartDate(formatDateForAPI(start));
                setEndDate(formatDateForAPI(end));
              }}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="text-white">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AdminHeader
        title="Dashboard"
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="p-10 pt-0">
        <div className="flex justify-end mb-4">
          <DateRangeFilter
            onApply={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onClear={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 29);
              setStartDate(formatDateForAPI(start));
              setEndDate(formatDateForAPI(end));
            }}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className="grid grid-cols-6 gap-4 mb-6">
          <StatsCard
            title="Sales"
            value={stats ? formatCurrency(stats.sales) : "₹0"}
            subtitle=""
          />
          <StatsCard
            title="Subscription Count"
            value={stats ? stats.subscriptionCount.toLocaleString() : "0"}
            subtitle=""
          />
          <StatsCard
            title="New User Login"
            value={stats ? stats.newUserLogin.toLocaleString() : "0"}
            subtitle=""
          />
          <StatsCard
            title="Leads"
            value={stats ? stats.leadsCount.toLocaleString() : "0"}
            subtitle=""
          />
          <StatsCard
            title="Contact Us"
            value={stats ? stats.contactUsCount.toLocaleString() : "0"}
            subtitle=""
          />
          <StatsCard
            title="Franchise"
            value={stats ? stats.franchiseCount.toLocaleString() : "0"}
            subtitle=""
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <DashboardGraph
            title="Subscription"
            value={subscriptionTotal.toLocaleString()}
            data={subscriptionData}
            type="line"
          />
          <DashboardGraph
            title="Forms Submitted"
            value={formsTotal.toLocaleString()}
            data={formsData}
            type="bar"
          />
        </div>
      </div>
    </div>
  );
}
