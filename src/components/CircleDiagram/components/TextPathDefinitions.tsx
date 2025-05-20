
import React from "react";
import { Group } from "../types";
import { createTextPath, createSliceTextPath } from "./TextPathUtils";

interface TextPathDefinitionsProps {
  groups: Group[];
  slicesBeforeGroup: number[];
  totalSlices: number;
  outerRadius: number;
}

export const TextPathDefinitions: React.FC<TextPathDefinitionsProps> = ({ 
  groups,
  slicesBeforeGroup,
  totalSlices,
  outerRadius
}) => {
  return (
    <>
      {groups.map((group, index) => (
        <path
          key={`text-path-${index}`}
          id={`curve${index}`}
          d={createTextPath(index, group, outerRadius, slicesBeforeGroup, totalSlices)}
          fill="none"
        />
      ))}
      {groups.map((group, groupIndex) => (
        group.slices.map((_, sliceIndex) => (
          <path
            key={`slice-text-path-${groupIndex}-${sliceIndex}`}
            id={`slice-curve-${groupIndex}-${sliceIndex}`}
            d={createSliceTextPath(sliceIndex, groupIndex, outerRadius, slicesBeforeGroup, totalSlices)}
            fill="none"
          />
        ))
      ))}
    </>
  );
};
