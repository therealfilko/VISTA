import React from "react";

interface ProgressBarProps {
  sections: {
    value: number;
    color: string;
    label?: string;
  }[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ sections }) => (
  <div className="w-full bg-[#121212] rounded-full h-6 relative flex items-center">
    {sections.map((section, index) => (
      <div
        key={index}
        className={`h-full flex justify-center items-center text-sm text-white
          ${index === 0 ? "rounded-l-full bg-red-500" : ""}
          ${index === 1 ? "bg-yellow-500" : ""}
          ${index === 2 ? "rounded-r-full bg-[#20D760]" : ""}`}
        style={{ width: `${section.value}%` }}
      >
        {section.value > 0 && `${section.value.toFixed(0)}%`}
      </div>
    ))}
  </div>
);

export default ProgressBar;
