"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardGraphProps {
  title: string;
  value: string | number;
  data: any[];
  type: "line" | "bar";
  timeRange: string;
  onTimeRangeChange?: (range: string) => void;
}

const DashboardGraph: React.FC<DashboardGraphProps> = ({
  title,
  value,
  data,
  type,
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <div className="bg-[#1D1D1D] rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3
            className="text-[#BFBFBF] mb-2"
            style={{
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "16px",
            }}
          >
            {title}
          </h3>
          <span
            className="text-[#BFBFBF]"
            style={{
              fontWeight: 300,
              fontSize: "40px",
              lineHeight: "100%",
            }}
          >
            {value}
          </span>
        </div>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => {
              if (onTimeRangeChange) {
                onTimeRangeChange(e.target.value);
              }
            }}
            className="appearance-none bg-[#0D0D0D] text-[#BFBFBF] rounded-lg pl-4 pr-8 py-2 border border-[#2D2D2D] focus:outline-none cursor-pointer"
            style={{
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#8A8A8A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis
                dataKey="date"
                stroke="#8A8A8A"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#8A8A8A" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1D1D1D",
                  border: "1px solid #2D2D2D",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5EEAD4"
                strokeWidth={2}
                dot={{ fill: "#5EEAD4", r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
              <XAxis
                dataKey="date"
                stroke="#8A8A8A"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#8A8A8A" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1D1D1D",
                  border: "1px solid #2D2D2D",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#5EEAD4" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardGraph;
