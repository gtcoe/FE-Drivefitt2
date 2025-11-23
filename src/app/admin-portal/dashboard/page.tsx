"use client";

import { useState, useEffect, useCallback } from "react";
import AdminHeader from "@/components/AdminPortal/AdminHeader";
import StatsCard from "@/components/AdminPortal/StatsCard";
import DashboardGraph from "@/components/AdminPortal/DashboardGraph";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface DashboardStats {
  sales: number;
  subscriptionCount: number;
  newUserLogin: number;
  formSubmitted: number;
}

interface GraphData {
  date: string;
  value: number;
}

export default function DashboardPage() {
  const [subscriptionTimeRange, setSubscriptionTimeRange] = useState("30");
  const [formsTimeRange, setFormsTimeRange] = useState("30");
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<GraphData[]>([]);
  const [formsData, setFormsData] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionTotal, setSubscriptionTotal] = useState(0);
  const [formsTotal, setFormsTotal] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const statsResponse = await fetch(`/api/admin/dashboard/stats?days=30`);
      const statsData = await statsResponse.json();
      if (statsData.status) {
        setStats(statsData.data);
      }

      const subscriptionResponse = await fetch(
        `/api/admin/dashboard/graph?type=subscription&days=${subscriptionTimeRange}`
      );
      const subscriptionGraphData = await subscriptionResponse.json();
      if (subscriptionGraphData.status) {
        setSubscriptionData(subscriptionGraphData.data.data);
        setSubscriptionTotal(subscriptionGraphData.data.total);
      }

      const formsResponse = await fetch(
        `/api/admin/dashboard/graph?type=forms&days=${formsTimeRange}`
      );
      const formsGraphData = await formsResponse.json();
      if (formsGraphData.status) {
        setFormsData(formsGraphData.data.data);
        setFormsTotal(formsGraphData.data.total);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [subscriptionTimeRange, formsTimeRange]);

  useEffect(() => {
    if (adminUser) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, adminUser]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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
        <div className="p-10 flex items-center justify-center">
          <div className="text-white">Loading dashboard data...</div>
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

      <div className="p-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Sales"
            value={stats ? formatCurrency(stats.sales) : "₹0"}
            subtitle="Last 30 days"
          />
          <StatsCard
            title="Subscription Count"
            value={stats ? stats.subscriptionCount.toLocaleString() : "0"}
            subtitle="Last 30 days"
          />
          <StatsCard
            title="New User Login"
            value={stats ? stats.newUserLogin.toLocaleString() : "0"}
            subtitle="Last 30 days"
          />
          <StatsCard
            title="Form Submitted"
            value={stats ? stats.formSubmitted.toLocaleString() : "0"}
            subtitle="Last 30 days"
          />
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-2 gap-6">
          <DashboardGraph
            title="Subscription"
            value={subscriptionTotal.toLocaleString()}
            data={subscriptionData}
            type="line"
            timeRange={subscriptionTimeRange}
            onTimeRangeChange={setSubscriptionTimeRange}
          />
          <DashboardGraph
            title="Forms Submitted"
            value={formsTotal.toLocaleString()}
            data={formsData}
            type="bar"
            timeRange={formsTimeRange}
            onTimeRangeChange={setFormsTimeRange}
          />
        </div>
      </div>
    </div>
  );
}
