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
}

const DashboardGraph: React.FC<DashboardGraphProps> = ({
  title,
  value,
  data,
  type,
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
