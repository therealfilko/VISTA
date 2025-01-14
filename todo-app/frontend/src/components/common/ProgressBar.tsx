// components/common/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  sections: {
    value: number;
    color: string;
    label?: string;
  }[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ sections }) => (
  <div className="w-full bg-neutral-800 rounded-full h-6 relative flex items-center">
    {sections.map((section, index) => (
      <div
        key={index}
        className={`${section.color} h-full flex justify-center items-center text-sm text-white
          ${index === 0 ? "rounded-l-full" : ""}
          ${index === sections.length - 1 ? "rounded-r-full" : ""}`}
        style={{ width: `${section.value}%` }}
      >
        {section.value > 0 && `${section.value.toFixed(0)}%`}
      </div>
    ))}
  </div>
);

export default ProgressBar;
