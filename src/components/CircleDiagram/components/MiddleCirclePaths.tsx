
import React from "react";
import { Group } from "../types";
import { PathGenerators } from "../PathGenerators";

interface MiddleCirclePathsProps {
  groups: Group[];
  pathGenerators: PathGenerators;
  config: {
    strokeWidth: number;
  }
}

export const MiddleCirclePaths: React.FC<MiddleCirclePathsProps> = ({ 
  groups, 
  pathGenerators,
  config 
}) => {
  return (
    <>
      {groups.map((group, index) => (
        <path
          key={`middle-${index}`}
          d={pathGenerators.createMiddleCirclePath(index, group.slices.length)}
          fill={group.rankingColor}
          stroke="white"
          strokeWidth={config.strokeWidth}
          className="transition-opacity"
        />
      ))}
    </>
  );
};
