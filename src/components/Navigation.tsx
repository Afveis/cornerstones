
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Overview" },
    { path: "/metrics", label: "Metrics" },
    { path: "/cornerstones", label: "Cornerstones" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="h-[46px] border-b border-[#CBCBCB] bg-[#F3F3F3] fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-8 flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition-colors ${
              location.pathname === link.path
                ? "text-[#222222]"
                : "text-[#8A898C] hover:text-[#222222]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
