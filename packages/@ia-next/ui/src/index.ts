// UI Components Library Placeholder
import React from "react";

export interface PlaceholderProps {
  children?: React.ReactNode;
  className?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  children,
  className = "",
}) => {
  return React.createElement(
    "div",
    { className: `p-4 border border-gray-300 rounded ${className}` },
    children || "UI Component Placeholder",
  );
};

// Export placeholder component (no other components yet)
export default Placeholder;
