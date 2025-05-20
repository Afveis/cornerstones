
import React from "react";
import { Group } from "../types";

interface SliceLabelsProps {
  groups: Group[];
}

export const SliceLabels: React.FC<SliceLabelsProps> = ({ groups }) => {
  return (
    <>
      {groups.map((group, groupIndex) => (
        group.slices.map((slice, sliceIndex) => (
          <text
            key={`slice-label-${groupIndex}-${sliceIndex}`}
            className="text-[0.5rem] font-medium uppercase"
            fill="white"
            style={{ zIndex: 50 }}
          >
            <textPath
              href={`#slice-curve-${groupIndex}-${sliceIndex}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {slice.label || `Slice ${sliceIndex + 1}`}
            </textPath>
          </text>
        ))
      ))}
    </>
  );
};
