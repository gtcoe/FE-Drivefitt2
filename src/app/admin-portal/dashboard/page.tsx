"use client";

import { useState } from "react";
import AdminHeader from "@/components/AdminPortal/AdminHeader";
import StatsCard from "@/components/AdminPortal/StatsCard";
import DashboardGraph from "@/components/AdminPortal/DashboardGraph";
import { AdminUser } from "@/types/adminPortal";

// Mock user data - in real implementation, this would come from authentication
const mockUser: AdminUser = {
  name: "Admin",
  email: "admin@drivefitt.com",
};

// Mock data for graphs
const generateMockData = (days: number) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.unshift({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: Math.floor(Math.random() * 100),
    });
  }
  return data;
};

export default function DashboardPage() {
  const [subscriptionTimeRange, setSubscriptionTimeRange] = useState("30");
  const [formsTimeRange, setFormsTimeRange] = useState("30");

  const subscriptionData = generateMockData(Number(subscriptionTimeRange));
  const formsData = generateMockData(Number(formsTimeRange));

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AdminHeader
        title="Dashboard"
        user={mockUser}
        showSearchButton={false}
        showAddButton={false}
      />

      <div className="p-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatsCard title="Sales" value="₹5,00,000" subtitle="Last 30 days" />
          <StatsCard
            title="Subscription Count"
            value="2,323"
            subtitle="Last 30 days"
          />
          <StatsCard
            title="New User Login"
            value="200"
            subtitle="Last 30 days"
          />
          <StatsCard
            title="Form Submitted"
            value="500"
            subtitle="Last 30 days"
          />
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-2 gap-6">
          <DashboardGraph
            title="Subscription"
            value="200"
            data={subscriptionData}
            type="line"
            timeRange={subscriptionTimeRange}
            onTimeRangeChange={setSubscriptionTimeRange}
          />
          <DashboardGraph
            title="Forms Submitted"
            value="500"
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
