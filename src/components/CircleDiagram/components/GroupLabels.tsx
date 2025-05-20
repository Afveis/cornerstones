
import React from "react";
import { Group } from "../types";

interface GroupLabelsProps {
  groups: Group[];
  paths: string[];
}

export const GroupLabels: React.FC<GroupLabelsProps> = ({ groups, paths }) => {
  return (
    <>
      {groups.map((group, index) => (
        <text
          key={`theme-label-${index}`}
          className="text-xs font-medium uppercase"
          fill="white"
          style={{ zIndex: 50 }}
        >
          <textPath
            href={`#curve${index}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {group.label || `Theme ${index + 1}`}
          </textPath>
        </text>
      ))}
    </>
  );
};
