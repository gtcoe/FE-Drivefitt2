"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle }) => {
  return (
    <div
      className="bg-[#1D1D1D] rounded-2xl flex flex-col justify-center"
      style={{
        height: "128px",
        paddingTop: "24px",
        paddingRight: "37px",
        paddingBottom: "24px",
        paddingLeft: "37px",
        gap: "16px",
      }}
    >
      <h3
        className="text-[#BFBFBF]"
        style={{
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "16px",
          letterSpacing: "0%",
        }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-1">
        <span
          className="text-[#BFBFBF]"
          style={{
            fontWeight: 300,
            fontSize: "40px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          {value}
        </span>
        <span
          className="text-[#8A8A8A]"
          style={{
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "16px",
          }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
