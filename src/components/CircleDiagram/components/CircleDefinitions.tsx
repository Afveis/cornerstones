
import React from 'react';
import { Group } from '../types';
import { PathGenerators } from '../PathGenerators';

interface CircleDefinitionsProps {
  config: {
    outerRadius: number;
    centerRadius: number;
  };
  groups: Group[];
  pathGenerators: PathGenerators;
}

export const CircleDefinitions: React.FC<CircleDefinitionsProps> = ({
  config,
  groups,
  pathGenerators,
}) => {
  return (
    <defs>
      <filter id="centerShadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
        <feOffset dx="0" dy="0" result="offsetblur" />
        <feFlood floodColor="#535353" floodOpacity="0.5" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id="centerCircleClip">
        <circle
          cx={config.outerRadius}
          cy={config.outerRadius}
          r={config.centerRadius}
        />
      </clipPath>
      {groups.map((group, groupIndex) =>
        group.slices.map((_, sliceIndex) => (
          <clipPath 
            key={`clip-${groupIndex}-${sliceIndex}`} 
            id={`slice-clip-${groupIndex}-${sliceIndex}`}
          >
            <path d={pathGenerators.createSlicePath(sliceIndex, groupIndex)} />
          </clipPath>
        ))
      )}
    </defs>
  );
};
