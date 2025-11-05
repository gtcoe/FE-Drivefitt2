"use client";

import React from "react";

interface CareerSectionProps {
  title: string;
  quantity: number;
  loading?: boolean;
}

const CareerSection: React.FC<CareerSectionProps> = ({
  title,
  quantity,
  loading = false,
}) => {
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
      <span
        className="text-[#BFBFBF]"
        style={{
          fontWeight: 300,
          fontSize: "40px",
          lineHeight: "100%",
          letterSpacing: "0%",
        }}
      >
        {loading ? "..." : quantity}
      </span>
    </div>
  );
};

export default CareerSection;
